import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {LocalStorage} from '../../../../../../services/localStorage';
import {MatDialog, MatDatepicker, MatSort} from '@angular/material';
/* import components */
import {ReportesComponent} from '../../billing/bill-main/reportes/reportes.component';
import {QuantityDialogComponent} from '../bill-main/quantity-dialog/quantity-dialog.component';
import {ThirdDialogComponent} from '../bill-main/third-dialog/third-dialog.component';
import {CloseBoxComponent} from '../bill-main/close-box/close-box.component';
import {CategoriesComponent} from '../bill-main/categories/categories.component';
import {EmployeeDialogComponent} from '../bill-main/employee-dialog/employee-dialog.component';
import {PersonDialogComponent} from '../bill-main/person-dialog/person-dialog.component';
import {SearchClientDialogComponent} from '../bill-main/search-client-dialog/search-client-dialog.component';
import {SearchProductDialogComponent} from '../bill-main/search-product-dialog/search-product-dialog.component';
import {TransactionConfirmDialogComponent} from '../bill-main/transaction-confirm-dialog/transaction-confirm-dialog.component';
import {InventoryDetail} from '../../../store724/inventories/models/inventoryDetail';
import {InventoryQuantityDTO} from '../../../store724/inventories/models/inventoryQuantityDTO';
import {CommonStateDTO} from '../../commons/commonStateDTO';
import {DocumentDTO} from '../../commons/documentDTO';
import {DetailBillDTO} from '../models/detailBillDTO';
import {BillDTO} from '../models/billDTO';
import {BillingService} from '../../../../../../services/billing.service';
import {InventoriesService} from '../../../../../../services/inventories.service';
import {Token} from '../../../../../../shared/token';
import {Urlbase} from '../../../../../../shared/urls';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {ClientData} from '../models/clientData';
import {InventoryComponent} from '../bill-main/inventory/inventory.component';
import {StoresComponent} from '../bill-main/stores/stores.component';
import {UpdateLegalDataComponent} from '../bill-main/update-legal-data/update-legal-data.component';
import {NewProductStoreComponent} from '../bill-main/new-product-store/new-product-store.component';
import {ThirdService} from '../../../../../../services/third.service';
import {StoreSelectorService} from '../../../../../../components/store-selector.service';
import * as jQuery from 'jquery';
import 'bootstrap-notify';
import { MatTableDataSourceWithCustomSort } from '../bill-main/pedidos/pedidos.component';
import { DatePipe } from '@angular/common';


let $: any = jQuery;

@Component({
  selector: 'refund-bill-main',
  templateUrl: './refund-bill.component.html',
  styleUrls: ['./refund-bill.component.scss']
})
export class RefundBillComponent implements OnInit {
  api_uri = Urlbase.tienda;

  id_store = this.locStorage.getIdStore();
  CUSTOMER_ID;
  // venta =1
  // venta con remision 107

  //list
  itemLoadBilling: InventoryDetail;
  // inventoryList: InventoryDetail[];
  inventoryList: InventoryName[];
  codeList: any;
  categoryList = [] as any[];
  notCategoryList: any;
  productList: any;
  categoryIDboolean = false;
  categoryID: number;
  usableProducts = [] as any[];
  productsByCategoryList = [] as any [];
  codesByProductList = [] as any [];
  codesByCategoryList = [] as any [];
  tab: number = 0;
  selected = new FormControl(0);
  CategoryName: string = "";
  taxesList: any;
  state: any;
  paymentDetail: string = '[{';
  paymentDetailObservable = this.httpClient;
  tipoFactura: string = "devolucion";
  isTotalDev: boolean = false;
  idBillOriginal: String = "";
  storageList;
  priceList = [];
  pdfDatas: pdfData;


  tipoFactura2 = 1;

  storageActual: string = "1";


  FechaDevolucion: String="--/--/--";
  NotasDevolucion: String="--Sin notas--";
  TotalDevolucion: 0;
  IdBillDevolucion = 0;
  IdDocumentDevolucion: String="";
  IdBillState;
  botonDevolucionActive: Boolean = true;

  // DTO's
  inventoryQuantityDTO: InventoryQuantityDTO;
  inventoryQuantityDTOList: InventoryQuantityDTO[];
  detailBillingDTOList: any[];
  commonStateDTO: CommonStateDTO;
  documentDTO: DocumentDTO;
  detailBillDTO: DetailBillDTO;
  detailBillDTOList: DetailBillDTO[];
  billDTO: BillDTO;

  SelectedStore = "";
  SelectedBox = "";
  Boxes;
  Stores;

  storesEmpty = true;

  public productsObject = [];
  public setObject = [];
  public removalArray = new Set();


  dateF1: Date;
  dateF2: Date;

  public flagVenta = true;
  public vendedor = {};
  public animal;
  public name;
  public form;
  public token:Token;
  public clientData: ClientData;

  public searchData;
  public searchInput : string ="";
  public ObservationsInOrOut: string ="";

  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  private options;
  @ViewChild('nameit') private elementRef: ElementRef;


  constructor(private categoriesService: BillingService,private service: StoreSelectorService, public router: Router, public thirdService: ThirdService,private http2: HttpClient,private http: HttpClient, public locStorage: LocalStorage,private fb: FormBuilder, private billingService: BillingService,
    public inventoriesService: InventoriesService, public dialog: MatDialog, private httpClient: HttpClient,private datePipe: DatePipe) {

    this.clientData = new ClientData(true, 'Cliente Ocacional', '--', '000', 'N/A', '000', 'N/A', null);
    this.detailBillingDTOList = [];
    this.inventoryList = [];
    this.inventoryQuantityDTOList = [];
    this.detailBillDTOList = [];

    this.commonStateDTO = new CommonStateDTO(1, null, null);
    this.documentDTO = new DocumentDTO(null, null);
    this.inventoryQuantityDTO = new InventoryQuantityDTO(null, null, null, null,null);
    this.detailBillDTO = new DetailBillDTO(null, null, null, null, null, this.commonStateDTO, null);
    this.billDTO = new BillDTO(this.locStorage.getIdStore(),null, null, null, null, null, null, null, null, null, null, null, null, this.commonStateDTO, null, this.detailBillDTOList, this.documentDTO);
    this.createControls();
    this.logChange();
    //GENERO LAS COLUMNAS CORRESPONDIENTES PARA FACTURACIÓN
    this.ListadoColumnasParaFacturacion.push('fullname');
    this.ListadoColumnasParaFacturacion.push('purchase_DATE');
    this.ListadoColumnasParaFacturacion.push('venta');
    this.ListadoColumnasParaFacturacion.push('cajero');
    this.ListadoColumnasParaFacturacion.push('boton');
  }
  currentBox;
  idThird;
  myBox;
  consecutive;



  getStores() {
    this.categoriesService.getStoresByThird(this.locStorage.getToken().id_third).subscribe(data => {
        CPrint(data);
        this.Stores = data;
        this.SelectedStore = data[0].id_STORE;
        this.storesEmpty = false;
        this.http2.get(Urlbase.cierreCaja + "/close/openBox?id_store="+data[0].id_STORE).subscribe(boxes => {
          CPrint("THIS.", boxes);
          this.Boxes = boxes;
          this.SelectedBox = boxes[0].id_CAJA
        })
      })

  }

  ListReportBill = [];
  EstadoBusqueda_Facturacion = -1;
  DataSourceFacturacion = new MatTableDataSourceWithCustomSort();
  @ViewChild('pickerF2') SelectorFechaFinal_Facturacion: MatDatepicker<Date>;
  ListadoColumnasParaFacturacion = [];
  @ViewChild('SorterTablaFacturacion') SorterTablaFacturacion: MatSort;



  mostrandoCargando = false;
  totalDomicilios = 0;
  ventasDomicilios = 0;
  devolucionesVentas = 0;
  ventasTotales = 0;
  costosTotales = 0;
  utilidadesTotales = 0;
  margenPromedio = 0;
  margenPromedio2 = 0;

  transformDate(date){
    return this.datePipe.transform(date, 'yyyy/MM/dd');
  }

  getRepBillList(){
    this.mostrandoCargando = true;
    this.totalDomicilios = 0;
    this.ventasDomicilios = 0;
    this.devolucionesVentas  = 0;
    this.ventasTotales = 0;
    this.costosTotales = 0;
    this.utilidadesTotales = 0;
    this.margenPromedio = 0;
    this.margenPromedio2 = 0;
    this.EstadoBusqueda_Facturacion = 1;
    CPrint(Urlbase.tienda+"/resource/reportbill2?id_third="+this.locStorage.getThird().id_third+"&id_store="+this.SelectedStore+"&date1="+this.transformDate(this.dateF1)+"&date2="+this.transformDate(this.dateF2)+"&typemove="+this.tipoFactura2);
    this.http2.get(Urlbase.tienda+"/resource/reportbill2?id_third="+this.locStorage.getThird().id_third+"&id_store="+this.SelectedStore+"&date1="+this.transformDate(this.dateF1)+"&date2="+this.transformDate(this.dateF2)+"&typemove="+this.tipoFactura2).subscribe(
      data => {
        CPrint("I NEED THIS DATA DUDE: ",data);
        // @ts-ignore
        this.ListReportBill = data;
        this.EstadoBusqueda_Facturacion = 2;
        this.DataSourceFacturacion = new MatTableDataSourceWithCustomSort(this.ListReportBill);
        this.DataSourceFacturacion.sortingDataAccessor = (item, property) => {
          switch(property) {
            case 'fullname': return item['fullname']+'-'+item['num_DOCUMENTO'];
            default: return item[property];
          }
        };
        this.mostrandoCargando=false;
        this.DataSourceFacturacion.sort = this.SorterTablaFacturacion;
        this.generateMeans().then(data => {

        });
      }
    )
  }


  generatePdfRoute(elem){
    //let name = fullname.split(" ").join("_");
    this.http2.get(Urlbase.facturacion+"/billing/UniversalPDF?id_bill="+elem.id_BILL+"&pdf=-1&cash=0&size="+false,{responseType: 'text'}).subscribe(response =>{

      //return Urlbase.root+"facturas/"+name+"_"+num_DOCUMENTO+".pdf";
      window.open(Urlbase.facturas+"/"+response, "_blank");
    });
  }

  excelFacturas(){
    CPrint("THIS IS ROWS: ",this.ListReportBill);
    this.http2.post(Urlbase.tienda+"/resource/facturas/Excel?tipofactura="+this.tipoFactura2,this.ListReportBill,{ responseType: 'text'}).subscribe(response => {
      CPrint(response);
      window.open(Urlbase.root+"reportes/"+response);
    })
  }


  async generateMeans(){

    let cont = 0;

    this.ListReportBill.forEach(element => {
      if(element.domiciliario != "Sin Domicilio"){
        this.totalDomicilios++;
        this.ventasDomicilios+=element.venta;
      }
      if(element.id_BILL_STATE == 1){
        this.ventasTotales+=element.venta;
        this.costosTotales+=element.costo;
        this.utilidadesTotales+=element.utilidad;
        this.margenPromedio+=element.pct_MARGEN_VENTA;
        this.margenPromedio+=element.pct_MARGEN_COSTO;
      }else{
        if(element.id_BILL_STATE == 41){
          CPrint("WEBBB: ",this.devolucionesVentas);
          this.devolucionesVentas+=element.venta;
        }
      }

      cont++;
    });


    this.margenPromedio = this.utilidadesTotales*100/this.ventasTotales;
    this.margenPromedio2 = this.utilidadesTotales*100/this.costosTotales;

  }




  clearDataSource(){
    this.ListReportBill=[];
    this.DataSourceFacturacion = new MatTableDataSourceWithCustomSort(this.ListReportBill);
    this.DataSourceFacturacion.sortingDataAccessor = (item, property) => {
      switch(property) {
        case 'fullname': return item['fullname']+'-'+item['num_DOCUMENTO'];
        default: return item[property];
      }
    };
    this.DataSourceFacturacion.sort = this.SorterTablaFacturacion;
  }


  getBoxes(){
    this.storesEmpty = false;
    this.http2.get(Urlbase.cierreCaja + "/close/openBox?id_store="+this.SelectedStore).subscribe(boxes => {
      CPrint(boxes);
      this.Boxes = boxes;
      this.SelectedBox = boxes[0].id_CAJA;
    })
  }

  id_menu=148;

  ngOnInit() {

    //PROTECCION URL INICIA
    CPrint(JSON.stringify(this.locStorage.getMenu()));
    const elem = this.locStorage.getMenu().find(item => item.id_menu == this.id_menu);

    if(!elem){
      this.router.navigateByUrl("/dashboard/business/movement/nopermision");
    }
    //PROTECCION URL TERMINA
    this.getStores();
    setTimeout(() => {

      this.elementRef.nativeElement.focus();
    this.elementRef.nativeElement.select();

  }, 100);

  this.consecutive="";

    let idPerson = this.locStorage.getPerson().id_person;

    this.idThird = this.locStorage.getToken().id_third;
    localStorage.setItem("id_employee",String(this.locStorage.getToken().id_third));
    this.billingService.getCajaByIdStatus(String(this.locStorage.getToken().id_third)).subscribe(res=>{
      this.myBox = res;
      localStorage.setItem("myBox",res);
      this.currentBox = localStorage.getItem("currentBox");
      CPrint("this is res",res);

    })
    this.state = {
      state:1
    };
    this.loadData();
    this.token = this.locStorage.getToken();
    this.CUSTOMER_ID= this.token.id_third_father;
    this.vendedor['fullname'] = this.locStorage.getPerson().info.fullname;
    this.vendedor['cargo'] = this.locStorage.getRol().map((item) => {
      return item.rol;
    }).join(" / ");
    // this.getInventoryList(this.STATE, null, null, this.ID_INVENTORY_TEMP);
    this.getInventoryList(this.locStorage.getIdStore());
    this.getCodes();

    this.headers = new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization':  this.locStorage.getTokenValue(),
    });
    let token = localStorage.getItem('currentUser');
    this.options = { headers: this.headers };
    this.getStorages();
  }

    getPriceList(){
    this.inventoryList.forEach(item => {
      this.http2.get(Urlbase.tienda + "/store/pricelist?id_product_store="+item.id_PRODUCT_STORE).subscribe((data) => {
        this.priceList[item.id_PRODUCT_STORE] = data;
       })
    });
  }

  getStorages() {
    this.http2.get(Urlbase.tienda + "/store/s?id_store="+this.id_store).subscribe((res)=>{
      this.storageList = res;
    });

  }

  getBillData(event){
    this.httpClient.get(Urlbase.facturacion + "/billing-state/billData?consecutive="+event.target.value+"&id_store="+this.locStorage.getIdStore()).subscribe(res=>{
      var refund = res;
      try{
        CPrint("this is refund: ",refund);
        this.FechaDevolucion = refund[0].purchase_DATE;
        this.NotasDevolucion = refund[0].body;
        this.TotalDevolucion = refund[0].totalprice;
        this.IdBillDevolucion = refund[0].id_BILL;
        this.IdDocumentDevolucion = refund[0].id_DOCUMENT;
        this.IdBillState = refund[0].id_BILL_STATE;
        this.botonDevolucionActive = false;
        this.showNotification('top', 'center', 3, "<h3>LA FACTURA FUE CARGADA CORRECTAMENTE</h3> ", 'info');
      }catch(e){
        this.showNotification('top', 'center', 3, "<h3>NO SE ENCONTRO EL CONSECUTIVO DE FACTURA SOLICITADO</h3> ", 'danger');
      }
  });

  }

  anularFacturaPorDevolucion(){
    if(this.IdBillState != 41){
      var state= 41;
      var documentId = this.IdDocumentDevolucion;
      let idcaja;
      if(this.locStorage.getRol()[0].id_rol==7777 || this.locStorage.getRol()[0].id_rol==21){
        idcaja = this.SelectedBox;
      }else{
        idcaja = this.locStorage.getIdCaja();
      }
      try{
        this.http2.post(Urlbase.tienda + "/store/devolucionVenta?consecutivo="+this.consecutive+"&idcaja="+idcaja+"&idstore="+this.locStorage.getIdStore(),{}).subscribe(res=>{
          CPrint("aca vamos a la ventana de venta");
          this.router.navigateByUrl("/dashboard/business/movement/billing/main");
          this.service.onDataSendEvent.emit(new DTOData(this.IdBillDevolucion,true));
          this.locStorage.setDoIMakeRefund(true);
          this.locStorage.setIdRefund(Number(this.IdBillDevolucion));
          // this.FechaDevolucion="--/--/--";
          // this.NotasDevolucion="--Sin notas--";
          // this.TotalDevolucion="--No se Cargo el Total--";
          // this.IdBillDevolucion=0;
          // this.IdDocumentDevolucion="";
          // this.IdBillState = 0;
          // this.botonDevolucionActive = true;
          this.showNotification('top', 'center', 3, "<h3>LA FACTURA SE ANULO CON EXITO</h3> ", 'info');
          this.http2.post(Urlbase.tienda + "/resource/auditoria?nombre=Devolución: Factura numero - "+this.consecutive+" / Fecha creacion de factura - "+this.FechaDevolucion+"&id_third_employee="+this.locStorage.getToken().id_third+"&id_store="+this.locStorage.getIdStore()+"&valor_anterior="+this.TotalDevolucion+"&valor_nuevo="+this.TotalDevolucion,{}).subscribe(data => {
            CPrint(data);

          })

        });
      }catch(e){
        this.FechaDevolucion="--/--/--";
        this.NotasDevolucion="--Sin notas--";
        this.TotalDevolucion=0;
        this.IdBillDevolucion=0;
        this.IdDocumentDevolucion="";
        this.IdBillState = 0;
        this.botonDevolucionActive = true;
        this.showNotification('top', 'center', 3, "<h3>LA FACTURA NO SE PUDO ANULAR</h3> ", 'danger');
      }
    }else{
      this.showNotification('top', 'center', 3, "<h3>LA FACTURA YA SE ENCONTRABA ANULADA POR DEVOLUCION</h3> ", 'danger');
    }



  }



  stopbutton = false;

  anularFacturaPorDevolucion2(element){
    this.stopbutton = true;
    if(this.IdBillState != 41){
      var state= 41;
      var documentId = this.IdDocumentDevolucion;
      let idcaja;
      if(this.locStorage.getRol()[0].id_rol==7777 || this.locStorage.getRol()[0].id_rol==21){
        idcaja = this.SelectedBox;
      }else{
        idcaja = this.locStorage.getIdCaja();
      }
      try{
        this.http2.post(Urlbase.tienda + "/store/devolucionVenta?id_bill="+element.id_BILL+"&idcaja="+idcaja,{}).subscribe(res=>{
          this.stopbutton = false;
          if(this.tipoFactura2==1){
            CPrint("aca vamos a la ventana de venta");
            this.router.navigateByUrl("/dashboard/business/movement/billing/main");
            this.service.onDataSendEvent.emit(new DTOData(element.id_BILL,true));
            this.locStorage.setDoIMakeRefund(true);
            this.locStorage.setIdRefund(Number(element.id_BILL));

          }
          // this.FechaDevolucion="--/--/--";
          // this.NotasDevolucion="--Sin notas--";
          // this.TotalDevolucion="--No se Cargo el Total--";
          // this.IdBillDevolucion=0;
          // this.IdDocumentDevolucion="";
          // this.IdBillState = 0;
          // this.botonDevolucionActive = true;
          this.showNotification('top', 'center', 3, "<h3>LA FACTURA SE ANULO CON EXITO</h3> ", 'info');
          this.http2.post(Urlbase.tienda + "/resource/auditoria?nombre=Devolución: Factura numero - "+element.consecutive+" / Fecha creacion de factura - "+element.purchase_DATE+"&id_third_employee="+this.locStorage.getToken().id_third+"&id_store="+this.locStorage.getIdStore()+"&valor_anterior="+element.venta+"&valor_nuevo="+element.venta,{}).subscribe(data => {
            CPrint(data);
            this.getRepBillList();

          })

        });
      }catch(e){
        this.stopbutton = false;
        this.FechaDevolucion="--/--/--";
        this.NotasDevolucion="--Sin notas--";
        this.TotalDevolucion=0;
        this.IdBillDevolucion=0;
        this.IdDocumentDevolucion="";
        this.IdBillState = 0;
        this.botonDevolucionActive = true;
        this.showNotification('top', 'center', 3, "<h3>LA FACTURA NO SE PUDO ANULAR</h3> ", 'danger');
      }
    }else{
      this.stopbutton = false;
      this.showNotification('top', 'center', 3, "<h3>LA FACTURA YA SE ENCONTRABA ANULADA POR DEVOLUCION</h3> ", 'danger');
    }



  }


  resetCategoryMenu(){
    this.categoryIDboolean = false;
    this.categoryID = null;
    this.productsByCategoryList = [] as any[];
    this.codesByProductList = [] as any[];
    this.codesByCategoryList = [] as any[];
    this.CategoryName = "";
  }

  getTaxes(){
    this.httpClient.get(this.api_uri+'/tax-tariff').subscribe((res)=>{
        this.taxesList = res;
        this.getCategoryList();
    });

  }

  getCodes(){
    this.httpClient.get(this.api_uri+'/codes').subscribe((res)=>{
        this.codeList = res;
        this.getCategories();
    });
  }

    openCierreCaja(){

      var dialogRef;
              dialogRef = this.dialog.open(CloseBoxComponent, {
                width: '60vw',
                data: {}
              });

  }

  openCategories(){

    var dialogRef;
            dialogRef = this.dialog.open(CategoriesComponent, {
              width: '60vw',
              data: {}
            });

  }

  openInventories(){

    var dialogRef;
            dialogRef = this.dialog.open(InventoryComponent, {
              width: '60vw',
              data: {}
            });

  }

  openStores(){

    var dialogRef;
            dialogRef = this.dialog.open(StoresComponent, {
              width: '60vw',
              data: {}
            });

  }
  openUpdateLegalData(){
    var dialogRef;
    dialogRef = this.dialog.open(UpdateLegalDataComponent, {
      width: '60vw',
      data: {}
    });
  }

  getProducts(){
    this.httpClient.get(this.api_uri+'/products').subscribe((res)=>{
      this.productList = res;
      this.getTaxes();
    });
}

  getCategories(){
  this.httpClient.get(this.api_uri+'/categories').subscribe((res)=>{
    this.notCategoryList = res;
    this.getProducts();
  });
}

  getPercentTax(idTaxProd){

      var thisTax;
      var taxToUse;

      for (thisTax in this.taxesList){
          if(idTaxProd == this.taxesList[thisTax].id_tax_tariff){
            taxToUse = this.taxesList[thisTax].percent/100;
          }
      }

      return taxToUse;
  }


 getCodesByCategory(){
  var product: any;
  for (product in this.usableProducts){
    var compProduct = this.usableProducts[product];
      if(compProduct.id_category == this.categoryID){
        if(!this.productsByCategoryList.includes(compProduct)){
          this.productsByCategoryList.push(compProduct);
        }
      }

  }
  var code: any;

    for (code in this.codeList){
      var compCode = this.codeList[code];
      var product:any;
      for (product in this.productList){
        var compProduct = this.productList[product];
        if(compCode.id_product == compProduct.id_product){
          compCode.img_url = compProduct.img_url;
          compCode.id_category = compProduct.id_category;
          compCode.description_product = compProduct.description_product;
          compCode.name_product = compProduct.name_product;
          var elem = this.inventoryList.find(item => item.code == compCode.code);
          compCode.price = elem.standard_PRICE;
          if(!this.codesByProductList.includes(compCode)){
            this.codesByProductList.push(compCode);
          }
        }
      }
    }


     var codeKey: any;

     for (codeKey in this.codeList){
       var compCode = this.codesByProductList[codeKey];
         if(compCode.id_category == this.categoryID){
           if(!this.codesByCategoryList.includes(compCode)){
             this.codesByCategoryList.push(compCode);
           }
         }
     }
  return this.codesByCategoryList;
}


  getCategoryList(){
    this.codeList.forEach(code => {

       var aux = this.productList.filter(
        product => {
          return code.id_product == product.id_product
        }
      )[0];

      if(!this.usableProducts.includes(aux)){
        this.usableProducts.push(aux)
      }

    });


    this.usableProducts.forEach(prod => {

      var aux = this.notCategoryList.filter(
       cat => {
         return prod.id_category == cat.id_category;
       }
     )[0];

     if(!this.categoryList.includes(aux)){
       this.categoryList.push(aux)
     }

   });


    // this.codeList.forEach(code => {
    //   this.usableProducts.push( this.productList.filter(
    //     product => {
    //       return code.id_product == product.id_product
    //     }
    //   )[0]);
    // });


    // CPrint(this.usableProducts)
    // CPrint(this.categoryList)





    // for (code in this.codeList){
    //   var compCode = this.codeList[code]
    //   var product:any;
    //   for (product in this.productList){
    //     var compProduct = this.productList[product]
    //     if(compCode.id_product == compProduct.id_product){

    //       if(!this.usableProducts.includes(compProduct)){
    //         this.usableProducts.push(compProduct);
    //       }
    //     }
    //   }
    // }

    var useProduct: any;
    var category: any;


    // for(useProduct in this.usableProducts){
    //   var compUseProduct = this.usableProducts[useProduct]
    //   for (category in this.notCategoryList){
    //     var compCategory = this.notCategoryList[category];
    //     if(compUseProduct.id_category == compCategory.id_category){
    //       if(!this.categoryList.includes(compCategory)){
    //         this.categoryList.push(compCategory);
    //       }
    //     }
    //   }
    // }



  }


  setCategoryID(id,name){
    this.categoryID = id;
    this.categoryIDboolean = true;
    this.CategoryName = name;
  }

  addDetail(event) {
    var code = String(event.target.value);
    // CPrint(code,"da code :3")

    // var codeFilter = this.productsObject.filter(item => (String(item.code) === code || String(item.ownbarcode) === code || String(item.product_store_code) === code ));

    // CPrint(codeFilter);
    var key: any = null;
    this.productsObject.forEach(item => {
      // CPrint("//-----------------------------------");
      // CPrint(item.code);
      // CPrint("//-----------------------------------");
      // CPrint(item.ownbarcode);
      // CPrint("//-----------------------------------");
      // CPrint(item.product_store_code);
      // CPrint("//-----------------------------------");
      if(item.code == code || item.ownbarcode == code || String(item.product_store_code) == code ){
        key = item;
      }
      // else{
      // }
    });
      // CPrint("this is array papu: ",this.productsObject)
      // CPrint("this is key", key)
    if (key != null) {
      // CPrint("entro")
      this.productsObject[this.productsObject.indexOf(key)].quantity += 1;
      event.target.value = '';
    } else {
      var product = this.inventoryList.find(item => (item.code == code || item.ownbarcode == code || String(item.product_STORE_CODE) == code));
      CPrint("this is price product: ", this.priceList);
      if (product) {
          let new_product = {
            quantity: 1,
            id_storage: this.storageList[0].id_storage,
            price: this.priceList[product.id_PRODUCT_STORE][0].price,
            tax: this.getPercentTax(product.id_TAX),
            id_product_third: product.id_PRODUCT_STORE,
            tax_product: product.id_TAX,
            state: this.commonStateDTO,
            description: product.product_STORE_NAME,
            code: product.code,
            id_inventory_detail: product.id_INVENTORY_DETAIL,
            ownbarcode: product.ownbarcode,
            product_store_code: String(product.product_STORE_CODE),
            pricelist: this.priceList[product.id_PRODUCT_STORE]
          };
          new_product.price = this.priceList[product.id_PRODUCT_STORE][0].price;
          //this.detailBillDTOList.push(new_product);
          this.productsObject.push(new_product);
          this.setObject = Object.keys(this.productsObject);

          event.target.blur();
          event.target.value = '';
          setTimeout(() => {
            document.getElementById('lastDetailQuantity');
          });
        } else {
          var codeList;
          this.http2.get(Urlbase.tienda + "/products2/code/general?code="+String(code)).subscribe(data => {
            codeList = data;
            CPrint("this is codeList: ", codeList);
          //@ts-ignore
          if( data.length == 0 ){
            if(localStorage.getItem("SesionExpirada") != "true"){ alert('Product not exist');}
          }else{
            var dialogRef;
            dialogRef = this.dialog.open(NewProductStoreComponent, {
              width: '30vw',
              data: {codeList: codeList[0]}
            });
            dialogRef.afterClosed().subscribe(res=>{
              this.ngOnInit()
            })
          // let body = {
          //   id_store: this.locStorage.getIdStore(),
          //   id_code: codeList[0],
          //   product_store_name: "new",
          //   product_store_code: 123456,
          //   ownbarcode: "av12312312"
          // }
          // CPrint(JSON.stringify(body));
          // this.http.post(Urlbase.tienda + "/store/ps",body,this.options).subscribe(data=>
          // {
          //   CPrint("Post hecho");});
          }
          });

        }
    }
  }
  addDetailFromCat(code) {
    if (this.productsObject.hasOwnProperty(code)) {
      this.productsObject[code]['quantity'] += 1;
      this.setObject = Object.keys(this.productsObject);
      this.resetCategoryMenu();
      this.tab = 0;
    } else {
      var product = this.inventoryList.find(item => item['code'] == code);
      if (product) {
        let new_product = {
          quantity: 1,
          id_storage: this.storageList[0].id_storage,
          price: product.standard_PRICE,
          tax: this.getPercentTax(product.id_TAX),
          id_product_third: product.id_PRODUCT_STORE,
          tax_product: product.id_TAX,
          state: this.commonStateDTO,
          description: product.product_STORE_NAME,
          code: product.code,
          id_inventory_detail: product.id_INVENTORY_DETAIL
        };
        //this.detailBillDTOList.push(new_product);
        this.productsObject[code] = new_product;
        this.setObject = Object.keys(this.productsObject);

        setTimeout(() => {
          document.getElementById('lastDetailQuantity');
        });
        this.resetCategoryMenu();
        this.tab = 0;
      } else {
        this.resetCategoryMenu();
        this.showNotification('top','center',3,"<h3 class = 'text-center'>El producto solicitado no existe<h3>",'warning');
        this.tab = 0;
      }
    }
  }

  calculateSubtotal() {
    var subtotal = 0;
    var attr= this.flagVenta?'price':'purchaseValue';
    for (let code in this.productsObject) {
      subtotal += this.productsObject[code][attr] * this.productsObject[code]['quantity'];
    }
    return subtotal;
  }

  calculateTax() {
    var tax = 0;
    // if (!this.form.value['isRemission']) {
      for (let code in this.productsObject) {
        if(this.flagVenta){
          tax += this.productsObject[code]['price'] * this.productsObject[code]['quantity'] * this.productsObject[code]['tax'];
        }else{
          tax += this.productsObject[code]['purchaseValue'] * this.productsObject[code]['quantity'] * this.productsObject[code]['tax'];
        }
      }
    // }
    return tax;
  }

  calculateTotal() {
    return this.calculateSubtotal() + this.calculateTax();
  }

  checkItem(event, code) {
    if (event.target.checked) {
      this.removalArray.add(code);
    } else {
      this.removalArray.delete(code);
    }
  }

  checkAllItems(event) {
    if (event.target.checked) {
      this.removalArray = new Set(this.setObject);
    } else {
      this.removalArray = new Set();
    }
  }

  removeItems() {
    this.removalArray.forEach((item:string) => {
      if (this.productsObject.hasOwnProperty(item)) {
        delete this.productsObject[item];
      }
    });
    this.removalArray = new Set();
    this.setObject = Object.keys(this.productsObject);
  }

  editPurchaseValue(event: any) {
    event.target.blur();
    setTimeout(() => {
      document.getElementById('lastDetailSaleValue').focus();
    });
  }

  readNew(event: any) {
    event.target.blur();
    setTimeout(() => {
      document.getElementById('reader').focus();
    });
  }

  cancel() {
    this.form.reset();
    this.clientData = new ClientData(true, 'Cliente Ocacional', '--', '000', 'N/A', '000', 'N/A',null);
    this.productsObject = [];
    this.setObject = [];
    this.removalArray = new Set();
    this.CUSTOMER_ID= this.token.id_third_father;
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(QuantityDialogComponent, {
      width: '40vw',
      data: { name: this.name, animal: this.animal }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
    });
  }

  openDialogClient(tipo): void {
    var dialogRef;
    if(tipo == 0){
    dialogRef = this.dialog.open(ThirdDialogComponent, {
      width: '60vw',
      data: {}
    });
    }

    if(tipo == 1){
      dialogRef = this.dialog.open(PersonDialogComponent, {
        width: '60vw',
        data: {}
      });
      }

    if(tipo == 2){
      dialogRef = this.dialog.open(EmployeeDialogComponent, {
        width: '60vw',
        data: {}
      });
      }

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.CUSTOMER_ID= result.id;
        // CPrint('CREATE CLIENT SUCCESS');
        // CPrint(result);
        let isNaturalPerson= result.data.hasOwnProperty('profile')?true:false;
        let dataPerson= isNaturalPerson?result.data.profile:result.data;
        this.clientData.is_natural_person = isNaturalPerson;
        this.clientData.fullname= dataPerson.info.fullname;
        this.clientData.document_type = dataPerson.info.id_document_type;
        this.clientData.document_number = dataPerson.info.document_number;
        this.clientData.address = dataPerson.directory.address;
        this.clientData.phone = dataPerson.directory.phones[0].phone;
        this.clientData.email = dataPerson.directory.hasOwnProperty('mails')?dataPerson.directory.mails[0].mail:'N/A';
      }
    });
  }

  openDialogSearchClient(): void {
    const dialogRef = this.dialog.open(SearchClientDialogComponent, {
      width: '40vw',
      data: { name: this.name, animal: this.animal }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
    });
  }

  openDialogSearchProduct(): void {
    const dialogRef = this.dialog.open(SearchProductDialogComponent, {
      width: '40vw',
      data: { name: this.name, animal: this.animal }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
    });
  }

  openDialogTransactionConfirm(disc,isCompra): void {
    if( disc==1 || disc==2 ){
      const dialogRef = this.dialog.open(TransactionConfirmDialogComponent, {
        width: '60vw',
        height: '80vh',
        data: { total: this.calculateTotal(), productsQuantity: Object.keys(this.productsObject).length }
      });

      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.clientData = result.clientData;
          CPrint(result);
          this.save(result,disc,isCompra);
        }
      });
    }else{
      var result = 0;
      this.save(result,disc,isCompra);
    }

  }





  // start controls
  createControls() {
    this.form = this.fb.group({

      isRemission: [true, Validators.compose([
        Validators.required,
        Validators.pattern("^[a-z0-9_-]{8,15}$")
      ])],

      number_order: ['', Validators.compose([
        Validators.required
      ])],

      date: [{ value: '', disabled: true }, Validators.compose([
        Validators.required
      ])],

    });
  }

  loadData() {
    this.form.patchValue({
      isRemission: true,
      number_order: '',
      date: new Date()
    });
  }

  logChange() {
    const isRemission = this.form.get('isRemission');
    isRemission.valueChanges.forEach((value: boolean) => {
    });

    const listenerNumberOrder = this.form.get('number_order');
    listenerNumberOrder.valueChanges.forEach((value: string) => {
    });
  }// end controls


  // services

  async getInventoryList(store){
    this.inventoriesService.getInventory(store).subscribe((data: InventoryName[]) => {
                 this.inventoryList = data;
               },
               (error) =>{
                 CPrint(error);
               },
               () => {
                 if (this.inventoryList.length > 0) {

                 }
               });

       }





  // getInventoryList(state_inv_detail?: number, state_product?: number, id_inventory_detail?: number,
  //   id_inventory?: number, id_product_third?: number, location?: number,
  //   id_third?: number, id_category_third?: number, quantity?: number, id_state_inv_detail?: number,
  //   id_product?: number, id_category?: number, stock?: number,
  //   stock_min?: number, img_url?: string, id_tax?: number,
  //   id_common_product?: number, name_product?: string,
  //   description_product?: string, id_state_product?: number,


  //   id_state_prod_third?: number, state_prod_third?: number,
  //   id_measure_unit?: number, id_measure_unit_father?: number,
  //   id_common_measure_unit?: number, name_measure_unit?: string,
  //   description_measure_unit?: string, id_state_measure_unit?: number,
  //   state_measure_unit?: number, id_code?: number,
  //   code?: number, img?: string,
  //   id_attribute_list?: number,
  //   id_state_cod?: number, state_cod?: number,
  //   attribute?: number,
  //   attribute_value?: number) {
  //   return new Promise((resolve,reject)=>{

  //     this.inventoriesService.getInventoriesDetailList(state_inv_detail, state_product, id_inventory_detail,

  //       id_inventory, quantity, id_state_inv_detail,
  //       id_product, id_category, stock,
  //       stock_min, img_url, id_tax,
  //       id_common_product, name_product,
  //       description_product, id_state_product,
  //       id_product_third, location,
  //       id_third, id_category_third,

  //       id_state_prod_third, state_prod_third,
  //       id_measure_unit, id_measure_unit_father,
  //       id_common_measure_unit, name_measure_unit,
  //       description_measure_unit, id_state_measure_unit,
  //       state_measure_unit, id_code,
  //       code, img,
  //       id_state_cod, state_cod)


  //       .subscribe((data: InventoryDetail[]) => {
  //           this.inventoryList = data;
  //           resolve();
  //         },
  //         (error) =>{
  //           CPrint(error);
  //           reject();
  //         },
  //         () => {
  //           if (this.inventoryList.length > 0) {

  //           }
  //         });
  //   });
  // }
  // end process

  // cashback(disc): void {
  //   CPrint("put para actualizar el state del bill original", this.idBillOriginal)
  //   for (let code in this.productsObject) {
  //     let element = this.productsObject[code];

  //     this.inventoryQuantityDTO = new InventoryQuantityDTO(null, null, null, null);

  //     // Inv Quantity
  //     this.inventoryQuantityDTO.id_inventory_detail = element.id_inventory_detail;
  //     this.inventoryQuantityDTO.id_product_third = element.id_product_third;
  //     this.inventoryQuantityDTO.code = element.code;

  //     // Inv Quantity for discount tienda
  //     this.inventoryQuantityDTO.quantity = element.quantity;

  //     this.inventoryQuantityDTOList.push(
  //       this.inventoryQuantityDTO
  //     );
  //   }

  //   this.beginPlusOrDiscount(this.ID_INVENTORY_TEMP, this.inventoryQuantityDTOList,disc);

  //   CPrint("se crea un nuevo Detalle de caja");

  //   if(this.isTotalDev==true){
  //     CPrint("es devolucion total")
  //   }else{
  //     CPrint("no es devolucion total")
  //   }


  // }

  save(data,disc,isCompra) {
    if(data.id_person){
      this.billDTO.id_third_destiny = data.id_person;
    }
    this.detailBillDTOList = [];
    this.commonStateDTO.state = 1;
    this.inventoryQuantityDTOList = [];
    let titleString= this.form.value['isRemission']?' Por Remision':'';

    if(disc==1){
      this.documentDTO.title = 'Movimiento De Venta';
    }
    if(disc==2){
      this.documentDTO.title = 'Movimiento De Compra';
    }
    if(disc==3){
      this.documentDTO.title = 'Movimiento De Entrada';
    }
    if(disc==4){
      this.documentDTO.title = 'Movimiento De Salida';
    }
    if(disc==5){
      this.documentDTO.title = 'Movimiento De Devolucion';
    }

    if(disc==1 || disc==2){
      this.documentDTO.body = data.observations||'';
    }

    if(disc==4 || disc==3){
      this.documentDTO.body = this.ObservationsInOrOut;
    }

    /**
     * building detailBill and Quantity
     */
    for (let code in this.productsObject) {
      let element = this.productsObject[code];

      this.inventoryQuantityDTO = new InventoryQuantityDTO(null, null, null, null,null);
      this.detailBillDTO = new DetailBillDTO(null, null, null, null, null, this.commonStateDTO,null);

      //building detailBill
      this.detailBillDTO.id_storage = element.id_storage;
      this.detailBillDTO.price = (+element.price);
      this.detailBillDTO.tax = this.getPercentTax(element.tax_product)*100;
      this.detailBillDTO.id_product_third = element.id_product_third;
      this.detailBillDTO.tax_product = element.tax_product;
      this.detailBillDTO.state = this.commonStateDTO;
      this.detailBillDTO.quantity = element.quantity;

      this.detailBillDTOList.push(this.detailBillDTO);

      // Inv Quantity
      this.inventoryQuantityDTO.id_inventory_detail = element.id_inventory_detail;
      this.inventoryQuantityDTO.id_product_third = element.id_product_third;
      this.inventoryQuantityDTO.code = element.code;
      this.inventoryQuantityDTO.id_storage = element.id_storage;

      // Inv Quantity for discount tienda
      this.inventoryQuantityDTO.quantity = element.quantity;

      this.inventoryQuantityDTOList.push(
        this.inventoryQuantityDTO
      );
    }

    if (this.detailBillDTOList.length > 0) {
      let ID_BILL_TYPE= this.form.value['isRemission']?107:1;
      this.billDTO.id_third_employee = this.token.id_third_father;
      this.billDTO.id_third = this.token.id_third;
      this.billDTO.id_bill_type = 1;
      if(disc==2){
        this.billDTO.id_bill_type = 2;
      }
      if(disc==3){
        this.billDTO.id_bill_type = 3;
      }
      if(disc==4){
        this.billDTO.id_bill_type = 4;
      }
      //instanciar de acuerdo a por remision
      this.billDTO.id_bill_state = 1;
      this.billDTO.purchase_date = new Date();
      this.billDTO.subtotal = this.calculateSubtotal();
      this.billDTO.tax = this.calculateTax();
      this.billDTO.totalprice = this.calculateTotal();
      if(disc==3 || disc==4){
        this.billDTO.subtotal = 0;
        this.billDTO.tax = 0;
        this.billDTO.totalprice = 0;
      }
      this.billDTO.discount = 0;
      this.billDTO.documentDTO = this.documentDTO;
      this.billDTO.state = null;

      this.billDTO.details = this.detailBillDTOList;

      if(disc==1 || disc==2){

      if(data.paymentMethod == "efectivo"){
        this.paymentDetail+='"id_payment_method": 1, ';
        this.paymentDetail+='"aprobation_code": "", ';
      }
      if(data.paymentMethod == "debito"){
        this.paymentDetail+='"id_payment_method": 2, ';
        this.paymentDetail+='"aprobation_code": "'+data.transactionCode+'", ';
        this.paymentDetail+='"id_bank_entity": '+Number(data.creditBank)+', ';
      }
      if(data.paymentMethod == "credito"){
        this.paymentDetail+='"id_payment_method": 3, ';
        this.paymentDetail+='"aprobation_code": "'+data.transactionCode+'", ';
        this.paymentDetail+='"id_bank_entity": '+Number(data.creditBank)+', ';
      }


      if(data.wayToPay == "contado"){
        this.paymentDetail+='"id_way_to_pay": 1, ';
      }

      if(data.wayToPay == "credito"){
        this.paymentDetail+='"id_way_to_pay": 2, ';
      }



      this.paymentDetail+='"payment_value": '+this.calculateTotal()+', ';
      this.paymentDetail+='"state": {"state": 1}}]';

    }
      CPrint(JSON.stringify(this.billDTO),"This is Bill DTO");
      this.billingService.postBillResource(this.billDTO, disc)
        .subscribe(
          result => {

            this.http2.get(Urlbase.facturacion + "/billing/master?id_bill="+result+"&id_store="+this.locStorage.getIdStore()).subscribe(
              dataresult => {
                this.http2.get(Urlbase.facturacion + "/billing/detail?id_bill="+result).subscribe(dataset => {
                  //@ts-ignore
                  this.pdfDatas =  new pdfData (dataresult.fullname,dataresult.store_NAME,dataresult.purchase_DATE,this.locStorage.getIdCaja(),dataresult.prefix_BILL + " - " + dataresult.consecutive,dataset,dataresult.subtotal,dataresult.tax,dataresult.totalprice);
                  CPrint("this is pdfData1: ", JSON.stringify(this.pdfDatas));
                  this.http2.post(Urlbase.facturacion + "/billing/pdf",this.pdfDatas,{responseType: 'text'}).subscribe( response => {
                    window.open(Urlbase.facturas + "/"+response, "_blank");
                  }
                  );
                });
              });
            if (result) {
              CPrint("this is bull DTO",JSON.stringify(this.billDTO));
              this.beginPlusOrDiscount(this.inventoryQuantityDTOList,disc);

              if(disc==1 || disc==2){

                this.billingService.postPaymentDetail(JSON.parse(this.paymentDetail),Number(result)).subscribe(answer =>{
                  this.paymentDetail = '[{';
                  var currentSells = localStorage.getItem("sells");
                     var mySells = '';
                     var total = this.calculateTotal();
                     if(currentSells !== 'null'){
                       mySells = currentSells + ',' + String(total)
                     }else{
                       mySells = String(total)
                     }
                     localStorage.setItem("sells",mySells);
                     CPrint(localStorage.getItem("sells"))
                  });
              }
              this.paymentDetail = '[{';

            }
          });


    }
  }

  beginPlusOrDiscount(inventoryQuantityDTOList,isDisc) {
    if(isDisc == 1 || isDisc == 4){



      // this.inventoriesService.putQuantity(id_Store,quantity,code,inventoryQuantityDTOList);


      try{
      inventoryQuantityDTOList.forEach(element =>{
        this.inventoriesService.putQuantity(this.locStorage.getIdStore(),element.quantity,element.code,inventoryQuantityDTOList,isDisc,element.id_storage).subscribe(result =>{
        });
      });
      this.showNotification('top', 'center', 3, "<h3>Se ha realizado el movimento <b>CORRECTAMENTE</b></h3> ", 'info');
      this.cancel();
      }catch{
      this.showNotification('top', 'center', 3, "<h3>El movimento presento <b>PROBLEMAS</b></h3> ", 'info')
      }



      // this.inventoriesService.putDiscountInventory(id_inventory, this.inventoryQuantityDTOList)
      // .subscribe(result => {
      //   if (result) {
      //     this.itemLoadBilling = null;
      //     this.detailBillingDTOList = [];
      //     this.form.reset();
      //     this.getInventoryList(this.STATE, null, null, this.ID_INVENTORY_TEMP)

      //     this.showNotification('top', 'center', 3, "<h3>Se ha realizado el movimento <b>CORRECTAMENTE</b></h3> ", 'info');
      //     this.cancel();

      //   } else {
      //     this.showNotification('top', 'center', 3, "<h3>El movimento presento <b>PROBLEMAS</b></h3> ", 'info')

      //   }
      // })
    }
      if(isDisc == 2 || isDisc == 3){


        try{
          inventoryQuantityDTOList.forEach(element =>{
            CPrint(element);
            this.inventoriesService.putQuantity(this.locStorage.getIdStore(),((-1)*element.quantity),element.code,inventoryQuantityDTOList,isDisc,element.id_storage).subscribe(result =>{
            });
          });
          this.showNotification('top', 'center', 3, "<h3>Se ha realizado el movimento <b>CORRECTAMENTE</b></h3> ", 'info');
          this.cancel();
          }catch{
          this.showNotification('top', 'center', 3, "<h3>El movimento presento <b>PROBLEMAS</b></h3> ", 'info')
          }

      //   this.inventoriesService.putPlusInventory(id_inventory, this.inventoryQuantityDTOList)
      // .subscribe(result => {
      //   if (result) {
      //     this.itemLoadBilling = null;
      //     this.detailBillingDTOList = [];
      //     this.form.reset();
      //     this.getInventoryList(this.STATE, null, null, this.ID_INVENTORY_TEMP)

      //     this.showNotification('top', 'center', 3, "<h3>Se ha realizado el movimento <b>CORRECTAMENTE</b></h3> ", 'info')
      //     this.cancel();

      //   } else {
      //     this.showNotification('top', 'center', 3, "<h3>El movimento presento <b>PROBLEMAS</b></h3> ", 'info')

      //   }
      // })

    }

  }

  showNotification(from, align, id_type?, msn?, typeStr?) {
    const type = ['', 'info', 'success', 'warning', 'danger'];

    const color = Math.floor((Math.random() * 4) + 1);

    $.notify({
      icon: "notifications",
      message: msn ? msn : "<b>Noficación automatica </b>"

    }, {
        type: typeStr ? typeStr : type[id_type ? id_type : 2],
        timer: 200,
        placement: {
          from: from,
          align: align
        }
      });
  }

  individualDelete(code){

    this.removalArray.add(code);
    this.removeItems()

  }

  openReportes(): void {
    const dialogRef = this.dialog.open(ReportesComponent, {
      width: '40vw',
      height: '60vh',
      data: { name: this.name, animal: this.animal }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
    });
  }
  upQuantity(code){
    this.productsObject[code].quantity+=1;
  }

  downQuantity(code){
    if(1<this.productsObject[code].quantity){
      this.productsObject[code].quantity-=1;
    }
  }


}


export class pdfData{
  empresa: String;
  tienda: String;
  fecha: String;
  caja: String;
  consecutivo: String;
  detalles: [String[]];
  subtotal: number;
  tax: number;
  total: number;
  constructor(empresa: String,
    tienda: String,
    fecha: String,
    caja: String,
    consecutivo: String,
    detalles: [String[]],
    subtotal: number,
    tax: number,
    total: number){
      this.empresa = empresa;
      this.tienda = tienda;
      this.fecha = fecha;
      this.caja = caja;
      this.consecutivo = consecutivo;
      this.detalles = detalles;
      this.subtotal = subtotal;
      this.tax = tax;
      this.total = total;
    }
}




export class InventoryName{
  id_TAX: number;
  standard_PRICE: number;
  id_PRODUCT_STORE: number;
  product_STORE_NAME: string;
  code: string;
  id_INVENTORY_DETAIL: number;
  ownbarcode: string;
  product_STORE_CODE: number;
  constructor(ID_TAX: number,
    STANDARD_PRICE: number,
    ID_PRODUCT_STORE: number,
    PRODUCT_STORE_NAME: string,
    CODE: string,
    ID_INVENTORY_DETAIL: number,
    OWNBARCODE: string,
    PRODUCT_STORE_CODE: number){
      this.id_TAX = ID_TAX;
      this.standard_PRICE = STANDARD_PRICE;
      this.id_PRODUCT_STORE = ID_PRODUCT_STORE;
      this.product_STORE_NAME = PRODUCT_STORE_NAME;
      this.code = CODE;
      this.id_INVENTORY_DETAIL = ID_INVENTORY_DETAIL;
      this.ownbarcode = OWNBARCODE;
      this.product_STORE_CODE = PRODUCT_STORE_CODE;
    }
}

export class DTOData{
  id_bill: Number;
  is_it: Boolean;
  constructor(
    id_bill: Number,
    is_it: Boolean){
      this.id_bill = id_bill;
      this.is_it = is_it;
    }
}
