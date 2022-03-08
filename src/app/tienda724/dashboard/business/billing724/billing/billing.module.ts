import {NgModule} from '@angular/core';
import {CommonModule, DatePipe} from '@angular/common';
//import {BrowserModule} from '@angular/platform-browser';
//import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {RouterModule} from '@angular/router';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
/*
************************************************
*    Material modules for app
*************************************************
*/
import { ScrollingModule } from '@angular/cdk/scrolling';
import {MaterialModule} from '../../../../../app.material';
import {BillComponent} from './bill/bill.component';
import {DetailBillComponent} from './detail-bill/detail-bill.component';
import {DialogQuantityBillComponent} from './dialog-quantity-bill/dialog-quantity-bill.component';
/*
************************************************
*     services of  your app
*************************************************
*/
import {BillDetailComponent} from './bill-detail/bill-detail.component';
import {BillDialogQuantityComponent} from './bill-dialog-quantity/bill-dialog-quantity.component';
import {BillThirdComponent} from './bill-third/bill-third.component';
import {BillDialogThirdComponent} from './bill-dialog-third/bill-dialog-third.component';
import {BillDocumentComponent} from './bill-document/bill-document.component';
import {BillMainComponent} from './bill-main/bill-main.component';
import {QuantityDialogComponent} from './bill-main/quantity-dialog/quantity-dialog.component';
import {ClientDialogComponent} from './bill-main/client-dialog/client-dialog.component';
import {PersonDialogComponent} from './bill-main/person-dialog/person-dialog.component';
import {ThirdDialogComponent} from './bill-main/third-dialog/third-dialog.component';
import {EmployeeDialogComponent} from './bill-main/employee-dialog/employee-dialog.component';
import {SearchClientDialogComponent} from './bill-main/search-client-dialog/search-client-dialog.component';
import {SearchProductDialogComponent} from './bill-main/search-product-dialog/search-product-dialog.component';
import {TransactionConfirmDialogComponent} from './bill-main/transaction-confirm-dialog/transaction-confirm-dialog.component';
import {CloseBoxComponent} from './bill-main/close-box/close-box.component';
import {ViewDetailsBoxComponent} from './bill-main/view-details-box/view-details-box.component';
import {CategoriesComponent} from './bill-main/categories/categories.component';
import {InventoryComponent} from './bill-main/inventory/inventory.component';
import {StoresComponent} from './bill-main/stores/stores.component';
import {UpdateLegalDataComponent} from './bill-main/update-legal-data/update-legal-data.component';
import {NewProductStoreComponent} from './bill-main/new-product-store/new-product-store.component';
import {ReportesComponent} from './bill-main/reportes/reportes.component';
import {ProductsOnCategoryComponent} from './bill-main/products-on-category/products-on-category.component';
import {ProductsOnStoreComponent} from './bill-main/products-on-store/products-on-store.component';
import {ProductsOnStoragesComponent} from './bill-main/products-on-storages/products-on-storages.component';
import {AddCategoryComponent} from './bill-main/add-category/add-category.component';
import {AddBrandComponent} from './bill-main/add-brand/add-brand.component';
import {AddMeasureComponent} from './bill-main/add-measure/add-measure.component';
import {AddProductComponent} from './bill-main/add-product/add-product.component';
import {AddCodeComponent} from './bill-main/add-code/add-code.component';
import {AddProductModalComponent} from './bill-main/add-product-modal/add-product-modal.component';
import {InBillComponent} from './in-bill/in-bill.component';
import {OutBillComponent} from './out-bill/out-bill.component';
import {RefundBillComponent} from './refund-bill/refund-bill.component';
import {TransactionConfirmProvDialogComponent} from './transaction-confirm-prov-dialog/transaction-confirm-prov-dialog.component';
import {AddNotesCloseBoxComponent} from './bill-main/add-notes-close-box/add-notes-close-box.component';
import {GenerateThirdComponentComponent} from './bill-main/generate-third-component/generate-third-component.component';
import {GenerateThirdComponent2Component} from './bill-main/generate-third-component2/generate-third-component2.component';
import {BillInventoryComponentComponent} from './bill-main/bill-inventory-component/bill-inventory-component.component';
import {CreatePriceComponent} from './bill-main/create-price/create-price.component';
import {ProductsOnCategoryComponent2} from './bill-main/products-on-category2/products-on-category2.component';
import {AddGeneralProduct} from './bill-main/add-general-product/add-general-product.component';
import {AddSpecificProductComponent} from './bill-main/add-specific-product/add-specific-product.component';
import {ThirdsComponent} from './bill-main/thirds/thirds.component';
import {EditarCostoComponent} from './bill-main/editar-costo/editar-costo.component';
import {ContabilidadComponent} from './bill-main/contabilidad/contabilidad.component';
import {ReordenComponent} from './bill-main/reorden/reorden.component';
import {PedidosComponent} from './bill-main/pedidos/pedidos.component';
import {PedidosDetailComponent} from './bill-main/pedidos-detail/pedidos-detail.component';
import {PedidosDetail2Component} from './bill-main/pedidos-detail2/pedidos-detail2.component';
import {StatechangeComponent} from './bill-main/statechange/statechange.component';
import {PedidoManualComponent} from './bill-main/pedido-manual/pedido-manual.component';
import {BillUpdateComponent} from './bill-main/bill-update/bill-update.component';
import {ProductsOncategoryUpdateComponent} from './bill-main/products-oncategory-update/products-oncategory-update.component';
import {TopProductsComponent} from './bill-main/top-products/top-products.component';
import {FilterPipeModule} from 'ngx-filter-pipe';
import {NotesModalComponent} from './bill-main/notes-modal/notes-modal.component';
import {ThirdselectComponent} from './thirdselect/thirdselect.component';
import {NoDispCompComponent} from './bill-main/no-disp-comp/no-disp-comp.component';
import {NotesOnOrderComponent} from './bill-main/notes-on-order/notes-on-order.component';
import {BillOrderComponent} from './bill-main/bill-order/bill-order.component';
import {AuditoriaComponent} from './bill-main/auditoria/auditoria.component';
import {OpenBoxReportComponent} from './bill-main/open-box-report/open-box-report.component';
import {NgxCurrencyModule} from 'ngx-currency';
import {NotAuthorizedComponent} from './bill-main/not-authorized/not-authorized.component';
import {CrearProductoComponent} from './bill-main/crear-producto/crear-producto.component';
import {CloseBox2Component} from './bill-main/close-box2/close-box2.component';
import {UpdateNewProductComponent} from './bill-main/update-new-product/update-new-product.component';
import {ContingencyBillListComponent} from './bill-main/contingency-bill-list/contingency-bill-list.component';
import {ContUpdateComponent} from './bill-main/cont-update/cont-update.component';
import {MAT_DIALOG_DATA, MatDialogRef, MatSelectModule} from '@angular/material';
import {DetallePlanillasComponent} from './bill-main/detalle-planillas/detalle-planillas.component';
import {CreatePlanillaComponent} from './bill-main/create-planilla/create-planilla.component';
import {BillsWithProductComponent} from './bill-main/bills-with-product/bills-with-product.component';
import {ThirdListPedidosComponent} from './bill-main/third-list-pedidos/third-list-pedidos.component';
import {SolicitarPedidoReOrdenComponent} from './bill-main/pedidos/solicitar-pedido-re-orden/solicitar-pedido-re-orden.component';
import {ReOrdenNormalComponent} from './bill-main/pedidos/re-orden-normal/re-orden-normal.component';
import {ReOrdenPorProviderComponent} from './bill-main/pedidos/re-orden-por-provider/re-orden-por-provider.component';
import {BillingRouting} from './billing.routing';
import {SharedModule} from '../../../../../shared/shared.module';
import { DomiciliosComponent } from './bill-main/domicilios/domicilios.component';
import { DomiciliosTelefonicosComponent } from './bill-main/domicilios-telefonicos/domicilios-telefonicos.component';
import { PedidosDomiciliosRecibidosComponent } from './bill-main/pedidos-domicilios-recibidos/pedidos-domicilios-recibidos.component';
import { PedidosDomiciliosProcesadosNComponent } from './bill-main/pedidos-domicilios-procesados-n/pedidos-domicilios-procesados-n.component';
import { PedidosDomiciliosProcesadosSComponent } from './bill-main/pedidos-domicilios-procesados-s/pedidos-domicilios-procesados-s.component';
import { PedidosDomiciliosEncaminoComponent } from './bill-main/pedidos-domicilios-encamino/pedidos-domicilios-encamino.component';
import { PedidosDomiciliosEntregadosNComponent } from './bill-main/pedidos-domicilios-entregados-n/pedidos-domicilios-entregados-n.component';
import { PedidosDomiciliosEntregadosSComponent } from './bill-main/pedidos-domicilios-entregados-s/pedidos-domicilios-entregados-s.component';
import { PedidosDomiciliosCalificadosComponent } from './bill-main/pedidos-domicilios-calificados/pedidos-domicilios-calificados.component';
import { PedidosDomiciliosCanceladosComponent } from './bill-main/pedidos-domicilios-cancelados/pedidos-domicilios-cancelados.component';
import { PedidosAprobarNovedadComponent } from './bill-main/pedidos-aprobar-novedad/pedidos-aprobar-novedad.component';
import { PedidosVentaConfirmarComponent } from './bill-main/pedidos-venta-confirmar/pedidos-venta-confirmar.component';
import { ConfirmacionEnvioDomicilioComponent } from './bill-main/confirmacion-envio-domicilio/confirmacion-envio-domicilio.component';
import { PedidoConfirmacionCancelacionComponent } from './bill-main/pedido-confirmacion-cancelacion/pedido-confirmacion-cancelacion.component';
import { PedidosFacturadosComponent } from './bill-main/pedidos-facturados/pedidos-facturados.component';
import { PedidosDomiciliosPlanillasComponent } from './bill-main/pedidos-domicilios-planillas/pedidos-domicilios-planillas.component';
import { PedidosDomiciliosFinalizadosNComponent } from './bill-main/pedidos-domicilios-finalizados-n/pedidos-domicilios-finalizados-n.component';
import { PedidosDomiciliosFinalizadosSComponent } from './bill-main/pedidos-domicilios-finalizados-s/pedidos-domicilios-finalizados-s.component';
import { PedidosDomiciliosCerrarPlanillasComponent } from './bill-main/pedidos-domicilios-cerrar-planillas/pedidos-domicilios-cerrar-planillas.component';
import { CerrarPlanillasCajaComponent } from './bill-main/cerrar-planillas-caja/cerrar-planillas-caja.component';
import { LogPedidosComponent } from './bill-main/log-pedidos/log-pedidos.component';
import { UpdateThirdInfoComponent } from './bill-main/update-third-info/update-third-info.component';
import { ModalNoDomiComponent } from './bill-main/modal-no-domi/modal-no-domi.component';
import { KardexComponent } from './bill-main/kardex/kardex.component';
import { ObservationsNotesComponent } from './bill-main/observations-notes/observations-notes.component';
import { NotesModal2Component } from './bill-main/notes-modal2/notes-modal2.component';
import { MatTreeModule } from '@angular/material'; 
import { TreeGridModule } from '@syncfusion/ej2-angular-treegrid';
import { PageService, SortService, FilterService } from '@syncfusion/ej2-angular-treegrid';
import { PedidosModificarComponent } from './bill-main/pedidos-modificar/pedidos-modificar.component';
import { ReordenConsumoComponent } from './bill-main/reorden-consumo/reorden-consumo.component';
import { ModalCrearPedidosComponent } from './bill-main/modal-crear-pedidos/modal-crear-pedidos.component';
import { ModalCrearComoProveedorComponent } from './bill-main/modal-crear-como-proveedor/modal-crear-como-proveedor.component';
import { ModalCambiarTerceroComponent } from './bill-main/modal-cambiar-tercero/modal-cambiar-tercero.component';
import { ModalConfirmCreateProviderComponent } from './bill-main/modal-confirm-create-provider/modal-confirm-create-provider.component';
import { ModalConfirmEmptyInventoryComponent } from './bill-main/modal-confirm-empty-inventory/modal-confirm-empty-inventory.component';
import { AdminPedidosComponent } from './bill-main/admin-pedidos/admin-pedidos.component';
import { AdminRestauranteComponent } from './bill-main/admin-restaurante/admin-restaurante.component';
import { RegistrarPedidoRestauranteComponent } from './bill-main/registrar-pedido-restaurante/registrar-pedido-restaurante.component';
import { PedidosRestaurantesCreadosComponent } from './bill-main/pedidos-restaurantes-creados/pedidos-restaurantes-creados.component';
import { TableReadComponent } from './bill-main/table-read/table-read.component';
import { DetallesMesaComponent } from './bill-main/detalles-mesa/detalles-mesa.component';
import { EditarPedidoComponent } from './bill-main/editar-pedido/editar-pedido.component';
import { ModalConfirmarCancelacionPedidoComponent } from './bill-main/modal-confirmar-cancelacion-pedido/modal-confirmar-cancelacion-pedido.component';
import { EditarPedidoRestauranteComponent } from './bill-main/editar-pedido-restaurante/editar-pedido-restaurante.component';
import { EditarMeseroComponent } from './bill-main/editar-mesero/editar-mesero.component';
import { ReOrdenPerfectaComponent } from './bill-main/re-orden-perfecta/re-orden-perfecta.component';
import { Mesas2Component } from './bill-main/mesas2/mesas2.component';
import { SelectCancelAdminComponent } from './bill-main/select-cancel-admin/select-cancel-admin.component';
import { SelectCancelAdminDisccountComponent } from './bill-main/select-cancel-admin-disccount/select-cancel-admin-disccount.component';
import { FacturarMesas2Component } from './bill-main/facturar-mesas2/facturar-mesas2.component';
import { AddProductosMesa2Component } from './bill-main/add-productos-mesa2/add-productos-mesa2.component';
import { VsessionComponent } from './bill-main/vsession/vsession.component';
import { NotesComandaComponent } from './bill-main/notes-comanda/notes-comanda.component';
import { TransactionConfirmDialog2Component } from './bill-main/transaction-confirm-dialog2/transaction-confirm-dialog2.component';

