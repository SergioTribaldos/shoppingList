import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ShoppingListComponent} from './shopping-list.component';
import {HomePageModule} from '../home/home.module';
import {RouterModule, Routes} from '@angular/router';
import {ItemsListComponent} from './components/items-list/items-list.component';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';
import {PopoverComponent} from './components/popover/popover.component';
import {ModalComponent} from './components/modal/modal.component';

const routes: Routes = [
    {
        path: '',
        component: ShoppingListComponent,
    }
];

@NgModule({
    declarations: [ShoppingListComponent, ItemsListComponent, PopoverComponent,ModalComponent],
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        ReactiveFormsModule,
        RouterModule.forChild(routes)
    ]
})
export class ShoppingListModule {
}
