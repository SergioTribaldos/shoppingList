import {Component, OnInit} from '@angular/core';
import {distinctUntilChanged, map, switchMap, tap} from 'rxjs/operators';
import {Product} from '../home/home.page';
import {FirebaseService} from '../../services/firebase.service';
import {Subject} from 'rxjs';
import {ActivatedRoute, Router} from '@angular/router';
import {ModalController, PopoverController} from '@ionic/angular';
import {PopoverComponent} from './components/popover/popover.component';
import {AlertService} from '../../services/alert.service';
import {ModalComponent} from './components/modal/modal.component';

@Component({
    selector: 'app-shopping-list',
    templateUrl: './shopping-list.component.html',
    styleUrls: ['./shopping-list.component.scss'],
})
export class ShoppingListComponent implements OnInit {
    listId: string;
    listName: string;

    tickedItems$: Subject<Product[]> = new Subject<Product[]>();
    untickedItems$: Subject<Product[]> = new Subject<Product[]>();

    constructor(private firebaseService: FirebaseService,
                private route: ActivatedRoute,
                public popoverController: PopoverController,
                private router: Router,
                private alertService: AlertService,
                public modalController: ModalController) {

        this.route.queryParams.pipe(
            tap((list) => {
                const t=JSON.parse(list.members)
                this.listName = list.listName;
                this.listId = list.id;
            }),
            switchMap(({id}) => this.firebaseService.listenToSelectedListChanges(id)),
            distinctUntilChanged(),
            tap((shoppingList: Product[]) => {
                console.log(8);
                const tickedItems = shoppingList.filter((product) => product.ticked);
                const untickedItems = shoppingList.filter((product) => !product.ticked);
                this.tickedItems$.next(tickedItems);
                this.untickedItems$.next(untickedItems);
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
                    handler: (val) => {
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
  /*      const modal = await this.modalController.create({
            component: ModalComponent,
            componentProps:
        });
        return await modal.present();
    }*/
    }
}
