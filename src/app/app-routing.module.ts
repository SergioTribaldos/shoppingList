import {NgModule} from '@angular/core';
import {PreloadAllModules, RouterModule, Routes} from '@angular/router';
import {canActivate, redirectLoggedInTo, redirectUnauthorizedTo} from '@angular/fire/auth-guard';

const routes: Routes = [
    {
        path: 'home',
        loadChildren: () => import('./pages/home/home.module').then(m => m.HomePageModule),
        ...canActivate(() => redirectUnauthorizedTo(['login']))

    },
    {
        path: 'login',
        loadChildren: () => import('./pages/login/login.module').then(m => m.LoginModule),
        ...canActivate(() => redirectLoggedInTo(['home']))
    },
    {
        path: 'shoppingList',
        loadChildren: () => import('./pages/shopping-list/shopping-list.module').then(m => m.ShoppingListModule),
        //...canActivate(() => redirectUnauthorizedTo(['login']))
    },
    {
        path: '**',
        redirectTo: 'login',
        pathMatch: 'full'
    },
];

@NgModule({
    imports: [
        RouterModule.forRoot(routes, {preloadingStrategy: PreloadAllModules})
    ],
    exports: [RouterModule]
})
export class AppRoutingModule {
}

