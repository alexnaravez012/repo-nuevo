import {RouterModule, Routes} from '@angular/router';


import {LoginComponent} from './login/login.component';
import {AuthenticationComponent} from './authentication.component';
import {NgModule} from '@angular/core';
import {RecoveryComponent} from './recovery/recovery.component';
import { Login2Component } from './login2/login2.component';


const rutas: Routes = [
  {
    path: '', component: AuthenticationComponent,
    children: [
        { path: '', redirectTo: 'login', pathMatch: 'full'},
        { path: 'login', component: Login2Component },
        { path: 'recovery', component: RecoveryComponent },
    ]
  },
];


@NgModule({
  imports: [RouterModule.forChild(rutas)],
  exports: [RouterModule],
})
export class AuthenticationRouting {}
