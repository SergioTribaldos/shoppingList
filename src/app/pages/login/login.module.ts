import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import {RouterModule, Routes} from '@angular/router';
import {LoginComponent} from './login.component';
import {FormsModule} from '@angular/forms';
import {IonicModule} from '@ionic/angular';

const routes: Routes = [
  {
    path: '',
    component: LoginComponent,
  }
];

@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    RouterModule.forChild(routes)
  ]
})
export class LoginModule { }
