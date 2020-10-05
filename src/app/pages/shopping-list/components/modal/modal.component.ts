import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import {Observable} from 'rxjs';
import {ShoppingList} from '../../shopping-list.component';
import {take, tap} from 'rxjs/operators';
import {FirebaseService} from '../../../../services/firebase.service';

@Component({
    selector: 'app-modal',
    templateUrl: './modal.component.html',
    styleUrls: ['./modal.component.scss'],
})
export class ModalComponent implements OnInit {
    @Input() shoppingList: Observable<any>;
    @Input() listId: string;

    constructor(private modalController: ModalController, private firebaseService: FirebaseService) {
    }

    ngOnInit() {
    }

    closeModal() {
        this.modalController.dismiss();
    }

    addMember(email: string|number) {
        const newMemberData = {
            [email]: {
                accountCreator: false,
                confirmed: false,
                exist: true,
            }
        };

        this.shoppingList.pipe(
            take(1),
            tap((shoppingList) => {
                const listData = {
                    createdBy: shoppingList.createdBy,
                    listName: shoppingList.listName,
                    listId: this.listId
                };

                this.firebaseService.addCollaborator(newMemberData, listData);
            })
        ).subscribe();

    }

    deleteUser(memberId: string) {
        this.firebaseService.deleteCollaborator(this.listId, memberId);
    }
}
