import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {CommonModule, CurrencyPipe, HashLocationStrategy, LocationStrategy} from '@angular/common';
import {MAT_DATE_LOCALE, MatDialogRef} from '@angular/material';
//import { MaterialModule } from '@angular/material';
import {MaterialModule} from './app.material';

import 'hammerjs';
/*
************************************************
*     modules of  your app
*************************************************
*/
import {AppRouting} from './app.routing';

import {AppComponent} from './app.component';

import {ComponentsModule} from './components/components.module';
import {BillDialogQuantityComponent} from './bill-dialog-quantity/bill-dialog-quantity.component';
import {BillDialogThirdComponent} from './bill-dialog-third/bill-dialog-third.component';
import {ProductOnCategoryComponent} from './product-on-category/product-on-category.component';
import {AutofocusDirective} from '../app/shared/auto-focus.directive';
import {UserIdleModule} from 'angular-user-idle';
import {HTTP_INTERCEPTORS, HttpClientModule} from '@angular/common/http';
import {CustomInterceptor} from './shared/util/CustomInterceptor';
import {SharedModule} from './shared/shared.module';
import {AngularFireMessagingModule} from '@angular/fire/messaging';
import {AngularFireModule} from '@angular/fire';
import {environment} from '../environments/environment';
import {NgxCoolDialogsModule} from 'ngx-cool-dialogs';
import {ToastrModule} from 'ngx-toastr';
import {NgxLoadingModule} from 'ngx-loading';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';



@NgModule({
  declarations: [
    AppComponent,
    BillDialogQuantityComponent,
    BillDialogThirdComponent,
    ProductOnCategoryComponent,
    AutofocusDirective
  ],
  imports: [
    InfiniteScrollModule,
    CommonModule,
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    HttpClientModule,
    NgxLoadingModule.forRoot({}),
    ComponentsModule,
    RouterModule.forRoot(AppRouting),
    MaterialModule,
    ToastrModule.forRoot(), // ToastrModule added
    SharedModule,
    UserIdleModule.forRoot({idle: 7200, timeout: 10, ping: 0}),
    AngularFireModule.initializeApp(environment.firebase),
    AngularFireMessagingModule,
    NgxCoolDialogsModule.forRoot({theme: 'material', // available themes: 'default' | 'material' | 'dark'
      okButtonText: 'Entiendo',
      cancelButtonText: 'Cancelar',
      color: '#8030c3',
      titles: {
        alert: 'Atención',
        confirm: 'Confirmar',
        prompt: 'Ingrese...'
      }
    })
  ],
  providers: [
    {
      provide: MatDialogRef,
      useValue: {}
    },
    {provide: LocationStrategy, useClass: HashLocationStrategy},
    CurrencyPipe,
    { provide: MAT_DATE_LOCALE, useValue: 'en-US' },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: CustomInterceptor ,
      multi: true
    },
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
