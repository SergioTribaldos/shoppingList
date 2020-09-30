import {Injectable} from '@angular/core';
import {CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Router} from '@angular/router';
import {Observable} from 'rxjs';
import {AngularFireAuthGuard} from '@angular/fire/auth-guard';
import {map, take} from 'rxjs/operators';

@Injectable({
    providedIn: 'root'
})
export class AuthGuard implements CanActivate {
    constructor(private auth: AngularFireAuthGuard, private router: Router) {
    }

    canActivate(
        next: ActivatedRouteSnapshot,
        state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {

        return this.auth.authState.pipe(
            take(1),
            map((userLoggedIn) => {
                if (userLoggedIn) {
                    this.router.navigate(['home']);
                    return false;
                } else {
                    return true;
                }
            })
        );

    }

}
