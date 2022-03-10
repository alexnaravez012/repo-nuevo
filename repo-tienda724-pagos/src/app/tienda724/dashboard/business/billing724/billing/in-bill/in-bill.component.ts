import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {LocalStorage} from '../../../../../../services/localStorage';

import {MatDialog} from '@angular/material';
/* import components */
import {QuantityDialogComponent} from '../bill-main/quantity-dialog/quantity-dialog.component';
import {ThirdDialogComponent} from '../bill-main/third-dialog/third-dialog.component';
import {EmployeeDialogComponent} from '../bill-main/employee-dialog/employee-dialog.component';
import {PersonDialogComponent} from '../bill-main/person-dialog/person-dialog.component';
import {SearchClientDialogComponent} from '../bill-main/search-client-dialog/search-client-dialog.component';
import {SearchProductDialogComponent} from '../bill-main/search-product-dialog/search-product-dialog.component';
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
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {ClientData} from '../models/clientData';
import {InventoryComponent} from '../bill-main/inventory/inventory.component';
import {NewProductStoreComponent} from '../bill-main/new-product-store/new-product-store.component';
import {ThirdService} from '../../../../../../services/third.service';
import {BillInventoryComponentComponent} from '../bill-main/bill-inventory-component/bill-inventory-component.component';
import {DatePipe} from '@angular/common';
import * as jQuery from 'jquery';
import 'bootstrap-notify';
import {Router} from '@angular/router';
import {MatTableDataSourceWithCustomSort} from '../bill-main/pedidos/pedidos.component';
import {MatSort} from '@angular/material/sort';

let $: any = jQuery;

@Component({
  selector: 'in-bill-main',
  templateUrl: './in-bill.component.html',
  styleUrls: ['./in-bill.component.scss']
})
export class InBillComponent implements OnInit {
  api_uri = Urlbase.tienda;

  id_store = this.locStorage.getIdStore();
  CUSTOMER_ID;
  // venta =1
  // venta con remision 107

  //list
  itemLoadBilling: InventoryDetail;
  // inventoryList: InventoryDetail[];
  inventoryList: any;
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
  selected = new FormControl(0);
  CategoryName: string = "";
  taxesList: any;
  state: any;
  paymentDetail: string = '[{';
  paymentDetailObservable = this.httpClient;
  isTotalDev: boolean = false;
  idBillOriginal: String = "";
  storageList;
  priceList = [];
  pdfDatas: pdfData;

  storageActual: string = "1";

  flag = false;

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
  currentBox;
  idThird;
  myBox;
  inputForCode = "";

  SelectedBillState="1";

  listaElem = [];
  disableDoubleClickSearch = false;
  mostrandoCargando = false;

  EstadoBusquedaProducto = -1;
  dataSourceProductosSeleccionados = new MatTableDataSourceWithCustomSort(this.productsObject);
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  GetKeys(){
    return ["code","description","quantity","id_storage"];
  }


  constructor(public router: Router, private datePipe: DatePipe, public thirdService: ThirdService,private http2: HttpClient,private http: HttpClient, public locStorage: LocalStorage,private fb: FormBuilder, private billingService: BillingService,
    public inventoriesService: InventoriesService, public dialog: MatDialog, private httpClient: HttpClient) {

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
  }

