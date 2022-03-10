import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { MenuComponent } from './components/menu/menu.component';
import { LoginGuard } from './services/guards/login/login.guard';
import { NoLogGuard } from './services/guards/noLog/no-log.guard';
import { InTableGuard } from './services/guards/inTable/in-table.guard';
import { MesasComponent } from './components/mesas/mesas.component';
import { DetailMesaComponent } from './components/detail-mesa/detail-mesa.component';
import { AddProductsMesaComponent } from './components/add-products-mesa/add-products-mesa.component';
import { CajaComponent } from './components/caja/caja.component';
import { OpenBoxGuard } from './services/guards/openBox/open-box.guard';
import { AbrirCajaComponent } from './components/abrir-caja/abrir-caja.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, canActivate:[NoLogGuard]  },
  { path: 'menu', component: MenuComponent, canActivate:[LoginGuard] },
  { path: '', component: MenuComponent, canActivate:[LoginGuard] },
  { path: 'adminrestaurant', component: MesasComponent, canActivate:[LoginGuard] },
  { path: 'detailmesa', component: DetailMesaComponent, canActivate:[InTableGuard,] },
  { path: 'addproductsmesa', component: AddProductsMesaComponent, canActivate:[InTableGuard,] },
  { path: 'boxoption', component: CajaComponent, canActivate:[LoginGuard,OpenBoxGuard] },
  { path: 'openbox', component: AbrirCajaComponent, canActivate:[LoginGuard] }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})

export class AppRoutingModule { }
