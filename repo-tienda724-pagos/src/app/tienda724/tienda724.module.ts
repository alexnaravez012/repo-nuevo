import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';


import 'hammerjs';
// This Module's Components
import {Tienda724Component} from './tienda724.component';
/*
************************************************
*     modules of  your app
*************************************************
*/
import {MaterialModule} from '../app.material';
import {ComponentsModule} from '../components/components.module';
import {Tienda724Routing} from './tienda724.routing';

/*
*************************************************
*     services of  your app
*************************************************
*/

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ReactiveFormsModule,
    Tienda724Routing,
    MaterialModule,
    FormsModule,
    ComponentsModule
  ],
  declarations: [
      Tienda724Component,
  ],
  providers:[DatePipe],
  exports: [
      Tienda724Component,
  ]
})
export class Tienda724Module {
 }
