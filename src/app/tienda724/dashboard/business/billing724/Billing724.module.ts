import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
/*
************************************************
*    Material modules for app
*************************************************
*/
import {MaterialModule} from '../../../../app.material';
import {Billing724Routing} from './Billing724.routing';
/*
************************************************
*     principal component
*************************************************
*/

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    Billing724Routing,
    ReactiveFormsModule,
    MaterialModule
  ],
  declarations: [],
  exports:[],
  providers:[]
})
export class Billing724Module { }
