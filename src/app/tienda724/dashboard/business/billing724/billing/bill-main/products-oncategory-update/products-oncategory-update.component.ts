import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {LocalStorage} from '../../../../../../../services/localStorage';
import {DatePipe} from '@angular/common';

import {MatDialog} from '@angular/material';
/* import components */
import {ReportesComponent} from '../../../billing/bill-main/reportes/reportes.component';
import {QuantityDialogComponent} from '../../bill-main/quantity-dialog/quantity-dialog.component';
import {ThirdDialogComponent} from '../../bill-main/third-dialog/third-dialog.component';
import {CloseBoxComponent} from '../../bill-main/close-box/close-box.component';
import {CategoriesComponent} from '../../bill-main/categories/categories.component';
import {EmployeeDialogComponent} from '../../bill-main/employee-dialog/employee-dialog.component';
import {PersonDialogComponent} from '../../bill-main/person-dialog/person-dialog.component';
import {SearchClientDialogComponent} from '../../bill-main/search-client-dialog/search-client-dialog.component';
import {SearchProductDialogComponent} from '../../bill-main/search-product-dialog/search-product-dialog.component';
import {InventoryDetail} from '../../../../store724/inventories/models/inventoryDetail';
import {InventoryQuantityDTO} from '../../../../store724/inventories/models/inventoryQuantityDTO';
import {CommonStateDTO} from '../../../commons/commonStateDTO';
import {DocumentDTO} from '../../../commons/documentDTO';
import {DetailBillDTO} from '../../models/detailBillDTO';
import {BillDTO} from '../../models/billDTO';
import {BillingService} from '../../../../../../../services/billing.service';
import {InventoriesService} from '../../../../../../../services/inventories.service';
import {Token} from '../../../../../../../shared/token';
import {Urlbase} from '../../../../../../../shared/urls';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ClientData} from '../../models/clientData';
import {InventoryComponent} from '../../bill-main/inventory/inventory.component';
import {StoresComponent} from '../../bill-main/stores/stores.component';
import {UpdateLegalDataComponent} from '../../bill-main/update-legal-data/update-legal-data.component';
import {NewProductStoreComponent} from '../../bill-main/new-product-store/new-product-store.component';
import {ThirdService} from '../../../../../../../services/third.service';
import {BillInventoryComponentComponent} from '../../bill-main/bill-inventory-component/bill-inventory-component.component';
import * as jQuery from 'jquery';
import 'bootstrap-notify';
import { ModalConfirmEmptyInventoryComponent } from '../modal-confirm-empty-inventory/modal-confirm-empty-inventory.component';

let $: any = jQuery;

@Component({
  selector: 'app-products-oncategory-update',
  templateUrl: './products-oncategory-update.component.html',
  styleUrls: ['./products-oncategory-update.component.scss']
})
export class ProductsOncategoryUpdateComponent implements OnInit {
  api_uri = Urlbase.tienda;
  IVA = "0";
  CUSTOMER_ID;
  // venta =1
  // venta con remision 107
  date3="";
  datos="";
  costo=0;
  precio=0;
  cantidad=0;
  precioanterior=0;
  costoanterior = 0;
  cantidadanterior=0;
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
  tipoFactura: string = "compra";
  isTotalDev: boolean = false;
  idBillOriginal: String = "";
  storageList;
  priceList = [];
  pdfDatas: pdfData;
  SelectedStore = this.locStorage.getIdStore();
  Stores;
  nombreProducto: any = '';
  nombreProductoAnterior: any = '';
  ownnbarcode: any = '';
  quickCode: any = '';
  quickCodeAnterior: any = '';
  storeIva=""

  getIva(){
    this.http.get(Urlbase.tienda+"/resource/ivatienda?idstore="+this.SelectedStore,{responseType: 'text'}).subscribe(response => {
      //@ts-ignore
      this.storeIva = response;
      console.log("IVAS",response)
    })
  }

  getStores() {
    this.billingService.getStoresByThird(this.locStorage.getToken().id_third).subscribe(data => {
        CPrint(data);this.Stores = data;
        this.SelectedStore = this.locStorage.getIdStore()})
}


  storageActual: string = "1";


  FechaDevolucion: String="--/--/--";
  NotasDevolucion: String="--Sin notas--";
  TotalDevolucion: String="--No se Cargo el Total--";
  IdBillDevolucion: String="";
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

