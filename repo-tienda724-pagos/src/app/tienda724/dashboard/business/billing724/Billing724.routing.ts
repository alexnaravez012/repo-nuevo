import {RouterModule, Routes} from '@angular/router';
/*
************************************************
*     principal component
*************************************************
*/
import {NgModule} from '@angular/core';

/***************************************************************
 * Llamar a todas las Rutas que tenga en cada Modulo de la App  *
 ***************************************************************/


export const rutas: Routes = [

    { path: '', component: null,
      children: [
        {  path: '', loadChildren: () => import('./billing/billing.module').then(m => m.BillingModule) },
      ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(rutas)],
  exports: [RouterModule],
})
export class Billing724Routing {}
