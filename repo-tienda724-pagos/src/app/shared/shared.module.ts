import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';

import {RouterModule} from '@angular/router';
import {NewPersonComponent} from '../tienda724/dashboard/business/thirds724/third/new-person/new-person.component';
import {MaterialModule} from '../app.material';
import {NewThirdComponent} from '../tienda724/dashboard/business/thirds724/third/new-third/new-third.component';
import {FilterPipeModule} from 'ngx-filter-pipe';
import {NgxCurrencyModule} from 'ngx-currency';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {NewEmployeeComponent} from '../tienda724/dashboard/business/thirds724/third/new-employee/new-employee.component';

/*
************************************************
*    Material modules for app
*************************************************
*/


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    FilterPipeModule,
    NgxCurrencyModule,
    MaterialModule
  ],
  declarations: [
    //Cosas de ThirdModule
    NewPersonComponent,
    NewThirdComponent,
    NewEmployeeComponent
    //////////////////////
  ],
  exports: [
    //Cosas de ThirdModule
    NewPersonComponent,
    NewThirdComponent,
    NewEmployeeComponent
    //////////////////////
  ]
})
export class SharedModule { }
