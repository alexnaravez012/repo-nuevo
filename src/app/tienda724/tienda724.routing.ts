import {RouterModule, Routes} from '@angular/router';


import {Tienda724Component} from './tienda724.component';
/***************************************************************
 * Llamar a todas las Rutas que tenga en cada Modulo de la App  *
 ***************************************************************/
import {NewThirdComponent} from './dashboard/business/thirds724/third/new-third/new-third.component';
import {NgModule} from '@angular/core';


export const rutas: Routes= [
    { path: '', component: Tienda724Component,
        children: [
          { path: '', redirectTo: 'business', pathMatch: 'full' },
          { path: 'business', loadChildren: () => import('./dashboard/business/business.module').then(m => m.BusinessModule) },
          { path: "new-third",      component: NewThirdComponent }
        ]
    }
];

@NgModule({
  imports: [RouterModule.forChild(rutas)],
  exports: [RouterModule],
})
export class Tienda724Routing {}
