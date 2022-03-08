import {NgModule} from '@angular/core';

import {CommonModule} from '@angular/common';
//import {BrowserModule} from '@angular/platform-browser';
//import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
/*
************************************************
*    Material modules for app
*************************************************
*/
import {MaterialModule} from '../../../../../app.material';
/*
************************************************
*     services of  your app
*************************************************
*/
import {CategoriesService} from './categories.service';
/*

/*
************************************************
*     modules of  your app
*************************************************
*/

//import {   } from "../products";

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
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    MaterialModule,
    //BrowserModule,
    //BrowserAnimationsModule,
  ],
  declarations: [],
  providers:[CategoriesService]
})
export class CategoriesModule { }
