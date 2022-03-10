import {RouterModule, Routes} from '@angular/router';
/*
************************************************
*     principal component
*************************************************
*/
import {ThirdDataComponent} from './third-data/third-data.component';
import {NewThirdComponent} from './new-third/new-third.component';
import {EditThirdComponent} from './edit-third/edit-third.component';
import {NgModule} from '@angular/core';

/***************************************************************
 * Llamar a todas las Rutas que tenga en cada Modulo de la App  *
 ***************************************************************/

export const rutas: Routes = [

  { path: '', component: null,
    children: [
        { path: '', redirectTo: 'list', pathMatch: 'full'},
        { path: 'list', component: ThirdDataComponent},
        { path: 'new', component: NewThirdComponent},
        { path: 'edit/:id', component: EditThirdComponent}
    ]
  },
];

@NgModule({
  imports: [RouterModule.forChild(rutas)],
  exports: [RouterModule],
})
export class ThirdRouting {}
