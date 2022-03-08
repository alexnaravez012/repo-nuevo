import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
/*
************************************************
*    Material modules for app
*************************************************
*/
import {MaterialModule} from '../../../app.material';
/*
************************************************
*     principal component
*************************************************
*/
import {TypeThirdComponent} from './thirds724/type-third/type-third.component';
import {DashboardComponent} from '../../../dashboard/dashboard.component';
/*
************************************************
*     modules of  your app
*************************************************
*/
import {BusinessRouting} from './business.routing';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    BusinessRouting,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule
  ],
  providers:[],
  declarations: [TypeThirdComponent,DashboardComponent],
  exports:[DashboardComponent]
})
export class BusinessModule { }
