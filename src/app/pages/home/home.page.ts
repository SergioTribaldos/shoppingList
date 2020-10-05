import {ChangeDetectionStrategy, Component, OnDestroy} from '@angular/core';
import {from, Observable, Subject} from 'rxjs';
import {AuthService} from '../../services/auth.service';
import {FirebaseService} from '../../services/firebase.service';
import {exhaustMap, map, takeUntil, tap} from 'rxjs/operators';
import {NavigationExtras, Router} from '@angular/router';
import {AlertService} from '../../services/alert.service';
import {User} from 'firebase';
import {ModalController} from '@ionic/angular';
import {InvitationsModalComponent} from './components/invitations-modal/invitations-modal.component';
import {List} from '../../core/types/interfaces/list';
import {Invitation} from '../../core/types/interfaces/invitation';

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage {

    userLists$: Observable<List[]>;
    userInvitations$: Observable<Invitation[]>;
    userPictureUrl$: Subject<string> = new Subject<string>();
    invitationsNumber$: Subject<number> = new Subject<number>();
    userEmail: string;
    userPictureUrl: string;
    userDisplayName: string;

    constructor(private authService: AuthService,
                private firebaseService: FirebaseService,
                private alertService: AlertService,
                public modalController: ModalController,
                private router: Router) {


        from(this.authService.getUserDetails()).pipe(
            map((user: User) => {
                this.userEmail = user.email;
                this.userPictureUrl = user.photoURL;
                this.userDisplayName = user.displayName;
                this.userPictureUrl$.next(user.photoURL);
                return user;
            }),
            exhaustMap(() => {
                this.userLists$ = this.firebaseService.getUserLists(this.userEmail);
                return this.userLists$;
            }),
            exhaustMap(() => {
                this.userInvitations$ = this.firebaseService.listenToInvitationsChanges(this.userEmail);
                return this.userInvitations$;
            }),
            tap((invitations) => {
                const invitationsLength = invitations.length === 0 ? undefined : invitations.length;
                this.invitationsNumber$.next(invitationsLength);
            })
        ).subscribe();
    }

    async showAddToShoppingListModal() {

        this.alertService.createAlert({
            header: 'Nombre de la lista',
            inputs: [
                {
                    name: 'listName',
                    type: 'text',
                }
            ],
            buttons: [
                {
                    text: 'Cancelar',
                    role: 'cancel',
                    handler: () => {

                    }
                }, {
                    text: 'Aceptar',
                    handler: (val) => {
                        this.addShoppingList(val.listName);
                    }
                }
            ]
        });
    }


    private addShoppingList(listName: string) {
        this.firebaseService.createNewList({
            email: this.userEmail,
            listName,
            photoURL: this.userPictureUrl,
            displayName: this.userDisplayName
        });
    }

    navigateToList(list) {
        const navigationExtras: NavigationExtras = {
            queryParams: {data: JSON.stringify(list)}
        };
        this.router.navigate(['/shoppingList'], navigationExtras);

    }

    async openInvitationsPopover() {
        const popover = await this.modalController.create({
            component: InvitationsModalComponent,
            cssClass: 'my-custom-class',
            componentProps: {invitations: this.userInvitations$, photoURL: this.userPictureUrl, displayName: this.userDisplayName},
        });
        return await popover.present();
    }

}