  public productsObject = [];
  public setObject = [];
  public removalArray = new Set();

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
  private headers2 = new HttpHeaders({ 'Content-Type': 'undefined' });
  private options;
  @ViewChild('nameit') private elementRef: ElementRef;
  @ViewChild('myInput') myInputVariable: ElementRef;


  constructor(private datePipe: DatePipe, public thirdService: ThirdService,private http2: HttpClient,private http: HttpClient, public locStorage: LocalStorage,private fb: FormBuilder, private billingService: BillingService,
    public inventoriesService: InventoriesService, public dialog: MatDialog, private httpClient: HttpClient) {

      this.headers = new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization':  this.locStorage.getTokenValue(),
    });

    this.headers2 = new HttpHeaders({
      'Content-Type':  'undefined'
    });

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
    setTimeout(() => {
      this.elementRef.nativeElement.focus();
      this.elementRef.nativeElement.select();
    }, 100);
    this.createControls();
    this.logChange();
  }
  currentBox;
  idThird;
  myBox;
  imgurl = "https://tienda724.com/";

  copiar(){
    let params = new HttpParams();
    this.http.post(Urlbase.tienda + "/store/copyNew/",null,{params: params}).subscribe((res)=>{
      console.log(res);
    })
  }

  ngOnInit() {
    this.getIva()
    this.getStores();

    setTimeout(() => {

      this.elementRef.nativeElement.focus();
      this.elementRef.nativeElement.select();

    }, 500);

    let idPerson = this.locStorage.getPerson().id_person;
    CPrint("ID CAJA: ", this.locStorage.getIdCaja());
    CPrint("ID STORE: ", this.locStorage.getIdStore());

    this.idThird = this.locStorage.getToken().id_third;
    localStorage.setItem("id_employee",String(this.idThird));
    this.billingService.getCajaByIdStatus(String(this.idThird)).subscribe(res=>{
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
    this.getInventoryList(this.SelectedStore);
    this.getCodes();

    this.headers = new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization':  this.locStorage.getTokenValue(),
    });
    this.headers2 = new HttpHeaders({
      'Content-Type':  'undefined',
    });
    let token = localStorage.getItem('currentUser');
    this.options = { headers: this.headers };
    this.getStorages();
  }


  applyFilter(filterValue: string){
    let filteredList = this.inventoryList;
    let listWord = filterValue.split(" ");
    let listSize = listWord.length;
    let filterSize = filterValue.length;

    //if(filterValue !== "" && filterValue !== null && filterValue.length>2){
    if(filterValue !== "" && filterValue !== null){
      filteredList = this.inventoryList.filter( element => element.ownbarcode.toLowerCase().includes(listWord[0].toLowerCase()) || String(element.product_STORE_CODE).toLowerCase().includes(listWord[0].toLowerCase()) || element.product_STORE_NAME.toLowerCase().normalize('NFD')
      .replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,"$1")
      .normalize().includes(listWord[0].toLowerCase().normalize('NFD')
      .replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,"$1")
      .normalize()))

      if(listSize>1){
        for(let i = 1;i<listSize;i++){
          filteredList = filteredList.filter( element => element.ownbarcode.toLowerCase().includes(listWord[i].toLowerCase()) || String(element.product_STORE_CODE).toLowerCase().includes(listWord[i].toLowerCase()) || element.product_STORE_NAME.toLowerCase().normalize('NFD')
          .replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,"$1")
          .normalize().includes(listWord[i].toLowerCase().normalize('NFD')
          .replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,"$1")
          .normalize()) )
        }
      }

      let filteredListSize = filteredList.length;
      if(filteredListSize>100){
        this.listaElem = filteredList.slice(0,100);
      }else{
        this.listaElem = filteredList;
      }

      return;
    }
    else{
      this.listaElem = [];
    }

  }


  addDetail2(item) {
    let code = item.ownbarcode;
    this.disableDoubleClickSearch = true;
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
      this.disableDoubleClickSearch = false;
      CPrint("MOSTRAR ITEMS")
      //this.productsObject[this.productsObject.indexOf(key)].quantity += 1;
    } else {

      var product = this.inventoryList.find(item => (item.code == code || item.ownbarcode == code || String(item.product_STORE_CODE) == code));
          //@ts-ignore
          if(product){
            if(this.setObject.length<1){
              this.getPriceList(product,code,product.id_PRODUCT_STORE);
              this.disableDoubleClickSearch = false;
            }else{
              if(localStorage.getItem("SesionExpirada") != "true"){ alert('Ya hay un producto actualmente.');}
              this.disableDoubleClickSearch = false;
            }

          }else{
            if(localStorage.getItem("SesionExpirada") != "true"){ alert('Ese codigo no esta asociado a un producto.');}
            this.disableDoubleClickSearch = false;
          }
    }
  }


  openCategories2(){
    CPrint("THIS IS ROLES: ", this.locStorage.getTipo());

    var modal;
    modal = this.dialog.open(BillInventoryComponentComponent, {
      width: '675px',
      height: '450px',
      data: {}
    });

    modal.afterClosed().subscribe(response => {
      CPrint("ESTE ES EL CODIGO DE BARRAS QUE QUIERO EJECUTAR: ",this.locStorage.getCodigoBarras());
      if(this.locStorage.getCodigoBarras() != "-1"){
        this.addDetail2(this.locStorage.getCodigoBarras());
        this.locStorage.setCodigoBarras("-1");
      }
    });
  }






  getStorages() {
    this.http2.get(Urlbase.tienda + "/store/s?id_store="+this.SelectedStore).subscribe((res)=>{
      this.storageList = res;
    });

  }

  getStorages2() {
    this.http2.get(Urlbase.tienda + "/store/s?id_store="+this.SelectedStore).subscribe((res)=>{
      this.storageList = res;
    });

  }

  getBillData(event){
    this.httpClient.get(Urlbase.facturacion + "/billing-state/billData?consecutive="+event.target.value).subscribe((res)=>{
      var refund = res;
      try{
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
      let params = new HttpParams();
      params = params.append('state',  state+"");
      this.http.put(Urlbase.facturacion + "/billing-state/billState/"+this.IdBillDevolucion,null,{params: params}).subscribe((res)=>{
        var notas = this.NotasDevolucion + " / Factura Anulada Por Motivo de Devolucion";
        this.http.put(Urlbase.facturacion + "/billing-state/documentBody/"+this.IdDocumentDevolucion,null,{params: {'body': notas}}).subscribe((resp)=>{
          this.showNotification('top', 'center', 3, "<h3>LA FACTURA FUE ANULADA CORRECTAMENTE</h3> ", 'success');
      });
    });
    }else{
      this.showNotification('top', 'center', 3, "<h3>LA FACTURA YA SE ENCUENTRABA ANULADA POR DEVOLUCION</h3> ", 'danger');
    }

    this.FechaDevolucion="--/--/--";
    this.NotasDevolucion="--Sin notas--";
    this.TotalDevolucion="--No se Cargo el Total--";
    this.IdBillDevolucion="";
    this.IdDocumentDevolucion="";
    this.IdBillState = 0;
    this.botonDevolucionActive = true;

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

    var useProduct: any;
    var category: any;

  }


  setCategoryID(id,name){
    this.categoryID = id;
    this.categoryIDboolean = true;
    this.CategoryName = name;
  }


  putStandardPrice(element){
    let key = element.code;
    try{
      this.http2.put(Urlbase.tienda + "/store/standardprice?standard_price="+element.price+"&id_ps="+element.productStoreId,null).subscribe(response => {
        CPrint("THIS IS THING", this.inventoryList.find(item => (item.code == key || item.ownbarcode == key || String(item.product_STORE_CODE) == key)));
        let index = this.inventoryList.indexOf(this.inventoryList.find(item => (item.code == key || item.ownbarcode == key || String(item.product_STORE_CODE) == key)));
        this.inventoryList[index].standard_PRICE = element.price;
        this.showNotification('top','center',3,"<h3 class = 'text-center'>Se actualizo el precio de compra Exitosamente<h3>",'info');
      })
    }catch(Exception){
      this.showNotification('top','center',3,"<h3 class = 'text-center'>No se pudo actualizar el precio de compra.<h3>",'Danger');
    }
  }

  margenVenta = 0;
  margenVentaS = 0;

  margenCosto = 0;
  margenCostoS = 0;

  margenMin = 0;
  margenMinS = 0;

  imgUrl = "";
  getPriceList(product,code,id){
    CPrint("id is: ",id);
    this.http2.get(Urlbase.tienda + "/store/pricelist?id_product_store="+id).subscribe(response => {
      CPrint("This is picked price list: ",response);
      var datos = response;
      CPrint("this is datos: ",datos);
      console.log("My product: ",product)
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
            id_inventory_detail: product.id_INVENTORY_DETAIL,
            ownbarcode: product.ownbarcode,
            product_store_code: String(product.product_STORE_CODE),
            pricelist: response,
            priceGen: response[0].price,
            standarPrice: product.standard_PRICE,
            productStoreId: id
          };

          this.status = product.status;
          if(this.status != 'ACTIVO' && this.status!= 'INACTIVO' ){
            this.status = 'ACTIVO'
          }
          new_product.price = product.standard_PRICE;

          //this.detailBillDTOList.push(new_product);
          this.productsObject.unshift(new_product);
          this.setObject = Object.keys(this.productsObject);

          console.log("tHIS IS MY NEW PRODUCT: ", new_product)
          CPrint(this.productsObject);
          this.http2.get(Urlbase.tienda + "/resource/minmargen?id_ps="+product.id_PRODUCT_STORE).subscribe( resp => {
            //@ts-ignore
            this.margenMin = Math.round(resp* 100) / 100;
            //@ts-ignore
            this.margenMinS =  Math.round(resp* 100) / 100
          });

          this.http.get(Urlbase.tienda+"/inventories/getImgUrl?barcode="+product.ownbarcode,{responseType:'text'}).subscribe(response =>{
            this.imgurl = "https://tienda724.com/" + response;
          });

          this.nombreProducto = product.product_STORE_NAME;
          this.nombreProductoAnterior = product.product_STORE_NAME;

          this.ownnbarcode = product.ownbarcode;

          this.IVA = String((this.getPercentTax(product.id_TAX)*100).toFixed(2));
          console.log("THIS IS IVA: ",this.IVA)

          this.quickCode = product.product_STORE_CODE;
          this.quickCodeAnterior = product.product_STORE_CODE;

          this.margenVenta =  Math.round(((response[0].price - product.standard_PRICE)*100/response[0].price) * 100) / 100;
          this.margenVentaS =  Math.round(((response[0].price - product.standard_PRICE)*100/response[0].price) * 100) / 100;

          this.margenCosto =  Math.round(((response[0].price - product.standard_PRICE)*100/product.standard_PRICE) * 100) / 100;
          this.margenCostoS =   Math.round(((response[0].price - product.standard_PRICE)*100/product.standard_PRICE) * 100) / 100;

          this.http2.get(Urlbase.tienda + "/products2/quantity?id_product_store="+product.id_PRODUCT_STORE).subscribe( resp => {
            //@ts-ignore
            response.forEach(element => {
              if(element.price>this.precio){
                this.precio = element.price
              }
            });
            this.precioanterior = this.precio;
            this.costo = product.standard_PRICE;
            this.costoanterior =product.standard_PRICE;
            //@ts-ignore
            this.cantidad = resp;
            //@ts-ignore
            this.cantidadanterior = resp;

          })


          // event.target.blur();
          // event.target.value = '';
          // setTimeout(() => {
          //   document.getElementById('lastDetailQuantity');
          // });
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

  });
}
  addDetail(event) {

    CPrint("THIS IS DATA: ",this.productsObject);
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
    });
    if (key != null) {
      // CPrint("entro")
      //this.productsObject[this.productsObject.indexOf(key)].quantity += 1;
      CPrint("MOSTRAR");
      event.target.value = '';
    } else {
      var product = this.inventoryList.find(item => (item.code == code || item.ownbarcode == code || String(item.product_STORE_CODE) == code));
      CPrint("this is price product: ", this.priceList);
       //@ts-ignore
       if(product){
        if(this.setObject.length<1){
          this.getPriceList(product,code,product.id_PRODUCT_STORE)
        }else{
          if(localStorage.getItem("SesionExpirada") != "true"){ alert('Ya hay un producto actualmente.');}
        }

      }else{
        if(localStorage.getItem("SesionExpirada") != "true"){ alert('Ese codigo no esta asociado a un producto.');}
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
      subtotal += this.productsObject[code][attr] * Math.floor(this.productsObject[code]['quantity']);
    }
    return subtotal;
  }

  calculateTax() {
    var tax = 0;
    // if (!this.form.value['isRemission']) {
      for (let code in this.productsObject) {
        if(this.flagVenta){
          tax += this.productsObject[code]['price'] * Math.floor(this.productsObject[code]['quantity']) * this.productsObject[code]['tax'];
        }else{
          tax += this.productsObject[code]['purchaseValue'] * Math.floor(this.productsObject[code]['quantity']) * this.productsObject[code]['tax'];
        }
      }
    // }
    return tax;
  }

  calculateTotalPrice(key){
    return this.productsObject[key].price * Math.floor(this.productsObject[key].quantity)
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
    this.removalArray.forEach((item) => {
      //@ts-ignore
      if (this.productsObject.hasOwnProperty(item)) {
        //@ts-ignore
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
    this.urlUploaded = "Sin Archivo";
    this.imgurl ="https://tienda724.com/";
    this.fileBase64String=null;
    this.fileExtension=null;
    this.myInputVariable.nativeElement.value = "";
    this.inputForCode = '';
    this.getInventoryList2();
    this.listaElem = [];
    this.nombreProducto = '';
    this.nombreProductoAnterior = '';
    this.quickCode = '';
    this.quickCodeAnterior = '';
    this.ownnbarcode = 0;
    this.margenMinS=0;
    this.margenMin=0;
    this.margenCosto=0;
    this.margenCostoS=0;
    this.margenVenta=0;
    this.margenVentaS=0;
    this.precioanterior = 0;
    this.precio=0;
    this.costo=0;
    this.cantidad=0;
    this.form.reset();
    this.clientData = new ClientData(true, 'Cliente Ocacional', '--', '000', 'N/A', '000', 'N/A',null);
    this.productsObject = [];
    this.setObject = [];
    this.removalArray = new Set();
    this.CUSTOMER_ID= this.token.id_third_father;
  }
  cancel2() {
    this.inputForCode = '';
    this.listaElem = [];
    this.nombreProducto = '';
    this.nombreProductoAnterior = '';
    this.quickCode = '';
    this.quickCodeAnterior = '';
    this.ownnbarcode = 0;
    this.margenMinS=0;
    this.margenMin=0;
    this.margenCosto=0;
    this.margenCostoS=0;
    this.margenVenta=0;
    this.margenVentaS=0;
    this.precioanterior = 0;
    this.precio=0;
    this.costo=0;
    this.cantidad=0;
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

  second = true;
  fd: FormData;
  status;
  openDialogTransactionConfirm(): void {
    this.productsObject.forEach(elemento=> {

    if(this.fileBase64String != null){
      this.http.post(Urlbase.tienda+"/inventories/imageUpload",{file: this.fileBase64String, fileName: this.ownnbarcode,format: this.fileExtension},{responseType:'text'}).subscribe(response =>{
        console.log("answer", response);
      });
    }

    if(this.costo<this.precio && this.cantidad>=0){


      if(this.nombreProducto != this.nombreProductoAnterior){
        if( this.nombreProducto != null && this.nombreProducto.replace(/\s/g, "").length>0 && this.nombreProducto!=''){
          this.http2.put(Urlbase.tienda + "/resource/nombre?id_ps="+elemento.id_product_third+"&nombre="+this.nombreProducto,{}).subscribe(resp => {
            this.http2.post(Urlbase.tienda + "/resource/auditoria?nombre='"+elemento.description+" - "+elemento.ownbarcode+" - Actualizacion: Nombre Producto'&id_third_employee="+this.locStorage.getToken().id_third+"&id_store="+this.SelectedStore+"&valor_anterior="+this.nombreProductoAnterior+"&valor_nuevo="+this.nombreProducto,{}).subscribe(data => {
              CPrint(data);
            })
          })
        }else{
          if(localStorage.getItem("SesionExpirada") != "true"){ alert("El nombre de producto no puede estar vacio o ser compuesto con solo espacios");}
        }
      }

      if(this.quickCode != this.quickCodeAnterior){
        if( this.quickCode != null && this.quickCode.trim()>0 && this.quickCode!=''){
          this.http2.put(Urlbase.tienda + "/resource/quickCode?id_ps="+elemento.id_product_third+"&code="+this.quickCode+"&id_store="+this.SelectedStore,{}).subscribe(resp => {
            if(resp==1){
              this.http2.post(Urlbase.tienda + "/resource/auditoria?nombre='"+elemento.description+" - "+elemento.ownbarcode+" - Actualizacion: Codigo Rapido'&id_third_employee="+this.locStorage.getToken().id_third+"&id_store="+this.SelectedStore+"&valor_anterior="+this.quickCodeAnterior+"&valor_nuevo="+this.quickCode,{}).subscribe(data => {
                CPrint(data);
              })
            }else{
              if(localStorage.getItem("SesionExpirada") != "true"){ alert("El codigo rapido ya esta siendo usado por otro producto");}
            }
          })
        }else{
          if(localStorage.getItem("SesionExpirada") != "true"){ alert("El Codigo de producto no puede estar vacio o ser compuesto con solo espacios");}
        }
      }

      if(this.margenMin!=this.margenMinS){
        if(this.margenVentaS>=this.margenMinS){
          this.http2.put(Urlbase.tienda + "/resource/minmargen?id_ps="+elemento.id_product_third+"&margen="+this.margenMinS,{}).subscribe(resp => {
          CPrint(resp);
          this.http2.post(Urlbase.tienda + "/resource/auditoria?nombre='"+elemento.description+" - "+elemento.ownbarcode+" - Actualizacion: Margen Minima'&id_third_employee="+this.locStorage.getToken().id_third+"&id_store="+this.SelectedStore+"&valor_anterior="+this.margenMin+"&valor_nuevo="+this.margenMinS,{}).subscribe(data => {
            CPrint(data);

          })
          })
        }else{
          this.second=false;
          if(localStorage.getItem("SesionExpirada") != "true"){ alert("El valor de la margen de venta debe ser mayor o igual al valor de la margen minima nueva.");}
        }
      }
      CPrint("este es el elemento",elemento);
      if(this.margenVentaS>=this.margenMinS){


      if(this.margenVenta!=this.margenVentaS){
        this.precio = - (100*this.costo)/(this.margenVentaS-100);
        this.http2.post(Urlbase.tienda + "/resource/auditoria?nombre='"+elemento.description+" - "+elemento.ownbarcode+" - Actualizacion: Margen Venta'&id_third_employee="+this.locStorage.getToken().id_third+"&id_store="+this.SelectedStore+"&valor_anterior="+this.margenVenta+"&valor_nuevo="+this.margenVentaS,{}).subscribe(data => {
            CPrint(data);
          })
      }


      if(this.margenCosto!=this.margenCostoS){
        this.precio = ((this.margenCostoS*this.costo)/100) +this.costo;
        this.http2.post(Urlbase.tienda + "/resource/auditoria?nombre='"+elemento.description+" - "+elemento.ownbarcode+" - Actualizacion: Margen Costo'&id_third_employee="+this.locStorage.getToken().id_third+"&id_store="+this.SelectedStore+"&valor_anterior="+this.margenCosto+"&valor_nuevo="+this.margenCostoS,{}).subscribe(data => {
            CPrint(data);
          })
      }


      if((Math.round(((this.precio - this.costo)*100/this.precio) * 100) / 100)>this.margenMinS){
       this.http2.post(Urlbase.tienda + "/products2/procedure2?idps="+elemento.id_product_third
       +"&costo="+this.costo+"&precioanterior="+this.precioanterior+"&precionuevo="+this.precio
       +"&cantidad="+this.cantidad+"&tax="+this.IVA+"&itdhirduser="+this.token.id_third
       +"&status="+this.status,{}).subscribe(resp => {
        if(this.precio!=this.precioanterior){
          this.http2.post(Urlbase.tienda + "/resource/auditoria?nombre='"+elemento.description+" - "+elemento.ownbarcode+" - Actualizacion: Precio'&id_third_employee="+this.locStorage.getToken().id_third+"&id_store="+this.SelectedStore+"&valor_anterior="+this.precioanterior+"&valor_nuevo="+this.precio,{}).subscribe(data => {
            CPrint(data);
          })
        }
        if(this.costo!=this.costoanterior){

          this.http2.post(Urlbase.tienda + "/resource/auditoria?nombre='"+elemento.description+" - "+elemento.ownbarcode+" - Actualizacion: Costo'&id_third_employee="+this.locStorage.getToken().id_third+"&id_store="+this.SelectedStore+"&valor_anterior="+this.costoanterior+"&valor_nuevo="+this.costo,{}).subscribe(data => {
            CPrint(data);
          })
        }
        if(this.cantidad!=this.cantidadanterior){
        this.http2.post(Urlbase.tienda + "/resource/auditoria?nombre='"+elemento.description+" - "+elemento.ownbarcode+" - Actualizacion: Cantidad'&id_third_employee="+this.locStorage.getToken().id_third+"&id_store="+this.SelectedStore+"&valor_anterior="+this.cantidadanterior+"&valor_nuevo="+this.cantidad,{}).subscribe(data => {
          CPrint(data);
        })}
        this.cancel();
       })
      }else{
        if(localStorage.getItem("SesionExpirada") != "true"){ alert("El valor de precio o costo colocados, modifican la margen venta, de manera que esta queda por debajo de la margen minima.");}
      }
      }else{
        if(this.second){
          if(localStorage.getItem("SesionExpirada") != "true"){ alert("El valor de la margen de venta debe ser mayor o igual al valor de la margen minima.");}
        }else{
          this.second=true;
        }
      }



    }else{
      if(localStorage.getItem("SesionExpirada") != "true"){ alert("El costo debe ser menor al precio y la cantidad mayor o igual a 0.");}
    }
  })
  }






  openDialogTransactionConfirmEmpty() {
    const dialogRef = this.dialog.open(ModalConfirmEmptyInventoryComponent, {
      width: '40vw',
      height: '60vh'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.response){
        this.http.post(Urlbase.tienda+"/pedidos/actualizarInventarioACero?idstore="+this.SelectedStore,{}).subscribe(response => {
          if(response == 1){
            this.showNotification('top', 'center', 3, "<h3>Se ha limpiado su inventrio exitosamente</h3> ", 'info');
          }else{
            this.showNotification('top', 'center', 3, "<h3>Se presento un problema al limpiar su inventario</h3> ", 'info');
          }
        })
      }
    });
  }





  listaElem = [];
  disableDoubleClickSearch = false;
  inputForCode = "";
  listLoad(){

    this.listaElem = [];
    CPrint("THIS IS LISTA, ", this.listaElem);
    this.getElemsIfOwn().then(e => {
      CPrint("1");
      this.getElemsIfcode().then(a => {
        CPrint("2");
        //inserto elementos si name
        this.inventoryList.forEach(element => {
          if(element.product_STORE_NAME.toLowerCase( ).includes(this.inputForCode.toLowerCase())){
            this.listaElem.push(element);
          }
        })
      })
    })
  }


  async getElemsIfOwn(){
    this.inventoryList.forEach(element => {
      if(element.ownbarcode==this.inputForCode){
        CPrint("PUDE ENTRAR 1");
        this.listaElem.push(element);
      }
    })
  }

  async getElemsIfcode(){
    this.inventoryList.forEach(ele => {
      //@ts-ignore
      if(ele.product_STORE_CODE==this.inputForCode){
        CPrint("PUDE ENTRAR 2");
        this.listaElem.push(ele);
      }
    })
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
    this.http2.get(Urlbase.tienda+"/products2/inventoryListUpdate?id_store="+this.SelectedStore).subscribe((data: any[]) => {
                  CPrint("THIS IS INVENTORY LIST: ",data);
                 this.inventoryList = data;
                 //CPrint("this is InventoryList: "+JSON.stringify(data))
               },
               (error) =>{
                 CPrint(error);
               },
               () => {
                 if (this.inventoryList.length > 0) {

                 }
               });

       }



       getInventoryList2(){
         this.getIva();
         this.cancel2();
         this.http2.get(Urlbase.tienda+"/products2/inventoryListUpdate?id_store="+this.SelectedStore).subscribe((data: any[]) => {
                     this.inventoryList = data;
                     //CPrint("this is InventoryList: "+JSON.stringify(data))
                     this.getStorages2();
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
    CPrint("this is id person: ",data.id_person);
    if(data.id_person){
    CPrint("ENTRE");
    this.billDTO.id_third_destiny = data.id_person;
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
      this.detailBillDTO.quantity = Math.floor(element.quantity);

      if(element.quantity > 0) {
        this.detailBillDTOList.push(this.detailBillDTO);
      }

      // Inv Quantity
      this.inventoryQuantityDTO.id_inventory_detail = element.id_inventory_detail;
      this.inventoryQuantityDTO.id_product_third = element.id_product_third;
      this.inventoryQuantityDTO.code = element.code;
      this.inventoryQuantityDTO.id_storage = element.id_storage;

      // Inv Quantity for discount tienda
      this.inventoryQuantityDTO.quantity = Math.floor(element.quantity);;

      this.inventoryQuantityDTOList.push(
        this.inventoryQuantityDTO
      );
    }

    if (this.detailBillDTOList.length > 0) {
      let ID_BILL_TYPE= this.form.value['isRemission']?107:1;
      this.billDTO.id_third_employee = this.token.id_third_father;
      this.billDTO.id_third = this.token.id_third;
      this.billDTO.id_bill_type = 1;
      this.billDTO.id_store = this.SelectedStore;
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


            CPrint("This is datos: ",this.datos);
            CPrint("This is fecha: ",this.date3);
            CPrint("This is masked fecha: ",this.transformDate(this.date3));
            this.http2.put(Urlbase.facturacion + "/billing/billCompra?id_bill="+result+"&dato="+this.datos+"&fecha="+this.transformDate(this.date3),this.options,{ responseType: 'text'}).subscribe(response => {


              this.date3="";
              this.datos="";


            } );

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
    }else{this.detailBillDTOList = [];
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
        this.detailBillDTO.quantity = Math.floor(element.quantity);

        if(element.quantity > 0) {
          this.detailBillDTOList.push(this.detailBillDTO);
        }

        // Inv Quantity
        this.inventoryQuantityDTO.id_inventory_detail = element.id_inventory_detail;
        this.inventoryQuantityDTO.id_product_third = element.id_product_third;
        this.inventoryQuantityDTO.code = element.code;
        this.inventoryQuantityDTO.id_storage = element.id_storage;

        // Inv Quantity for discount tienda
        this.inventoryQuantityDTO.quantity = Math.floor(element.quantity);

        this.inventoryQuantityDTOList.push(
          this.inventoryQuantityDTO
        );
      }

      if (this.detailBillDTOList.length > 0) {
        let ID_BILL_TYPE= this.form.value['isRemission']?107:1;
        this.billDTO.id_third_employee = this.token.id_third_father;
        this.billDTO.id_third = this.token.id_third;
        this.billDTO.id_bill_type = 1;
        this.billDTO.id_store = this.SelectedStore;
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


              CPrint("This is datos: ",this.datos);
              CPrint("This is fecha: ",this.date3);
              CPrint("This is masked fecha: ",this.transformDate(this.date3));
              this.http2.put(Urlbase.facturacion + "/billing/billCompra?id_bill="+result+"&dato="+this.datos+"&fecha="+this.transformDate(this.date3),this.options,{responseType: 'text'}).subscribe();

              this.http2.get(Urlbase.facturacion + "/billing/master?id_bill="+result+"&id_store="+this.SelectedStore).subscribe(
                dataresult => {
                  this.http2.get(Urlbase.facturacion + "/billing/detail?id_bill="+result).subscribe(dataset => {


                    this.date3="";
                    this.datos="";
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

  }


  transformDate(date){
    return this.datePipe.transform(date, 'yyyy/MM/dd');
  }

  beginPlusOrDiscount(inventoryQuantityDTOList,isDisc) {
    if(isDisc == 1 || isDisc == 4){



      // this.inventoriesService.putQuantity(id_Store,quantity,code,inventoryQuantityDTOList);


      try{
      inventoryQuantityDTOList.forEach(element =>{
        this.inventoriesService.putQuantity(this.SelectedStore,Math.floor(element.quantity),element.code,inventoryQuantityDTOList,isDisc,element.id_storage).subscribe(result =>{
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
            this.inventoriesService.putQuantity(this.SelectedStore,((-1)*Math.floor(element.quantity)),element.code,inventoryQuantityDTOList,isDisc,element.id_storage).subscribe(result =>{
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
    this.removeItems();
    this.precioanterior=0;
    this.precio=0;
    this.costo=0;
    this.cantidad=0;

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

  SelectedFile: File = null;

  // setFileImage(event){
  //   this.SelectedFile = <File>event.target.files[0];

  //   this.fd = new FormData();
  //   this.fd.append('file',<File>event.target.files[0]);
  // }

  fileBase64String = null;
  fileExtension = null;
  urlUploaded = "Sin Archivo";
  setFileImage(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        console.log(reader.result);
        console.log("EXTENSION: ", event.target.files[0].name.split(".").pop());
        this.fileBase64String = reader.result;
        this.fileExtension = event.target.files[0].name.split(".").pop();
        this.urlUploaded = event.target.files[0].name;
    };
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
