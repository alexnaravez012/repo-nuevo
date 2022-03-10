import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';

import {MaterialModule} from '../app.material';

import {NavbarComponent} from './navbar/navbar.component';
import {SidebarComponent} from './sidebar/sidebar.component';
import {OpenBoxComponent} from './open-box/open-box.component';
import {FormsModule} from '@angular/forms';
import {OpenorcloseboxComponent} from './openorclosebox/openorclosebox.component';
import {SelectboxComponent} from './selectbox/selectbox.component';
import {StoreSelectorService} from '../components/store-selector.service';
import {NgxCurrencyModule} from 'ngx-currency';
import { Openorclosebox2Component } from './openorclosebox2/openorclosebox2.component';
import { GaleriaComponent } from './galeria/galeria.component';

@NgModule({
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    FormsModule,
    NgxCurrencyModule,
  ],
  declarations: [
    NavbarComponent,
    SidebarComponent,
    OpenBoxComponent,
    OpenorcloseboxComponent,
    SelectboxComponent,
    Openorclosebox2Component,
    GaleriaComponent
  ],
  exports: [
    NavbarComponent,
    SidebarComponent,
    OpenBoxComponent
  ],
  providers:[
    StoreSelectorService,
  ],
  entryComponents:[OpenBoxComponent,OpenorcloseboxComponent,SelectboxComponent]
})
export class ComponentsModule { }
