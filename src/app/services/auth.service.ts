import {Injectable} from '@angular/core';
import {AngularFireAuth} from '@angular/fire/auth';
import {auth} from 'firebase';

@Injectable({
    providedIn: 'root'
})
export class AuthService {

    constructor(public afAuth: AngularFireAuth) {
    }


    login() {
        return this.AuthLogin(new auth.GoogleAuthProvider());
    }

    private AuthLogin(provider): Promise<any> {
        provider.setCustomParameters({
            prompt: 'select_account'
        });
        return this.afAuth.signInWithPopup(provider);
    }

    logout() {
        this.afAuth.signOut();
    }

    getUserDetails() {
        return this.afAuth.currentUser;
    }

}