@NgModule({
  imports: [
    ScrollingModule,
    TreeGridModule,
    CommonModule,
    RouterModule,
    FormsModule,
    BillingRouting,
    ReactiveFormsModule,
    MaterialModule,
    FilterPipeModule,
    NgxCurrencyModule,
    MatTreeModule,
    SharedModule//IMPORTA COMPONENTES COMPARTIDOS ENTRE MODULOS YA QUE SOLO SE PUEDE DEFINIR 1 COMPONENTE POR MODULO
  ],
  declarations: [
    CloseBoxComponent,
    EmployeeDialogComponent,
    PersonDialogComponent,
    ThirdDialogComponent,
    BillComponent,
    DetailBillComponent,
    DialogQuantityBillComponent,
    BillDetailComponent,
    BillDialogQuantityComponent,
    BillThirdComponent,
    BillDialogThirdComponent,
    BillDocumentComponent,
    BillMainComponent,
    QuantityDialogComponent,
    ClientDialogComponent,
    SearchClientDialogComponent,
    SearchProductDialogComponent,
    TransactionConfirmDialogComponent,
    ViewDetailsBoxComponent,
    CategoriesComponent,
    InventoryComponent,
    StoresComponent,
    UpdateLegalDataComponent,
    NewProductStoreComponent,
    ReportesComponent,
    ProductsOnCategoryComponent,
    ProductsOnStoreComponent,
    ProductsOnStoragesComponent,
    AddCategoryComponent,
    AddBrandComponent,
    AddMeasureComponent,
    AddProductComponent,
    AddCodeComponent,
    AddProductModalComponent,
    InBillComponent,
    OutBillComponent,
    RefundBillComponent,
    TransactionConfirmProvDialogComponent,
    AddNotesCloseBoxComponent,
    GenerateThirdComponentComponent,
    GenerateThirdComponent2Component,
    BillInventoryComponentComponent,
    CreatePriceComponent,
    ProductsOnCategoryComponent2,
    AddGeneralProduct,
    AddSpecificProductComponent,
    ThirdsComponent,
    EditarCostoComponent,
    ContabilidadComponent,
    ReordenComponent,
    PedidosComponent,
    PedidosDetailComponent,
    PedidosDetail2Component,
    StatechangeComponent,
    PedidoManualComponent,
    BillUpdateComponent,
    ProductsOncategoryUpdateComponent,
    TopProductsComponent,
    NotesModalComponent,
    ThirdselectComponent,
    NoDispCompComponent,
    NotesOnOrderComponent,
    BillOrderComponent,
    AuditoriaComponent,
    OpenBoxReportComponent,
    NotAuthorizedComponent,
    CrearProductoComponent,
    CloseBox2Component,
    UpdateNewProductComponent,
    ContingencyBillListComponent,
    ContUpdateComponent,
    DetallePlanillasComponent,
    CreatePlanillaComponent,
    BillsWithProductComponent,
    ThirdListPedidosComponent,
    SolicitarPedidoReOrdenComponent,
    ReOrdenNormalComponent,
    ReOrdenPorProviderComponent,
    DomiciliosComponent,
    DomiciliosTelefonicosComponent,
    PedidosDomiciliosRecibidosComponent,
    PedidosDomiciliosProcesadosNComponent,
    PedidosDomiciliosProcesadosSComponent,
    PedidosDomiciliosEncaminoComponent,
    PedidosDomiciliosEntregadosNComponent,
    PedidosDomiciliosEntregadosSComponent,
    PedidosDomiciliosCalificadosComponent,
    PedidosDomiciliosCanceladosComponent,
    PedidosAprobarNovedadComponent,
    PedidosVentaConfirmarComponent,
    ConfirmacionEnvioDomicilioComponent,
    PedidoConfirmacionCancelacionComponent,
    PedidosFacturadosComponent,
    PedidosDomiciliosPlanillasComponent,
    PedidosDomiciliosFinalizadosNComponent,
    PedidosDomiciliosFinalizadosSComponent,
    PedidosDomiciliosCerrarPlanillasComponent,
    CerrarPlanillasCajaComponent,
    LogPedidosComponent,
    UpdateThirdInfoComponent,
    ModalNoDomiComponent,
    KardexComponent,
    ObservationsNotesComponent,
    NotesModal2Component,
    PedidosModificarComponent,
    ReordenConsumoComponent,
    ModalCrearPedidosComponent,
    ModalCrearComoProveedorComponent,
    ModalCambiarTerceroComponent,
    ModalConfirmCreateProviderComponent,
    ModalConfirmEmptyInventoryComponent,
    AdminPedidosComponent,
    AdminRestauranteComponent,
    RegistrarPedidoRestauranteComponent,
    PedidosRestaurantesCreadosComponent,
    TableReadComponent,
    DetallesMesaComponent,
    EditarPedidoComponent,
    ModalConfirmarCancelacionPedidoComponent,
    EditarPedidoRestauranteComponent,
    EditarMeseroComponent,
    ReOrdenPerfectaComponent,
    Mesas2Component,
    SelectCancelAdminComponent,
    SelectCancelAdminDisccountComponent,
    FacturarMesas2Component,
    AddProductosMesa2Component,
    VsessionComponent,
    NotesComandaComponent,
    TransactionConfirmDialog2Component
  ],
  entryComponents: [NotesOnOrderComponent,NoDispCompComponent, ThirdselectComponent,StatechangeComponent,PedidosDetail2Component,PedidosDetailComponent,AddSpecificProductComponent, AddGeneralProduct,ProductsOnCategoryComponent2, BillInventoryComponentComponent, CreatePriceComponent, GenerateThirdComponent2Component, GenerateThirdComponentComponent, AddNotesCloseBoxComponent, TransactionConfirmProvDialogComponent, RefundBillComponent, OutBillComponent, InBillComponent, ReportesComponent, CloseBoxComponent,EmployeeDialogComponent, PersonDialogComponent ,ThirdDialogComponent ,DialogQuantityBillComponent, BillDialogQuantityComponent, BillDialogThirdComponent, BillDocumentComponent,QuantityDialogComponent,ClientDialogComponent,SearchClientDialogComponent,SearchProductDialogComponent,TransactionConfirmDialogComponent, ViewDetailsBoxComponent,CategoriesComponent, InventoryComponent, StoresComponent, UpdateLegalDataComponent, NewProductStoreComponent, ProductsOnCategoryComponent,ProductsOnStoreComponent, ProductsOnStoragesComponent, AddCategoryComponent, AddBrandComponent,AddMeasureComponent, AddProductComponent, AddCodeComponent, AddProductModalComponent,EditarCostoComponent,TopProductsComponent,NotesModalComponent],
  providers:[PageService, SortService, FilterService,{ provide: MatDialogRef, useValue: {} },
    { provide: MAT_DIALOG_DATA, useValue: [] },ContUpdateComponent,DatePipe]

})
export class BillingModule { }
