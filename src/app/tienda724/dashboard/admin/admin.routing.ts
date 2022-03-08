import {Routes} from '@angular/router';
/***************************************************************
 * Llamar a todas las Rutas que tenga en cada Modulo de la App  *
 ***************************************************************/
import {ManagementRouting} from './management/management.routing';

export const AdminRouting: Routes = [
    { path: 'admin', component: null,
    children: [
        { path: '', redirectTo: 'management', pathMatch: 'full'},
        ...ManagementRouting,
    ]
  },

]
