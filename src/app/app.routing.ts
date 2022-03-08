import {Routes} from '@angular/router';

import {Tienda724Routing} from './tienda724/tienda724.routing';


export const AppRouting: Routes = [
  {
    path: '',
    loadChildren: () => import('./authentication/authentication.module').then(m => m.AuthenticationModule)
  },
  {
    path: 'dashboard',
    loadChildren: () => import('./tienda724/tienda724.module').then(m => m.Tienda724Module)
  },
  { path: '*', redirectTo:'/',pathMatch:'full'}
];
