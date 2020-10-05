import {Component, Input, OnInit} from '@angular/core';
import {ModalController} from '@ionic/angular';
import { Observable} from 'rxjs';
import {FirebaseService} from '../../../../services/firebase.service';
import {Invitation} from '../../../../core/types/interfaces/invitation';


@Component({
    selector: 'app-invitations-modal',
    templateUrl: './invitations-modal.component.html',
    styleUrls: ['./invitations-modal.component.scss'],
})
export class InvitationsModalComponent implements OnInit {

    @Input() invitations: Observable<Invitation[]>;
    @Input() photoURL: string;
    @Input() displayName: string;

    constructor(private modalController: ModalController, private firebaseService: FirebaseService) {
    }

    ngOnInit() {

    }

    closeModal() {
        this.modalController.dismiss();
    }

    acceptInvitation(invitation: Invitation) {
        this.firebaseService.acceptInvitation(invitation, this.photoURL, this.displayName);

    }
}
