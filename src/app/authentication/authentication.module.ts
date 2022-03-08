import {NgModule} from '@angular/core';
import {ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';

import 'hammerjs';

import {LoginComponent} from './login/login.component';
import {AuthenticationComponent} from './authentication.component';

import {NotAuthGuard} from './not-auth.guard';

import {AuthenticationRouting} from './authentication.routing';
import {RecoveryComponent} from './recovery/recovery.component';
import {MatFormFieldModule, MatIconModule} from '@angular/material';
import {NgxLoadingModule} from 'ngx-loading';
import {CommonModule} from '@angular/common';
import { Login2Component } from './login2/login2.component';


@NgModule({
  imports: [
    RouterModule,
    ReactiveFormsModule,
    AuthenticationRouting,
    MatIconModule,
    MatFormFieldModule,
    NgxLoadingModule,
    CommonModule
  ],
  declarations: [LoginComponent, AuthenticationComponent, RecoveryComponent, Login2Component],
  providers: [ NotAuthGuard ],
exports: [ LoginComponent ]
})
export class AuthenticationModule { }
