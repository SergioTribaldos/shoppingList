import {ChangeDetectionStrategy, Component} from '@angular/core';
import {from, Observable} from 'rxjs';
import {AuthService} from '../../services/auth.service';
import {FirebaseService} from '../../services/firebase.service';
import {map, tap} from 'rxjs/operators';
import {NavigationExtras, Router} from '@angular/router';
import {AlertService} from '../../services/alert.service';
import {User} from 'firebase';


export interface Product {
    id: string;
    productName: string;
    ticked: boolean;

}

export interface List {
    id: string;
    listName: string;
    members: {
        exist: boolean,
        photoURL: string
    };
}

@Component({
    selector: 'app-home',
    templateUrl: 'home.page.html',
    styleUrls: ['home.page.scss'],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HomePage {
    userLists$: Observable<List[]>;
    userPictureUrl$: Observable<string>;
    userEmail: string;
    userPictureUrl: string;

    constructor(private authService: AuthService,
                private firebaseService: FirebaseService,
                private alertService: AlertService,
                private router: Router) {


        this.userPictureUrl$ = from(this.authService.getUserDetails()).pipe(
            map((user: User) => {
                this.userEmail = user.email;
                this.userPictureUrl = user.photoURL;
                this.getUserLists();
                return user.photoURL;
            })
        );

    }


    private getUserLists() {
        this.userLists$ = this.firebaseService.getUserLists(this.userEmail);
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
        this.firebaseService.createNewList({email: this.userEmail, listName, photoURL: this.userPictureUrl});
    }

    navigateToList(list) {
        const navigationExtras: NavigationExtras = {
            queryParams: {data: JSON.stringify(list)}
        };
        this.router.navigate(['/shoppingList'], {queryParams:{data: JSON.stringify(list)}});

    }
}
