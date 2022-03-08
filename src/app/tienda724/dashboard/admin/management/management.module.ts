import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';


import {ApplicationsComponent} from './applications/applications.component';


@NgModule({
  imports: [
    CommonModule,
    RouterModule
  ],
  declarations: [ApplicationsComponent],
  exports:[ApplicationsComponent]
})
export class ManagementModule { }
