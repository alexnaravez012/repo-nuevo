import {RouterModule, Routes} from '@angular/router';


import {DashboardComponent} from '../../../dashboard/dashboard.component';
/***************************************************************
 * Llamar a todas las Rutas que tenga en cada Modulo de la App  *
 ***************************************************************/
import {NgModule} from '@angular/core';


export const rutas: Routes = [
  {
    path: '', component: null,
    children: [
      { path: '', redirectTo: 'menu', pathMatch: 'full'},
      { path: 'menu', component: DashboardComponent,pathMatch: 'full'},
      { path: 'third', loadChildren: () => import('./thirds724/third/third.module').then(m => m.ThirdModule) },
      { path: 'movement', loadChildren: () => import('./billing724/Billing724.module').then(m => m.Billing724Module) },
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(rutas)],
  exports: [RouterModule],
})
export class BusinessRouting {}

