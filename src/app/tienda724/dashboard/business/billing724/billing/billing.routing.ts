import { VsessionComponent } from './bill-main/vsession/vsession.component';
import {RouterModule, Routes} from '@angular/router';
/*
************************************************
*     principal component
*************************************************
*/
import {BillMainComponent} from './bill-main/bill-main.component';
import {ThirdDialogComponent} from './bill-main/third-dialog/third-dialog.component';
import {NewPersonComponent} from '../../thirds724/third/new-person/new-person.component';
import {NewEmployeeComponent} from '../../thirds724/third/new-employee/new-employee.component';
import {CloseBoxComponent} from './bill-main/close-box/close-box.component';
import {CategoriesComponent} from './bill-main/categories/categories.component';
import {InventoryComponent} from './bill-main/inventory/inventory.component';
import {UpdateLegalDataComponent} from './bill-main/update-legal-data/update-legal-data.component';
import {StoresComponent} from './bill-main/stores/stores.component';
import {ReportesComponent} from './bill-main/reportes/reportes.component';
import {BillComponent} from '../billing/bill/bill.component';
import {InBillComponent} from '../billing/in-bill/in-bill.component';
import {OutBillComponent} from '../billing/out-bill/out-bill.component';
import {RefundBillComponent} from '../billing/refund-bill/refund-bill.component';
import {ThirdsComponent} from './bill-main/thirds/thirds.component';
import {ContabilidadComponent} from '../billing/bill-main/contabilidad/contabilidad.component';
import {ReordenComponent} from '../billing/bill-main/reorden/reorden.component';
import {PedidosComponent} from '../billing/bill-main/pedidos/pedidos.component';
import {PedidoManualComponent} from '../billing/bill-main/pedido-manual/pedido-manual.component';
import {NotAuthorizedComponent} from '../billing/bill-main/not-authorized/not-authorized.component';
import {CrearProductoComponent} from '../billing/bill-main/crear-producto/crear-producto.component';
import {CloseBox2Component} from '../billing/bill-main/close-box2/close-box2.component';
import {NgModule} from '@angular/core';
import { DomiciliosComponent } from './bill-main/domicilios/domicilios.component';
import { AdminPedidosComponent } from './bill-main/admin-pedidos/admin-pedidos.component';
import { AdminRestauranteComponent } from './bill-main/admin-restaurante/admin-restaurante.component';

/***************************************************************
 * Llamar a todas las Rutas que tenga en cada Modulo de la App  *
 ***************************************************************/


export const rutas: Routes = [
  { path: '', redirectTo: 'billing', pathMatch: 'full'},
  { path: 'billing', component: null,
    children: [
      { path: '', redirectTo: 'main', pathMatch: 'full'},
      { path: 'main', component: BillMainComponent}
    ]
  },
  { path: 'new-third', component: ThirdDialogComponent },
  { path: 'new-person', component: NewPersonComponent },
  { path: 'new-employee', component: NewEmployeeComponent},
  { path: 'cierrecaja', component: CloseBoxComponent},
  { path: 'categories', component: CategoriesComponent},
  { path: 'inventory', component: InventoryComponent},
  { path: 'store', component: StoresComponent},
  { path: 'legaldata', component: UpdateLegalDataComponent},
  { path: 'reportes', component: ReportesComponent},
  { path: 'compbill', component: BillComponent},
  { path: 'inbill', component: InBillComponent},
  { path: 'outbill', component: OutBillComponent},
  { path: 'devbill', component: RefundBillComponent},
  { path: 'thirds', component: ThirdsComponent},
  { path: 'conta', component: ContabilidadComponent},
  { path: 'reorden', component: ReordenComponent},
  { path: 'pedidos', component: PedidosComponent},
  { path: 'pedman', component: PedidoManualComponent},
  { path: 'nopermision', component: NotAuthorizedComponent },
  { path: 'newproduct', component: CrearProductoComponent },
  { path: 'boxoption', component: CloseBox2Component },
  { path: 'domicilio', component: DomiciliosComponent },
  { path: 'adminpedidos', component: AdminPedidosComponent },
  { path: 'adminrestaurant', component: AdminRestauranteComponent },
  { path: 'vsession', component: VsessionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(rutas)],
  exports: [RouterModule],
})
export class BillingRouting {}

