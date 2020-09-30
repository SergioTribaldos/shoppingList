import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {IonicModule} from '@ionic/angular';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {HomePage} from './home.page';

import {HomePageRoutingModule} from './home-routing.module';
import {ItemsListComponent} from '../shopping-list/components/items-list/items-list.component';
import {ListPreviewComponent} from './components/list-preview/list-preview.component';


@NgModule({
    imports: [
        CommonModule,
        FormsModule,
        IonicModule,
        HomePageRoutingModule,
        ReactiveFormsModule,
    ],
    declarations: [HomePage, ListPreviewComponent]
})
export class HomePageModule {
}