  getPriceList2(product,code,id){
    CPrint("id is: ",id);
    this.http2.get(Urlbase.tienda + "/store/pricelist?id_product_store="+id).subscribe(response => {
      CPrint("This is picked price list: ",response);
      const datos = response;
      CPrint("this is datos: ",datos);
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
          new_product.price = product.standard_PRICE;

          this.productsObject.unshift(new_product);
          this.dataSourceProductosSeleccionados = new MatTableDataSourceWithCustomSort(this.productsObject);
          this.dataSourceProductosSeleccionados.sort = this.sort;
        } else {
          let codeList;
          this.http2.get(Urlbase.tienda + "/products2/code/general?code="+String(code)).subscribe(data => {
            codeList = data;
            CPrint("this is codeList: ", codeList);
          //@ts-ignore
          if( data.length == 0 ){
            if(localStorage.getItem("SesionExpirada") != "true"){ alert('El codigo no esta asociado a un producto');}
          }else{
            let dialogRef;
            dialogRef = this.dialog.open(NewProductStoreComponent, {
              width: '30vw',
              data: {codeList: codeList[0]}
            });
            dialogRef.afterClosed().subscribe(res=>{
              this.ngOnInit()
            })
          }
        });
      }
    });
  }

  addDetail2(code) {
    if(this.disableDoubleClickSearch){
      return;
    }
    this.disableDoubleClickSearch = true;
    // CPrint(code,"da code :3")

    // var codeFilter = this.productsObject.filter(item => (String(item.code) === code || String(item.ownbarcode) === code || String(item.product_store_code) === code ));

    // CPrint(codeFilter);
    let key: any = null;
    this.productsObject.forEach(item => {
      // CPrint("//-----------------------------------");
      // CPrint(item.code);
      // CPrint("//-----------------------------------");
      // CPrint(item.ownbarcode);
      // CPrint("//-----------------------------------");
      // CPrint(item.product_store_code);
      // CPrint("//-----------------------------------");
      if (item.code == code || item.ownbarcode == code || String(item.product_store_code) == code) {
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
      console.log(this.productsObject[this.productsObject.indexOf(key)]);
      this.disableDoubleClickSearch = false;
    } else {

      const product = this.inventoryList.find(item => this.findCode(code, item));
      // var product = this.inventoryList.find(item => (item.code == code || item.ownbarcode == code || String(item.product_STORE_CODE) == code));
      //@ts-ignore
      if (product) {
        this.getPriceList(product, code, product.id_PRODUCT_STORE);
        setTimeout(() => {
          this.disableDoubleClickSearch = false;
          this.elementRef.nativeElement.focus();
          this.elementRef.nativeElement.select();

        }, 100);
      } else {
        if(localStorage.getItem("SesionExpirada") != "true"){ alert('Ese codigo no esta asociado a un producto.');}
        this.disableDoubleClickSearch = false;
      }
    }
  }

  findCode(code, item) {

    if (item.ownbarcode == code) {
      return item;
    } else {
      if (String(item.product_STORE_CODE) == code) {
        return item;
      }
    }

  }

  openCategories2(){
    CPrint("THIS IS ROLES: ", this.locStorage.getTipo());

    let modal;
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
  id_menu=145;

  ngOnInit() {

    //PROTECCION URL INICIA
    CPrint(JSON.stringify(this.locStorage.getMenu()));
    const elem = this.locStorage.getMenu().find(item => item.id_menu == this.id_menu);

    if(!elem){
      // noinspection JSIgnoredPromiseFromCall
      this.router.navigateByUrl("/dashboard/business/movement/nopermision");
    }
    //PROTECCION URL TERMINA


    setTimeout(() => {

      this.elementRef.nativeElement.focus();
    this.elementRef.nativeElement.select();

  }, 100);

    CPrint(this.locStorage.getMenu(),"lo menu Xddd");

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
    // noinspection JSIgnoredPromiseFromCall
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

  getStorages() {
    this.http2.get(Urlbase.tienda + "/store/s?id_store="+this.id_store).subscribe((res)=>{
      this.storageList = res;
    });

  }

  getBillData(event){
    this.httpClient.get(Urlbase.facturacion + "/billing-state/billData?consecutive="+event.target.value).subscribe((res)=>{
      const refund = res;
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
      const state = 41;
      let params = new HttpParams();
      params = params.append('state',  state+"");
      this.http.put(Urlbase.facturacion + "/billing-state/billState/"+this.IdBillDevolucion,null,{params: params}).subscribe((res)=>{
        const notas = this.NotasDevolucion + ' / Factura Anulada Por Motivo de Devolucion';
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

  openInventories(){
    const dialogRef = this.dialog.open(InventoryComponent, {
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
    let thisTax;
    let taxToUse;

    for (thisTax in this.taxesList){
          if(idTaxProd == this.taxesList[thisTax].id_tax_tariff){
            taxToUse = this.taxesList[thisTax].percent/100;
          }
      }

      return taxToUse;
  }

  getCodesByCategory(){
    let product: any;
    for (product in this.usableProducts){
      let compProduct = this.usableProducts[product];
        if(compProduct.id_category == this.categoryID){
          if(!this.productsByCategoryList.includes(compProduct)){
            this.productsByCategoryList.push(compProduct);
          }
        }

    }
    let code: any;
    for (code in this.codeList){
      let compCode = this.codeList[code];
      let product:any;
      for (product in this.productList){
        let compProduct = this.productList[product];
        if(compCode.id_product == compProduct.id_product){
          compCode.img_url = compProduct.img_url;
          compCode.id_category = compProduct.id_category;
          compCode.description_product = compProduct.description_product;
          compCode.name_product = compProduct.name_product;
          const elem = this.inventoryList.find(item => item.code == compCode.code);
          compCode.price = elem.standard_PRICE;
          if(!this.codesByProductList.includes(compCode)){
            this.codesByProductList.push(compCode);
          }
        }
      }
    }
    let codeKey: any;
    for (codeKey in this.codeList){
     let compCode = this.codesByProductList[codeKey];
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

      const aux = this.productList.filter(
        product => {
          return code.id_product == product.id_product;
        }
      )[0];

      if(!this.usableProducts.includes(aux)){
        this.usableProducts.push(aux)
      }

    });


    this.usableProducts.forEach(prod => {

      const aux = this.notCategoryList.filter(
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
    //   let compCode = this.codeList[code]
    //   let product:any;
    //   for (product in this.productList){
    //     let compProduct = this.productList[product]
    //     if(compCode.id_product == compProduct.id_product){

    //       if(!this.usableProducts.includes(compProduct)){
    //         this.usableProducts.push(compProduct);
    //       }
    //     }
    //   }
    // }

    let useProduct: any;
    let category: any;


    // for(useProduct in this.usableProducts){
    //   let compUseProduct = this.usableProducts[useProduct]
    //   for (category in this.notCategoryList){
    //     let compCategory = this.notCategoryList[category];
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

  getPriceList(product,code,id){
    CPrint("id is: ",id);
    this.http2.get(Urlbase.tienda + "/store/pricelist?id_product_store="+id).subscribe(response => {
      CPrint("This is picked price list: ",response);
      const datos = response;
      CPrint("this is datos: ",datos);
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
            productStoreId: id,
            invQuantity: product.quantity
          };
          new_product.price = product.standard_PRICE;

          //this.detailBillDTOList.push(new_product);
          this.productsObject.unshift(new_product);
          this.dataSourceProductosSeleccionados = new MatTableDataSourceWithCustomSort(this.productsObject);
          this.dataSourceProductosSeleccionados.sort = this.sort;

          // event.target.blur();
          // event.target.value = '';
          // setTimeout(() => {
          //   document.getElementById('lastDetailQuantity');
          // });
        } else {
          let codeList;
          this.http2.get(Urlbase.tienda + "/products2/code/general?code="+String(code)).subscribe(data => {
            codeList = data;
            CPrint("this is codeList: ", codeList);
          //@ts-ignore
          if( data.length == 0 ){
            alert('El codigo no esta asociado a un producto');
          }else{
            let dialogRef;
            dialogRef = this.dialog.open(NewProductStoreComponent, {
              width: '30vw',
              data: {codeList: codeList[0]}
            });
            dialogRef.afterClosed().subscribe(res=>{
              this.disableDoubleClickSearch = false;
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
  if(this.disableDoubleClickSearch){
    return;
  }
  this.disableDoubleClickSearch = true;
  const code = String(event.target.value);

  const product = this.inventoryList.find(item => this.findCode(code, item));

  if(product && product.inventario_DISPONIBLE == 'S' ){
    if((!(product.status == 'ACTIVO') || product.quantity < 1)){
      this.disableDoubleClickSearch = false;
      return;
    }
  }
  // CPrint(code,"da code :3")

  // var codeFilter = this.productsObject.filter(item => (String(item.code) === code || String(item.ownbarcode) === code || String(item.product_store_code) === code ));

  // CPrint(codeFilter);
  let key: any = null;
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
    this.disableDoubleClickSearch = false;
  } else {
    event.target.value = '';
    // var product = this.inventoryList.find(item => (item.code == code || item.ownbarcode == code || String(item.product_STORE_CODE) == code));
    const product = this.inventoryList.find(item => this.findCode(code, item));
    //@ts-ignore
    if(product){
      this.getPriceList(product,code,product.id_PRODUCT_STORE)
      this.disableDoubleClickSearch = false;
    }else{
      if(localStorage.getItem("SesionExpirada") != "true"){ alert('Ese codigo no esta asociado a un producto.');}
      this.disableDoubleClickSearch = false;
    }
  }
}



onSearchChange(itemQuant,event){

  const elem = this.productsObject.forEach((item, index) => {
    if(item.ownbarcode == itemQuant.ownbarcode){
      if(item.quantity == null){
        setTimeout(() => {

          this.elementRef.nativeElement.focus();
          this.elementRef.nativeElement.select();
          setTimeout(() => {

            this.productsObject[index].quantity = 1;
            this.dataSourceProductosSeleccionados = new MatTableDataSourceWithCustomSort(this.productsObject);
            this.dataSourceProductosSeleccionados.sort = this.sort;

          }, 100);

        }, 100);
      }
    }
  });

}





  calculateSubtotal() {
    let subtotal = 0;
    const attr = this.flagVenta ? 'price' : 'purchaseValue';
    for (let code in this.productsObject) {
      subtotal += this.productsObject[code][attr] * this.productsObject[code]['quantity'];
    }
    return subtotal;
  }

  calculateTax() {
    let tax = 0;
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

  listLoad(){
    this.EstadoBusquedaProducto = 1;
    this.listaElem = [];
    this.inventoryList.forEach(element => {
      //@ts-ignore
      if (element.product_STORE_NAME.toLowerCase().includes(this.inputForCode.toLowerCase()) || element.ownbarcode == this.inputForCode || element.product_STORE_CODE == this.inputForCode) {
        this.listaElem.push(element);
      }
    });
    this.EstadoBusquedaProducto = 2;
  }

  applyFilter(filterValue: string){
    let filteredList = this.inventoryList;
    let listWord = filterValue.split(" ");
    let listSize = listWord.length;
    let filterSize = filterValue.length;

    //if(filterValue !== "" && filterValue !== null && filterValue.length>2){
    if(filterValue !== "" && filterValue !== null){
      filteredList = this.inventoryList.filter( element => element.ownbarcode.toLowerCase().includes(listWord[0].toLowerCase()) || element.product_STORE_CODE.toLowerCase().includes(listWord[0].toLowerCase()) || element.product_STORE_NAME.toLowerCase().normalize('NFD')
      .replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,"$1")
      .normalize().includes(listWord[0].toLowerCase().normalize('NFD')
      .replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,"$1")
      .normalize()))

      if(listSize>1){
        for(let i = 1;i<listSize;i++){
          filteredList = filteredList.filter( element => element.ownbarcode.toLowerCase().includes(listWord[i].toLowerCase()) || element.product_STORE_CODE.toLowerCase().includes(listWord[i].toLowerCase()) || element.product_STORE_NAME.toLowerCase().normalize('NFD')
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


  cancel() {
    this.form.reset();
    this.clientData = new ClientData(true, 'Cliente Ocacional', '--', '000', 'N/A', '000', 'N/A',null);
    this.productsObject = [];
    this.EstadoBusquedaProducto = -1;
    this.dataSourceProductosSeleccionados = new MatTableDataSourceWithCustomSort(this.productsObject);
    this.dataSourceProductosSeleccionados.sort = this.sort;
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
    let dialogRef;
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
        let isNaturalPerson= result.data.hasOwnProperty('profile');
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
    let flag = true;
    this.productsObject.forEach(element => {
      let list = this.productsObject.find(element2 => element.code == element2.code)
      if(list.length>1){
        this.flag = false;
      }
    })

    if(flag){
      const result = 0;
      this.mostrandoCargando = true;
      this.sendData(result,disc,isCompra)
    }else{
      this.showNotification('top', 'center', 3, "<h3>Se encontro un producto con doble detalle en la factura, por favor elimine uno</h3> ", 'danger');
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

  async getInventoryList(store){
    this.http2.get(Urlbase.tienda+"/products2/inventoryListActivos?id_store="+this.locStorage.getIdStore()).subscribe(data => {
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

  sendData(data,disc,isCompra){

    let detailList = '';
    //GENERO LA LISTA DE DTOs DE DETALLES
    this.productsObject.forEach(item => {
      CPrint(item);
      detailList = detailList+ "{"+item.id_product_third+","+item.price+","+item.tax_product+","+item.quantity+"},"
    });

    let Temp_productsObject = [...this.productsObject];
    this.billDTO.id_store = this.locStorage.getIdStore();
    if(data.id_person){
      this.billDTO.id_third_destiny = data.id_person;
    }
    this.detailBillDTOList = [];
    this.commonStateDTO.state = 1;
    this.inventoryQuantityDTOList = [];
    let titleString= this.form.value['isRemission']?' Por Remision':'';
    //
    this.documentDTO.title = 'Movimiento De Entrada';
    //
    this.documentDTO.body = this.ObservationsInOrOut;
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
      this.billDTO.id_bill_type = 3;
      this.billDTO.id_store = this.locStorage.getIdStore();
      //instanciar de acuerdo a por remision
      this.billDTO.id_bill_state = Number(this.SelectedBillState);
      this.billDTO.purchase_date = new Date();
      this.billDTO.subtotal = this.calculateSubtotal();
      this.billDTO.tax = this.calculateTax();
      this.billDTO.totalprice = this.calculateTotal();

      this.billDTO.discount = 0;
      this.billDTO.documentDTO = this.documentDTO;
      this.billDTO.state = null;

      this.billDTO.details = this.detailBillDTOList;

      CPrint(JSON.stringify(this.billDTO),"This is Bill DTO");

      CPrint("THIS IS BILL DTO V2: ", JSON.stringify({idthirdemployee:this.billDTO.id_third,
        idthird:this.billDTO.id_third_employee,
        idbilltype:this.billDTO.id_bill_type,
        notes:this.billDTO.documentDTO.body,
        idthirddestinity:this.billDTO.id_third_destiny,
        idcaja:this.locStorage.getIdCaja(),
        idstore:this.locStorage.getIdStore(),
        idbankentity:1,
        idthirddomiciliario:-1,
        idbillstate:this.SelectedBillState,
        details:detailList.substring(0, detailList.length - 1),
        disccount: 0,
        num_documento_factura: "0"}));

      this.http2.post(Urlbase.facturacion+"/billing/v2",{idthirdemployee:this.billDTO.id_third,
        idthird:this.billDTO.id_third_employee,
        idbilltype:this.billDTO.id_bill_type,
        notes:this.billDTO.documentDTO.body,
        idthirddestinity:this.billDTO.id_third_destiny,
        idcaja:this.locStorage.getIdCaja(),
        idstore:this.locStorage.getIdStore(),
        idbankentity:1,
        idthirddomiciliario:-1,
        idbillstate:this.SelectedBillState,
        details:detailList.substring(0, detailList.length - 1),
        disccount: 0,
        num_documento_factura: "0",
        idthirdvendedor: -1}).subscribe(idBill => {
          if(idBill != 0){

          this.http2.get(Urlbase.facturacion+"/billing/UniversalPDF?id_bill="+idBill+"&pdf=-1&cash=0&size="+false,{responseType: 'text'}).subscribe(response =>{
            //-----------------------------------------------------------------------------------------------------------------
            window.open(Urlbase.facturas+"/"+response, "_blank");
            this.showNotification('top', 'center', 3, "<h3>Se ha realizado el movimento <b>CORRECTAMENTE</b></h3> ", 'info');
             this.mostrandoCargando = false;
              //@ts-ignore
              CPrint(data);
              setTimeout(() => {
                this.cancel();

                this.elementRef.nativeElement.focus();
                this.elementRef.nativeElement.select();

              }, 100);

        });
      }else{
        this.showNotification('top', 'center', 3, "<h3>Se presento un problema al generar la factura.</h3> ", 'danger');
        this.mostrandoCargando = false;
      }
      })


    }
  }

  transformDate(date){
    return this.datePipe.transform(date, 'yyyy/MM/dd');
  }

  transformDateWithHour(date){
    return this.datePipe.transform(date, 'yyyy/MM/dd, h:mm a');
  }

  beginPlusOrDiscount(inventoryQuantityDTOList,isDisc) {
    try{
      inventoryQuantityDTOList.forEach(element =>{
        CPrint(element);
        this.inventoriesService.putQuantity(this.locStorage.getIdStore(),((-1)*element.quantity),element.code,inventoryQuantityDTOList,isDisc,element.id_storage).subscribe(result =>{
          if(this.SelectedBillState=="301"){
            this.http2.post(Urlbase.tienda + "/pedidos/procedure?idbill=-4001&idbillstate="+this.SelectedBillState+"&code="+element.code+"&idstore="+this.locStorage.getIdStore()+"&cantidad="+element.quantity+"&tipo=E",{},{}).subscribe(item =>{
          });
          }
          if(this.SelectedBillState=="302"){
            this.http2.post(Urlbase.tienda + "/pedidos/procedure?idbill=-4002&idbillstate="+this.SelectedBillState+"&code="+element.code+"&idstore="+this.locStorage.getIdStore()+"&cantidad="+element.quantity+"&tipo=E",{},{}).subscribe(item =>{
          });
          }
          if(this.SelectedBillState=="303"){
            this.http2.post(Urlbase.tienda + "/pedidos/procedure?idbill=-4003&idbillstate="+this.SelectedBillState+"&code="+element.code+"&idstore="+this.locStorage.getIdStore()+"&cantidad="+element.quantity+"&tipo=E",{},{}).subscribe(item =>{
          });
          }
          if(this.SelectedBillState=="304"){
            this.http2.post(Urlbase.tienda + "/pedidos/procedure?idbill=-4004&idbillstate="+this.SelectedBillState+"&code="+element.code+"&idstore="+this.locStorage.getIdStore()+"&cantidad="+element.quantity+"&tipo=E",{},{}).subscribe(item =>{
          });
          }
          if(this.SelectedBillState=="305"){
            this.http2.post(Urlbase.tienda + "/pedidos/procedure?idbill=-4005&idbillstate="+this.SelectedBillState+"&code="+element.code+"&idstore="+this.locStorage.getIdStore()+"&cantidad="+element.quantity+"&tipo=E",{},{}).subscribe(item =>{
          });
        }
        });
      });
      this.showNotification('top', 'center', 3, "<h3>Se ha realizado el movimento <b>CORRECTAMENTE</b></h3> ", 'info');
      this.cancel();
    }catch{
      this.showNotification('top', 'center', 3, "<h3>El movimento presento <b>PROBLEMAS</b></h3> ", 'info')
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

  individualDelete(element){
    let tempList = [];
    for(let n = 0;n<this.productsObject.length;n++){
      if(this.productsObject[n] != element){
        tempList.unshift(this.productsObject[n]);
      }
    }
    this.productsObject = tempList;
    this.dataSourceProductosSeleccionados = new MatTableDataSourceWithCustomSort(this.productsObject);
    this.dataSourceProductosSeleccionados.sort = this.sort;
  }

  setMax(product){
    if(product.quantity>product.invQuantity){
      product.quantity = product.invQuantity;
    }else{
      return;
    }
  }

  upQuantity(elemento){

      elemento.quantity+=1;
  }

  downQuantity(elemento){
    if(1<elemento.quantity){
      elemento.quantity-=1;
    }
  }
}

export class pdfData_inOutbill{
  detalles: String[][];
  obs: String;
  razon: String;
  fecha: String;
  nombreEmpresa: String;
  NIT: String;
  id_third: String;
  caso: String;
  constructor(
      detalles: String[][],
      obs: String,
      razon: String,
      fecha: String,
      nombreEmpresa: String,
      NIT: String,
      id_third: String,
      caso: String,
      ){
    this.detalles = detalles;
    this.obs = obs;
    this.razon = razon;
    this.fecha = fecha;
    this.nombreEmpresa = nombreEmpresa;
    this.NIT = NIT;
    this.id_third = id_third;
    this.caso = caso;
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
  product_STORE_CODE: string;
  constructor(ID_TAX: number,
    STANDARD_PRICE: number,
    ID_PRODUCT_STORE: number,
    PRODUCT_STORE_NAME: string,
    CODE: string,
    ID_INVENTORY_DETAIL: number,
    OWNBARCODE: string,
    PRODUCT_STORE_CODE: string){
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
