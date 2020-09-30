import {Component, OnInit} from '@angular/core';
import {AuthService} from '../../services/auth.service';
import {Router} from '@angular/router';
import {FirebaseService} from '../../services/firebase.service';

@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {

    constructor(private authService: AuthService, private firebaseService: FirebaseService, private router: Router) {
    }

    ngOnInit() {

    }

    login() {
        this.authService.login().then(({user}) => {
            this.firebaseService.setUserCredentials(user);
            this.router.navigate(['/home']);
        }).catch((err) => {
            console.log(err);
        });
    }
}
