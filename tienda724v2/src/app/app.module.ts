import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { LoginComponent } from './components/login/login.component';
import { MenuComponent } from './components/menu/menu.component';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { MesasComponent } from './components/mesas/mesas.component';
import { DetailMesaComponent } from './components/detail-mesa/detail-mesa.component';
import { AddProductsMesaComponent } from './components/add-products-mesa/add-products-mesa.component';
import { DatePipe } from '@angular/common';
import { CajaComponent } from './components/caja/caja.component';
import { AbrirCajaComponent } from './components/abrir-caja/abrir-caja.component';

@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    MenuComponent,
    MesasComponent,
    DetailMesaComponent,
    AddProductsMesaComponent,
    CajaComponent,
    AbrirCajaComponent,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    HttpClientModule,
  ],
  providers: [DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule { }
