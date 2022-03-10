import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
/*
************************************************
*     modules of  your app
*************************************************
*/
import {ManagementModule} from './management/management.module';


@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    ManagementModule
  ],
  declarations: []
})
export class AdminModule { }
