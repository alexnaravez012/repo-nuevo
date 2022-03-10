import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
/*
************************************************
*    Material modules for app
*************************************************
*/
import {MaterialModule} from '../../../../../app.material';
/*
************************************************
*     principal component
*************************************************
*/
import {ThirdDataComponent} from './third-data/third-data.component';
import {EditThirdComponent} from './edit-third/edit-third.component';
/*
************************************************
*     modules of  your app
*************************************************
*/
import {DocumentTypeModule} from '../document-type/document-type.module';
/*
************************************************
*     services of  your app
*************************************************
*/
import {ThirdRouting} from './third.routing';
import {SharedModule} from '../../../../../shared/shared.module';

@NgModule({
  imports: [
    CommonModule,
    MaterialModule,
    RouterModule,
    ThirdRouting,
    FormsModule,
    ReactiveFormsModule,
    DocumentTypeModule,
    SharedModule//IMPORTA COMPONENTES COMPARTIDOS ENTRE MODULOS YA QUE SOLO SE PUEDE DEFINIR 1 COMPONENTE POR MODULO
  ],
  exports:[
    ThirdDataComponent,
    EditThirdComponent,
  ],
  declarations: [ ThirdDataComponent,
                  EditThirdComponent,
  ],
  providers:[]
})
export class ThirdModule { }
