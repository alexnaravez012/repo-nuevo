import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';

import 'hammerjs';
import {MaterialModule} from '../../../../../app.material';
/*
************************************************
*     principal component
*************************************************
*/
import {DocumentFilterComponent} from './document-filter/document-filter.component';
/*
************************************************
*     services of  your app
*************************************************
*/

/*
************************************************
*    Material modules for app
*************************************************
*/
/*
************************************************
*     modules of  your app
*************************************************
*/

/*
************************************************
*     routing of  your app
*************************************************
*/
/*
************************************************
*     models of  your app
*************************************************
*/

/*
************************************************
*     constant of  your app
*************************************************
*/




@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers:[],
  declarations: [DocumentFilterComponent],
  exports:[DocumentFilterComponent]
})
export class DocumentTypeModule { }
