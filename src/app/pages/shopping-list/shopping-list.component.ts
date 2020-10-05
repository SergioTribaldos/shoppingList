import {Component, OnInit} from '@angular/core';
import { distinctUntilChanged, map, switchMap, tap} from 'rxjs/operators';
import {FirebaseService} from '../../services/firebase.service';
import {BehaviorSubject, Subject} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalController, PopoverController} from '@ionic/angular';
import {PopoverComponent} from './components/popover/popover.component';
import {AlertService} from '../../services/alert.service';
import {ModalComponent} from './components/modal/modal.component';
import {Product} from '../../core/types/interfaces/product';
import {ShoppingList} from '../../core/types/interfaces/shopping-list';


@Component({
    selector: 'app-shopping-list',
    templateUrl: './shopping-list.component.html',
    styleUrls: ['./shopping-list.component.scss'],
})

export class ShoppingListComponent implements OnInit {
    listId: string;
    listName: string;
    listMembers;

    tickedItems$: Subject<Product[]> = new Subject<Product[]>();
    untickedItems$: Subject<Product[]> = new Subject<Product[]>();
    shoppingList$: BehaviorSubject<ShoppingList> = new BehaviorSubject<ShoppingList>({listName: '', createdBy: '', members: {}});

    constructor(private firebaseService: FirebaseService,
                private route: ActivatedRoute,
                public popoverController: PopoverController,
                private router: Router,
                private alertService: AlertService,
                public modalController: ModalController) {

        this.route.queryParams.pipe(
            map((list) => {
                list = JSON.parse(list.data);
                this.listName = list.listName;
                this.listId = list.id;
                this.listMembers = list.members;
                return list;
            }),
            switchMap(({id}) => this.firebaseService.listenToSelectedListChanges(id)),
            distinctUntilChanged(),
            tap((list) => {
                const tickedItems = list.filter((product) => product.ticked);
                const untickedItems = list.filter((product) => !product.ticked);
                this.tickedItems$.next(tickedItems);
                this.untickedItems$.next(untickedItems);
            }),
            switchMap(() => this.firebaseService.listenToShoppingListChanges(this.listId)),
            distinctUntilChanged(),
            tap((shoppingList) => {
                this.shoppingList$.next(shoppingList);
            })
        ).subscribe();
    }

    ngOnInit() {
    }


    moveToUntickedList(product: Product) {
        this.firebaseService.setItemToUnticked(this.listId, product);
    }

    moveToTickedList(product: Product) {
        this.firebaseService.setItemToTicked(this.listId, product);
    }

    async addEmptyProduct() {
        await this.firebaseService.addEmptyProductToList(this.listId);
    }

    editProductName({productName, product}) {
        this.firebaseService.editProductName(this.listId, productName, product);
    }

    removeProduct(product: Product) {
        this.firebaseService.removeProduct(this.listId, product);
    }

    deleteList() {
        this.alertService.createAlert({
            header: '¿Desea borrar la lista?',
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                }, {
                    text: 'Aceptar',
                    handler: () => {
                        this.firebaseService.deleteList(this.listId).then(() => {
                            this.router.navigate(['home']);
                        });
                    }
                }
            ]
        });
    }

    async presentPopover(ev) {
        const popover = await this.popoverController.create({
            component: PopoverComponent,
            translucent: true,
            cssClass: 'custom-popover',
            event: ev,
        });

        popover.onDidDismiss().then((val) => {
            this[val.data]();
        });
        return await popover.present();
    }


    async addCollaborator() {
        const modal = await this.modalController.create({
            component: ModalComponent,
            componentProps: {shoppingList: this.shoppingList$, listId: this.listId}
        });
        await modal.present();
    }
}
