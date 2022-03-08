import {Component, ElementRef, OnInit, ViewChild, Input} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {LocalStorage} from '../../../../../../../services/localStorage';
//import { Http, Headers, Response, URLSearchParams } from '@angular/http';
import {MatDialog, MatTableDataSource} from '@angular/material';
/* import components */
import {ReportesComponent} from '../../../billing/bill-main/reportes/reportes.component';
import {QuantityDialogComponent} from '../quantity-dialog/quantity-dialog.component';
import {ThirdDialogComponent} from '../third-dialog/third-dialog.component';
import {CloseBoxComponent} from '../close-box/close-box.component';
import {EmployeeDialogComponent} from '../employee-dialog/employee-dialog.component';
import {PersonDialogComponent} from '../person-dialog/person-dialog.component';
import {SearchClientDialogComponent} from '../search-client-dialog/search-client-dialog.component';
import {SearchProductDialogComponent} from '../search-product-dialog/search-product-dialog.component';
import {TransactionConfirmDialogComponent} from '../transaction-confirm-dialog/transaction-confirm-dialog.component';
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
import {InventoryComponent} from '../inventory/inventory.component';
import {StoresComponent} from '../stores/stores.component';
import {UpdateLegalDataComponent} from '../update-legal-data/update-legal-data.component';
import {NewProductStoreComponent} from '../new-product-store/new-product-store.component';
import {ThirdService} from '../../../../../../../services/third.service';
import {BillInventoryComponentComponent} from '../../bill-main/bill-inventory-component/bill-inventory-component.component';
import {StoreSelectorService} from '../../../../../../../components/store-selector.service';
import {TopProductsComponent} from '../top-products/top-products.component';
import {paymentDetailDTO} from '../../models/paymentDetailDTO';
import {stateDTO} from '../../models/stateDTO';
import {OpenBoxComponent} from '../../../../../../../components/open-box/open-box.component';
import {OpenorcloseboxComponent} from '../../../../../../../components/openorclosebox/openorclosebox.component';
import {SelectboxComponent} from '../../../../../../../components/selectbox/selectbox.component';
import * as jQuery from 'jquery';
import 'bootstrap-notify';
import {Router} from '@angular/router';
import {MatTableDataSourceWithCustomSort} from '../pedidos/pedidos.component';
import {MatSort} from '@angular/material/sort';
import pdfMake from 'pdfmake/build/pdfmake.min';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {ContingencyBillListComponent} from '../contingency-bill-list/contingency-bill-list.component';
import {AuthenticationService} from '../../../../../../../services/authentication.service';
import { ThirdselectComponent } from '../../thirdselect/thirdselect.component';
import { DatePipe } from '@angular/common';
import { GenerateThirdComponent2Component } from '../generate-third-component2/generate-third-component2.component';
import { CategoriesComponent } from '../categories/categories.component';
import { DomiciliosComponent } from '../domicilios/domicilios.component';
import { Openorclosebox2Component } from 'src/app/components/openorclosebox2/openorclosebox2.component';

let $: any = jQuery;
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
  selector: 'app-domicilios-telefonicos',
  templateUrl: './domicilios-telefonicos.component.html',
  styleUrls: ['./domicilios-telefonicos.component.css']
  })
export class DomiciliosTelefonicosComponent implements OnInit  {
  quickconfirm = false;
  api_uri = Urlbase.tienda;
  ccClient = "";
  id_store = this.locStorage.getIdStore();
  CUSTOMER_ID;
  // venta =1
  // venta con remision 107
  inputForCode = "";
  date3="";
  datos="";
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
  tipoFactura: string = "compra";
  isTotalDev: boolean = false;
  idBillOriginal: String = "";
  storageList;
  priceList = [];
  pdfDatas: pdfData;


  storageActual: string = "1";


  FechaDevolucion: String="--/--/--";
  NotasDevolucion: String="--Sin notas--";
  TotalDevolucion: String="--No se Cargo el Total--";
  IdBillDevolucion: String="";
  IdDocumentDevolucion: String="";
  IdBillState;
  botonDevolucionActive: Boolean = true;

  public productsObject = [];

  EstadoBusquedaProducto = -1;
  dataSourceProductosSeleccionados = new MatTableDataSourceWithCustomSort(this.productsObject);
  @ViewChild(MatSort, {static: true}) sort: MatSort;

  GetKeys(){
    return ["code","description","quantity","price","tax","total"];
  }
  @Input()
  mainclassref_input: DomiciliosComponent;
  mainclassref: DomiciliosComponent;
  // DTO's
  inventoryQuantityDTO: InventoryQuantityDTO;
  inventoryQuantityDTOList: InventoryQuantityDTO[];
  detailBillingDTOList: any[];
  commonStateDTO: CommonStateDTO;
  documentDTO: DocumentDTO;
  detailBillDTO: DetailBillDTO;
  detailBillDTOList: DetailBillDTO[];
  billDTO: BillDTO;
  paymentMethod = 1;


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
  paymentDetailFinal: paymentDetailDTO = new paymentDetailDTO(1,1,0," ",new stateDTO(1));
  private readonly headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  private options;
  @ViewChild('nameit') private elementRef: ElementRef;
  @ViewChild('nameot') private elementRef2: ElementRef;


  constructor(private authService:AuthenticationService, private service: StoreSelectorService,public router: Router, private datePipe: DatePipe, public thirdService: ThirdService,private http: HttpClient, public locStorage: LocalStorage,private fb: FormBuilder, private billingService: BillingService,
              public inventoriesService: InventoriesService, public dialog: MatDialog, private httpClient: HttpClient) {
    this.headers = new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization':  this.locStorage.getTokenValue(),
    });

    this.clientData = new ClientData(true, 'Cliente Ocasional', '--', '000', 'N/A', '000', 'N/A', null);
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
  currentBox;
  idThird;
  myBox;
  cliente="Cliente Ocasional";
  id_person=3088;

  obs = "";

  listaElem = [];

  getMessage(element){
      return "Cantidad Disponible: "+element.invQuantity;
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



  searchClient2(){
    CPrint("THIS ARE HEADERS",this.headers);
    const identificacionCliente = this.ccClient;
    let aux;
    this.http.get<any[]>(Urlbase.tercero + '/persons/search?doc_person='+String(identificacionCliente),{ headers: this.headers }).subscribe(res =>{
      CPrint(res);
      if (res.length == 0){
        this.openDialogClient2()
        // this.showNotification('top', 'center', 3, "<h3>No se encontro el tercero, se asigna nuevamente el Cliente Ocasional</h3> ", 'info')
        // this.clientData = new ClientData(true, 'Cliente Ocasional', '--', '000', 'N/A', '000', 'N/A', null);
        // this.cliente="Cliente Ocasional";
        // this.id_person=3088;
        // this.searchClient(event);
      }else{
        const dialogRef = this.dialog.open(ThirdselectComponent, {
          width: '60vw',
          height: '80vh',

          data: { thirdList: res }
        });

        dialogRef.afterClosed().subscribe(result => {
          if(result){

            aux = this.locStorage.getPersonClient();
            CPrint("THIS THE AUX I NEED:", aux);
            this.cliente = aux.fullname;
            this.clientData.is_natural_person = true;
            this.clientData.fullname = aux.fullname;
            this.clientData.document_type = aux.document_TYPE;
            this.clientData.document_number = aux.document_NUMBER;
            this.clientData.id_third = aux.id_PERSON;
            this.id_person = aux.id_PERSON;
            this.clientData.address = aux.address;
            this.clientData.email = aux.city;
            this.clientData.phone = aux.phone;
            CPrint("THIS IS THE CLIENT",this.clientData);
            this.http.get(Urlbase.facturacion + "/billing/pedidos?id_store="+this.locStorage.getIdStore()+"&id_third="+aux.id_PERSON).subscribe(r => {
              //@ts-ignore
              r.push({numdocumento: "",
              id_BILL: -1,
              id_THIRD: -1})
              //@ts-ignore
              this.pedidosList = r;

            });
            setTimeout(() => {

              this.elementRef.nativeElement.focus();
              this.elementRef.nativeElement.select();

            }, 100);

          }else{
            this.clientData = new ClientData(true, 'Cliente Ocasional', '--', '000', 'N/A', '000', 'N/A', null);
            this.cliente="Cliente Ocasional";
            this.id_person=3088;
          }
        });


      }


    });


  }

  openDialogClient2(): void {



    const dialogRef = this.dialog.open(GenerateThirdComponent2Component, {
      width: '60vw',
      data: {}
    });


    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        alert("IM IN")
        CPrint(result)
        // CPrint('CREATE CLIENT SUCCESS');
        // CPrint(result);s
        this.httpClient.get(Urlbase.tercero+"/thirds/idThird?id_document_type="+result.person.profile.info.id_document_type+"&document_number="+result.person.profile.info.document_number,{ headers: this.headers }).subscribe(result2 => {
          //@ts-ignore
          this.id_person = result2;
          this.cliente = result.person.profile.info.fullname
          this.clientData.document_type = "CC"
          this.clientData.document_number = result.person.profile.info.document_number
          this.clientData.address = result.person.profile.directory.address
          this.clientData.phone = result.person.profile.directory.phones[0].phone

        });
        setTimeout(() => {

          this.elementRef.nativeElement.focus();
          this.elementRef.nativeElement.select();

        }, 100);
      }else{
        this.clientData = new ClientData(true, 'Cliente Ocasional', '--', '000', 'N/A', '000', 'N/A', null);
        this.cliente="Cliente Ocasional";
        this.id_person=3088;
      }
      setTimeout(() => {

        this.elementRef.nativeElement.focus();
        this.elementRef.nativeElement.select();

      }, 100);
    });
  }

  searchClient(event){
    const identificacionCliente = String(event.target.value);
    let aux;
    this.httpClient.get<any[]>(Urlbase.tercero + '/persons/search?doc_person='+String(identificacionCliente),{ headers: this.headers }).subscribe((res)=>{
      CPrint(res);
      if (res.length == 0){
        this.openDialogClient2();
        // this.searchClient(event);
      }else{
        const dialogRef = this.dialog.open(ThirdselectComponent, {
          width: '60vw',
          height: '80vh',

          data: { thirdList: res }
        });

        dialogRef.afterClosed().subscribe(result => {
          if(result){

            aux = this.locStorage.getPersonClient();
            CPrint("THIS THE AUX I NEED:", aux);
            this.cliente = aux.fullname;
            this.clientData.is_natural_person = true;
            this.clientData.fullname = aux.fullname;
            this.clientData.document_type = aux.document_TYPE;
            this.clientData.document_number = aux.document_NUMBER;
            this.clientData.id_third = aux.id_PERSON;
            this.id_person = aux.id_PERSON;
            this.clientData.address = aux.address;
            this.clientData.email = aux.city;
            this.clientData.phone = aux.phone;
            CPrint("THIS IS THE CLIENT",this.clientData);
            CPrint("THIS IS THE CLIENT",this.clientData);
            this.http.get(Urlbase.facturacion + "/billing/pedidos?id_store="+this.locStorage.getIdStore()+"&id_third="+aux.id_PERSON).subscribe(r => {
              //@ts-ignore
              r.push({numdocumento: "",
              id_BILL: -1,
              id_THIRD: -1})
              //@ts-ignore
              this.pedidosList = r;

            });
            setTimeout(() => {

              this.elementRef.nativeElement.focus();
              this.elementRef.nativeElement.select();

            }, 100);

          }else{
            this.clientData = new ClientData(true, 'Cliente Ocasional', '--', '000', 'N/A', '000', 'N/A', null);
            this.cliente="Cliente Ocasional";
            this.id_person=3088;
          }
          setTimeout(() => {

            this.elementRef.nativeElement.focus();
            this.elementRef.nativeElement.select();

          }, 100);
        });
      }
    });
  }

  quickConfirm(){
    // this.sendData({clientData:this.clientData,
    //   cambio:0,
    //   wayToPay: "contado",
    //   cash: this.roundnum(this.calculateTotal()),
    //   creditBank: "",
    //   debitBank: "",
    //   observations: this.obs,
    //   paymentMethod: "efectivo",
    //   transactionCode: " ",});
    let detailList = '';
    //GENERO LA LISTA DE DTOs DE DETALLES
    this.productsObject.forEach(item => {
      CPrint(item);
      detailList = detailList+ "{"+item.id_product_third+","+item.price+","+item.tax_product+","+item.quantity+"},"
    });

    CPrint(Urlbase.facturacion + "/pedidos/crearPedidoApp?idstoreclient=11&idthirduseraapp="+this.id_person+"&idstoreprov="+this.locStorage.getIdStore()+"&detallepedido="+detailList.substring(0, detailList.length - 1)+"&descuento="+0+"&idpaymentmethod="+this.paymentMethod+"&idapp="+-1);
    this.http.post(Urlbase.facturacion + "/pedidos/crearPedidoApp?idstoreclient=11&idthirduseraapp="+this.id_person+"&idstoreprov="+this.locStorage.getIdStore()+"&detallepedido="+detailList.substring(0, detailList.length - 1)+"&descuento="+0+"&idpaymentmethod="+this.paymentMethod+"&idapp="+-1,{}).subscribe(item => {
      this.http.get(Urlbase.facturacion+"/billing/getMaxBillPedidos?idstore="+this.locStorage.getIdStore()+"&idemp="+this.locStorage.getToken().id_third).subscribe(response2=> {
        this.http.get(Urlbase.facturacion+"/billing/validatePdfDrawing?idbill="+response2).subscribe(element => {
          if(element>0){
            if(item==1){
              this.showNotification('top', 'center', 3, "<h3>Pedido creado con <b>EXITO.</b></h3> ", 'info');
              this.mainclassref.SendFCMpush("Se te ha creado una orden","Tienes una orden con '"+this.productsObject.length+"' productos",{message:"New Order"},this.id_person,this.cliente,26);
              this.cancel();
              this.mainclassref.compUpdate2.updateDataRecibidos();
            }else{
              this.showNotification('top', 'center', 3, "<h3>Se presento un error al crear el pedido.</h3> ", 'idangernfo');
              this.cancel();
            }
          }else{

            this.showNotification('top', 'center', 3, "<h3>Error. No se pudo generar la factura, porque el inventario está agotado.</h3> ", 'danger');
            this.quickconfirm=false;
            this.mostrandoCargando = false;
            this.productsObject = [];
            this.dataSourceProductosSeleccionados = new MatTableDataSourceWithCustomSort(this.productsObject);
            this.dataSourceProductosSeleccionados.sort = this.sort;
            this.elementRef.nativeElement.focus();
            this.elementRef.nativeElement.select();

          }
        })
      })
    })
  }







  roundnum(num){
    return Math.round(num / 50)*50;
  }


  sendData(data){

    let detailList = '';
    //GENERO LA LISTA DE DTOs DE DETALLES
    this.productsObject.forEach(item => {
      CPrint(item);
      detailList = detailList+ "{"+item.id_product_third+","+(item.price-(item.price*item.disccount/100))+","+item.tax_product+","+item.quantity+"},"
    });



    if(data.paymentMethod == "efectivo"){
    }
    if(data.paymentMethod == "debito"){
    }
    if(data.paymentMethod == "credito"){
    }
    CPrint("this is id person: ",this.id_person);
    if(this.id_person){
      CPrint("ENTRE");
      //@ts-ignore
      this.billDTO.id_third_destiny = this.id_person;

      this.detailBillDTOList = [];
      this.commonStateDTO.state = 1;
      this.inventoryQuantityDTOList = [];
      this.documentDTO.title = 'Movimiento De Compra';

      this.documentDTO.body = data.observations||'';

      /**
       * building detailBill and Quantity
       */
      for (let code in this.productsObject) {
        let element = this.productsObject[code];

        this.inventoryQuantityDTO = new InventoryQuantityDTO(null, null, null, null,null);
        this.detailBillDTO = new DetailBillDTO(null, null, null, null, null, this.commonStateDTO,null);

        //building detailBill
        this.detailBillDTO.id_storage = element.id_storage;
        this.detailBillDTO.price = element.price;
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
      this.billDTO.id_store = this.locStorage.getIdStore();
      if (this.detailBillDTOList.length > 0) {

        this.billDTO.id_third_employee = this.token.id_third_father;
        this.billDTO.id_third = this.token.id_third;
        this.billDTO.id_bill_type = 2;
        //instanciar de acuerdo a por remision
        this.billDTO.id_bill_state = 1;
        this.billDTO.purchase_date = new Date();
        this.billDTO.subtotal = this.roundnum(this.calculateSubtotal());
        this.billDTO.tax = this.roundnum(this.calculateTax());
        this.billDTO.totalprice = this.roundnum(this.calculateTotal());
        this.billDTO.discount = 0;
        this.billDTO.documentDTO = this.documentDTO;
        this.billDTO.state = null;

        this.billDTO.details = this.detailBillDTOList;

        if(data.paymentMethod == "efectivo"){
          this.paymentDetail+='"id_payment_method": 1, ';
          this.paymentDetail+='"aprobation_code": "", ';
          this.paymentDetailFinal.id_payment_method =1;
          this.paymentDetailFinal.aprobation_code = "";
        }
        if(data.paymentMethod == "debito"){
          this.paymentDetail+='"id_payment_method": 2, ';
          this.paymentDetail+='"aprobation_code": "'+data.transactionCode+'", ';
          // this.paymentDetail+='"id_bank_entity": '+Number(data.creditBank)+', ';
          this.paymentDetailFinal.id_payment_method =2;
          this.paymentDetailFinal.aprobation_code = data.transactionCode;
        }
        if(data.paymentMethod == "credito"){
          this.paymentDetail+='"id_payment_method": 3, ';
          this.paymentDetail+='"aprobation_code": "'+data.transactionCode+'", ';
          // this.paymentDetail+='"id_bank_entity": '+Number(data.creditBank)+', ';
          this.paymentDetailFinal.id_payment_method =3;
          this.paymentDetailFinal.aprobation_code = data.transactionCode;
        }


        if(data.wayToPay == "contado"){
          this.paymentDetail+='"id_way_to_pay": 1, ';
          this.paymentDetailFinal.id_way_to_pay=1;

        }

        if(data.wayToPay == "credito"){
          this.paymentDetail+='"id_way_to_pay": 2, ';
          this.paymentDetailFinal.id_way_to_pay=2;
        }


        this.paymentDetailFinal.payment_value=this.roundnum(this.calculateTotal());
        this.paymentDetailFinal.state = new stateDTO(1);
        this.paymentDetail+='"payment_value": '+this.roundnum(this.calculateTotal())+', ';
        this.paymentDetail+='"state": {"state": 1}}]';

        CPrint(JSON.stringify(this.billDTO),"This is Bill DTO");


        CPrint("THIS IS BILL DTO V2: ", JSON.stringify({idthirdemployee:this.billDTO.id_third,
          idthird:this.billDTO.id_third_employee,
          idbilltype:this.billDTO.id_bill_type,
          notes:this.billDTO.documentDTO.body,
          idthirddestinity:this.billDTO.id_third_destiny,
          idcaja:this.locStorage.getIdCaja(),
          idstore:this.locStorage.getIdStore(),
          idthirddomiciliario:-1,
          idpaymentmethod:this.paymentDetailFinal.id_payment_method,
          idwaytopay:this.paymentDetailFinal.id_way_to_pay,
          approvalcode:this.paymentDetailFinal.aprobation_code,
          idbankentity:1,
          idbillstate:1,
          details: detailList.substring(0, detailList.length - 1),
          num_documento_factura: this.datos}));

        this.httpClient.post(Urlbase.facturacion+"/billing/v2",{idthirdemployee:this.billDTO.id_third,
          idthird:this.billDTO.id_third_employee,
          idbilltype:this.billDTO.id_bill_type,
          notes:this.billDTO.documentDTO.body,
          idthirddestinity:this.billDTO.id_third_destiny,
          idcaja:this.locStorage.getIdCaja(),
          idstore:this.locStorage.getIdStore(),
          idthirddomiciliario:-1,
          idpaymentmethod:this.paymentDetailFinal.id_payment_method,
          idwaytopay:this.paymentDetailFinal.id_way_to_pay,
          approvalcode:this.paymentDetailFinal.aprobation_code,
          idbankentity:1,
          idbillstate:1,
          details: detailList.substring(0, detailList.length - 1),
          num_documento_factura: this.datos,
          idthirdvendedor: -1}).subscribe(idBill => {
            if(idBill != 0){

          this.httpClient.post(Urlbase.facturacion+"/billing/validateBill?idbill="+idBill,{}).subscribe(() => {

            this.httpClient.put(Urlbase.facturacion+"/billing/billCompra?id_bill="+idBill+"&dato="+this.pedidosList.filter(ele => ele.id_BILL == this.SelectedPedido )[0].numdocumento +"&fecha="+this.transformDate(this.date3),this.options,{responseType: 'text'}).subscribe(
              () =>{
                this.httpClient.get(Urlbase.facturacion+"/billing/UniversalPDF?id_bill="+idBill+"&pdf=-1&cash=0&size="+false,{responseType: 'text'}).subscribe(response =>{
                  //-----------------------------------------------------------------------------------------------------------------
                  window.open(Urlbase.facturas+"/"+response, "_blank");
                  this.showNotification('top', 'center', 3, "<h3>Se ha realizado el movimento <b>CORRECTAMENTE</b></h3> ", 'info');
                  setTimeout(() => {
                    this.cancel();
                    this.elementRef.nativeElement.focus();
                    this.elementRef.nativeElement.select();

                  }, 100);
                  //-----------------------------------------------------------------------------------------------------------------

                })
              }
            );

          });

        }else{
          this.showNotification('top', 'center', 3, "<h3>Se presento un problema al generar la factura.</h3> ", 'danger');
        } })
      }
    }else{
      this.billDTO.id_store = this.locStorage.getIdStore();
      this.detailBillDTOList = [];
      this.commonStateDTO.state = 1;
      this.inventoryQuantityDTOList = [];


      this.documentDTO.title = 'Movimiento De Compra';
      this.documentDTO.body = data.observations||'';

      /**
       * building detailBill and Quantity
       */
      for (let code in this.productsObject) {
        let element = this.productsObject[code];

        this.inventoryQuantityDTO = new InventoryQuantityDTO(null, null, null, null,null);
        this.detailBillDTO = new DetailBillDTO(null, null, null, null, null, this.commonStateDTO,null);

        //building detailBill
        this.detailBillDTO.id_storage = element.id_storage;
        this.detailBillDTO.price = element.price;
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

        this.billDTO.id_third_employee = this.token.id_third_father;
        this.billDTO.id_third = this.token.id_third;
        this.billDTO.id_bill_type = 2;
        //instanciar de acuerdo a por remision
        this.billDTO.id_bill_state = 1;
        this.billDTO.purchase_date = new Date();
        this.billDTO.subtotal = Math.floor(this.calculateSubtotal()* 100) / 100;
        this.billDTO.tax = Math.floor(this.calculateTax()* 100) / 100;
        this.billDTO.totalprice = Math.floor(this.calculateTotal()* 100) / 100;
        this.billDTO.discount = 0;
        this.billDTO.documentDTO = this.documentDTO;
        this.billDTO.state = null;

        this.billDTO.details = this.detailBillDTOList;

        if(data.paymentMethod == "efectivo"){
          this.paymentDetail+='"id_payment_method": 1, ';
          this.paymentDetail+='"aprobation_code": "", ';
          this.paymentDetailFinal.id_payment_method = 1;
          this.paymentDetailFinal.aprobation_code = "";
        }
        if(data.paymentMethod == "debito"){
          this.paymentDetail+='"id_payment_method": 2, ';
          this.paymentDetail+='"aprobation_code": "'+data.transactionCode+'", ';
          // this.paymentDetail+='"id_bank_entity": '+Number(data.creditBank)+', ';
          this.paymentDetailFinal.id_payment_method = 2;
          this.paymentDetailFinal.aprobation_code = data.transactionCode
        }
        if(data.paymentMethod == "credito"){
          this.paymentDetail+='"id_payment_method": 3, ';
          this.paymentDetail+='"aprobation_code": "'+data.transactionCode+'", ';
          // this.paymentDetail+='"id_bank_entity": '+Number(data.creditBank)+', ';
          this.paymentDetailFinal.id_payment_method = 3;
          this.paymentDetailFinal.aprobation_code = data.transactionCode
        }


        if(data.wayToPay == "contado"){
          this.paymentDetail+='"id_way_to_pay": 1, ';
          this.paymentDetailFinal.id_way_to_pay = 1;
        }

        if(data.wayToPay == "credito"){
          this.paymentDetail+='"id_way_to_pay": 2, ';
          this.paymentDetailFinal.id_way_to_pay = 2;
        }


        this.paymentDetailFinal.payment_value = this.calculateTotal();
        this.paymentDetailFinal.state = new stateDTO(1);
        this.paymentDetail+='"payment_value": '+this.calculateTotal()+', ';
        this.paymentDetail+='"state": {"state": 1}}]';

        CPrint(JSON.stringify(this.billDTO),"This is Bill DTO");

        CPrint("THIS IS BILL DTO V2: ", JSON.stringify({idthirdemployee:this.billDTO.id_third,
          idthird:this.billDTO.id_third_employee,
          idbilltype:this.billDTO.id_bill_type,
          notes:this.billDTO.documentDTO.body,
          idthirddestinity:this.billDTO.id_third_destiny,
          idcaja:this.locStorage.getIdCaja(),
          idstore:this.locStorage.getIdStore(),
          idthirddomiciliario:-1,
          idpaymentmethod:this.paymentDetailFinal.id_payment_method,
          idwaytopay:this.paymentDetailFinal.id_way_to_pay,
          approvalcode:this.paymentDetailFinal.aprobation_code,
          idbankentity:1,
          idbillstate:1,
          details: detailList.substring(0, detailList.length - 1),
          num_documento_factura: this.datos}));

        this.httpClient.post(Urlbase.facturacion+"/billing/v2",{idthirdemployee:this.billDTO.id_third,
          idthird:this.billDTO.id_third_employee,
          idbilltype:this.billDTO.id_bill_type,
          notes:this.billDTO.documentDTO.body,
          idthirddestinity:this.billDTO.id_third_destiny,
          idcaja:this.locStorage.getIdCaja(),
          idstore:this.locStorage.getIdStore(),
          idthirddomiciliario:-1,
          idpaymentmethod:this.paymentDetailFinal.id_payment_method,
          idwaytopay:this.paymentDetailFinal.id_way_to_pay,
          approvalcode:this.paymentDetailFinal.aprobation_code,
          idbankentity:1,
          idbillstate:1,
          details: detailList.substring(0, detailList.length - 1),
          num_documento_factura: this.datos,
          idthirdvendedor: -1}).subscribe(idBill => {
            if(idBill!=0){
          this.httpClient.post(Urlbase.facturacion+"/billing/validateBill?idbill="+idBill,{}).subscribe(() => {

            this.httpClient.put(Urlbase.facturacion+"/billing/billCompra?id_bill="+idBill+"&dato="+this.pedidosList.filter(ele => ele.id_BILL == this.SelectedPedido )[0].numdocumento+"&fecha="+this.transformDate(this.date3),this.options,{responseType: 'text'}).subscribe(
              () =>{
                this.httpClient.get(Urlbase.facturacion+"/billing/UniversalPDF?id_bill="+idBill+"&pdf=-1&cash=0&size="+false,{responseType: 'text'}).subscribe(response =>{
                  //-----------------------------------------------------------------------------------------------------------------
                  window.open(Urlbase.facturas+"/"+response, "_blank");
                  this.showNotification('top', 'center', 3, "<h3>Se ha realizado el movimento <b>CORRECTAMENTE</b></h3> ", 'info');
                  setTimeout(() => {
                    this.cancel();
                    this.elementRef.nativeElement.focus();
                    this.elementRef.nativeElement.select();

                  }, 100);
                  //-----------------------------------------------------------------------------------------------------------------

                })
              }
            );

          });

        }else{
          this.showNotification('top', 'center', 3, "<h3>Se presento un problema al generar la factura.</h3> ", 'danger');
        }})
      }
    }
  }

  save2(data) {

    if(data.paymentMethod == "efectivo"){
    }
    if(data.paymentMethod == "debito"){
    }
    if(data.paymentMethod == "credito"){
    }
    CPrint("this is id person: ",this.id_person);
    if(this.id_person){
      CPrint("ENTRE");
      //@ts-ignore
      this.billDTO.id_third_destiny = this.id_person;

      this.detailBillDTOList = [];
      this.commonStateDTO.state = 1;
      this.inventoryQuantityDTOList = [];

      this.documentDTO.title = 'Movimiento De Compra';

      this.documentDTO.body = data.observations||'';

      /**
       * building detailBill and Quantity
       */
      for (let code in this.productsObject) {
        let element = this.productsObject[code];

        this.inventoryQuantityDTO = new InventoryQuantityDTO(null, null, null, null,null);
        this.detailBillDTO = new DetailBillDTO(null, null, null, null, null, this.commonStateDTO,null);

        //building detailBill
        this.detailBillDTO.id_storage = element.id_storage;
        this.detailBillDTO.price = element.price;
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
      this.billDTO.id_store = this.locStorage.getIdStore();
      if (this.detailBillDTOList.length > 0) {

        this.billDTO.id_third_employee = this.token.id_third_father;
        this.billDTO.id_third = this.token.id_third;
        this.billDTO.id_bill_type = 2;
        //instanciar de acuerdo a por remision
        this.billDTO.id_bill_state = 1;
        this.billDTO.purchase_date = new Date();
        this.billDTO.subtotal = this.roundnum(this.calculateSubtotal());
        this.billDTO.tax = this.roundnum(this.calculateTax());
        this.billDTO.totalprice = this.roundnum(this.calculateTotal());
        this.billDTO.discount = 0;
        this.billDTO.documentDTO = this.documentDTO;
        this.billDTO.state = null;

        this.billDTO.details = this.detailBillDTOList;

        if(data.paymentMethod == "efectivo"){
          this.paymentDetail+='"id_payment_method": 1, ';
          this.paymentDetail+='"aprobation_code": "", ';
          this.paymentDetailFinal.id_payment_method =1;
          this.paymentDetailFinal.aprobation_code = "";
        }
        if(data.paymentMethod == "debito"){
          this.paymentDetail+='"id_payment_method": 2, ';
          this.paymentDetail+='"aprobation_code": "'+data.transactionCode+'", ';
          // this.paymentDetail+='"id_bank_entity": '+Number(data.creditBank)+', ';
          this.paymentDetailFinal.id_payment_method =2;
          this.paymentDetailFinal.aprobation_code = data.transactionCode;
        }
        if(data.paymentMethod == "credito"){
          this.paymentDetail+='"id_payment_method": 3, ';
          this.paymentDetail+='"aprobation_code": "'+data.transactionCode+'", ';
          // this.paymentDetail+='"id_bank_entity": '+Number(data.creditBank)+', ';
          this.paymentDetailFinal.id_payment_method =3;
          this.paymentDetailFinal.aprobation_code = data.transactionCode;
        }


        if(data.wayToPay == "contado"){
          this.paymentDetail+='"id_way_to_pay": 1, ';
          this.paymentDetailFinal.id_way_to_pay=1;

        }

        if(data.wayToPay == "credito"){
          this.paymentDetail+='"id_way_to_pay": 2, ';
          this.paymentDetailFinal.id_way_to_pay=2;
        }


        this.paymentDetailFinal.payment_value=this.roundnum(this.calculateTotal());
        this.paymentDetailFinal.state = new stateDTO(1);
        this.paymentDetail+='"payment_value": '+this.roundnum(this.calculateTotal())+', ';
        this.paymentDetail+='"state": {"state": 1}}]';

        CPrint(JSON.stringify(this.billDTO),"This is Bill DTO");
        this.billingService.postBillResource(this.billDTO, 2)
          .subscribe(
            result => {
              if (result) {
                //Debido a que acá se borran las variables, tengo la referencia localmente
                let FechaCompra = this.date3;
                let FacturaCompra = this.pedidosList.filter(ele => ele.id_BILL == this.SelectedPedido )[0].numdocumento;
                FechaCompra = this.transformDate(FechaCompra);
                this.beginPlusOrDiscount(this.inventoryQuantityDTOList,2);

                try{

                  this.billingService.postPaymentDetail([this.paymentDetailFinal],Number(result)).subscribe(() =>{
                    this.httpClient.post(Urlbase.facturacion+"/billing/procedureup2?idbill="+result,{}).subscribe(() => {

                      this.httpClient.put(Urlbase.facturacion+"/billing/billCompra?id_bill="+result+"&dato="+FacturaCompra+"&fecha="+this.transformDate(FechaCompra),this.options,{responseType: 'text'}).subscribe(
                        () =>{
                          this.httpClient.get(Urlbase.facturacion+"/billing/UniversalPDF?id_bill="+result+"&pdf=-1&cash=0&size="+false,{responseType: 'text'}).subscribe(response =>{
                            //-----------------------------------------------------------------------------------------------------------------
                            window.open(Urlbase.facturas+"/"+response, "_blank");
                            this.showNotification('top', 'center', 3, "<h3>Se ha realizado el movimento <b>CORRECTAMENTE</b></h3> ", 'info');
                            setTimeout(() => {

                              this.elementRef.nativeElement.focus();
                              this.elementRef.nativeElement.select();

                            }, 100);
                            //-----------------------------------------------------------------------------------------------------------------

                          })
                        }
                      );
                      CPrint("FechaCompra es");
                      CPrint(FechaCompra);
                      CPrint("FacturaCompra es");
                      CPrint(FacturaCompra);

                      this.paymentDetail = '[{';
                      const currentSells = localStorage.getItem('sells');
                      let mySells: string;
                      const total = this.calculateTotal();
                      if(currentSells !== 'null'){
                        mySells = currentSells + ',' + String(total)
                      }else{
                        mySells = String(total)
                      }
                      localStorage.setItem("sells",mySells);
                      CPrint(localStorage.getItem("sells"))
                    });
                  });

                }catch{
                  CPrint("[EL DEBUG]This is datos: ",this.datos);
                  CPrint("[EL DEBUG]This is fecha: ",this.date3);
                  this.showNotification('top', 'center', 3, "<h3>El movimento presento <b>PROBLEMAS</b></h3> ", 'info')
                }


              }

              this.paymentDetailFinal = new paymentDetailDTO(1,1,this.calculateTotal()," ", new stateDTO(1));
              this.paymentDetail = '[{';
            });
      }
    }else{
      this.billDTO.id_store = this.locStorage.getIdStore();
      this.detailBillDTOList = [];
      this.commonStateDTO.state = 1;
      this.inventoryQuantityDTOList = [];


      this.documentDTO.title = 'Movimiento De Compra';
      this.documentDTO.body = data.observations||'';

      /**
       * building detailBill and Quantity
       */
      for (let code in this.productsObject) {
        let element = this.productsObject[code];

        this.inventoryQuantityDTO = new InventoryQuantityDTO(null, null, null, null,null);
        this.detailBillDTO = new DetailBillDTO(null, null, null, null, null, this.commonStateDTO,null);

        //building detailBill
        this.detailBillDTO.id_storage = element.id_storage;
        this.detailBillDTO.price = element.price;
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

        this.billDTO.id_third_employee = this.token.id_third_father;
        this.billDTO.id_third = this.token.id_third;
        this.billDTO.id_bill_type = 2;
        //instanciar de acuerdo a por remision
        this.billDTO.id_bill_state = 1;
        this.billDTO.purchase_date = new Date();
        this.billDTO.subtotal = Math.floor(this.calculateSubtotal()* 100) / 100;
        this.billDTO.tax = Math.floor(this.calculateTax()* 100) / 100;
        this.billDTO.totalprice = Math.floor(this.calculateTotal()* 100) / 100;
        this.billDTO.discount = 0;
        this.billDTO.documentDTO = this.documentDTO;
        this.billDTO.state = null;

        this.billDTO.details = this.detailBillDTOList;

        if(data.paymentMethod == "efectivo"){
          this.paymentDetail+='"id_payment_method": 1, ';
          this.paymentDetail+='"aprobation_code": "", ';
          this.paymentDetailFinal.id_payment_method = 1;
          this.paymentDetailFinal.aprobation_code = "";
        }
        if(data.paymentMethod == "debito"){
          this.paymentDetail+='"id_payment_method": 2, ';
          this.paymentDetail+='"aprobation_code": "'+data.transactionCode+'", ';
          // this.paymentDetail+='"id_bank_entity": '+Number(data.creditBank)+', ';
          this.paymentDetailFinal.id_payment_method = 2;
          this.paymentDetailFinal.aprobation_code = data.transactionCode
        }
        if(data.paymentMethod == "credito"){
          this.paymentDetail+='"id_payment_method": 3, ';
          this.paymentDetail+='"aprobation_code": "'+data.transactionCode+'", ';
          // this.paymentDetail+='"id_bank_entity": '+Number(data.creditBank)+', ';
          this.paymentDetailFinal.id_payment_method = 3;
          this.paymentDetailFinal.aprobation_code = data.transactionCode
        }


        if(data.wayToPay == "contado"){
          this.paymentDetail+='"id_way_to_pay": 1, ';
          this.paymentDetailFinal.id_way_to_pay = 1;
        }

        if(data.wayToPay == "credito"){
          this.paymentDetail+='"id_way_to_pay": 2, ';
          this.paymentDetailFinal.id_way_to_pay = 2;
        }


        this.paymentDetailFinal.payment_value = this.calculateTotal();
        this.paymentDetailFinal.state = new stateDTO(1);
        this.paymentDetail+='"payment_value": '+this.calculateTotal()+', ';
        this.paymentDetail+='"state": {"state": 1}}]';

        CPrint(JSON.stringify(this.billDTO),"This is Bill DTO");
        this.billingService.postBillResource(this.billDTO, 2)
          .subscribe(
            result => {
              if (result) {
                CPrint("this is bull DTO",JSON.stringify(this.billDTO));
                // alert(this.ID_INVENTORY_TEMP)
                //Debido a que acá se borran las variables, tengo la referencia localmente
                let FechaCompra = this.date3;

                this.transformDate(FechaCompra);
                this.beginPlusOrDiscount(this.inventoryQuantityDTOList,2);

                try{
                  this.httpClient.put(Urlbase.facturacion+"/billing/billCompra?id_bill="+result+"&dato="+this.pedidosList.filter(ele => ele.id_BILL == this.SelectedPedido )[0].numdocumento+"&fecha="+this.transformDate(this.date3),this.options,{responseType: 'text'}).subscribe(
                    () =>{

                    }
                  );
                  CPrint("THIS IS THE PAYMENT DETAIL ILL TRY TO EMULATE, ", JSON.parse(this.paymentDetail));
                  CPrint("THIS IS THE PAYMENT DETAIL ILL TRY TO EMULATE 2, ", this.paymentDetailFinal);
                  this.billingService.postPaymentDetail([this.paymentDetailFinal],Number(result)).subscribe(() =>{
                    this.httpClient.post(Urlbase.facturacion+"/billing/procedureup2?idbill="+result,{}).subscribe(() => {

                      this.paymentDetailFinal = new paymentDetailDTO(1,1,this.calculateTotal()," ",new stateDTO(1));
                      this.httpClient.get(Urlbase.facturacion+"/billing/UniversalPDF?id_bill="+result+"&pdf=-1&cash=0&size="+false,{responseType: 'text'}).subscribe(response => {
                        CPrint(response);
                        window.open(Urlbase.facturas+"/"+response, "_blank");
                        this.showNotification('top', 'center', 3, "<h3>Se ha realizado el movimento <b>CORRECTAMENTE</b></h3> ", 'info');
                        setTimeout(() => {

                          this.elementRef.nativeElement.focus();
                          this.elementRef.nativeElement.select();

                        }, 100);
                      });
                      this.paymentDetail = '[{';
                      const currentSells = localStorage.getItem('sells');
                      let mySells: string;
                      const total = this.calculateTotal();
                      if(currentSells !== 'null'){
                        mySells = currentSells + ',' + String(total)
                      }else{
                        mySells = String(total)
                      }
                      localStorage.setItem("sells",mySells);
                      CPrint(localStorage.getItem("sells"))
                    });

                  });
                }catch{
                  this.showNotification('top', 'center', 3, "<h3>El movimento presento <b>PROBLEMAS</b></h3> ", 'info')
                }

                this.paymentDetail = '[{';
                this.paymentDetailFinal = new paymentDetailDTO(1,1,this.calculateTotal()," ", new stateDTO(1));
              }
            });
      }
    }

  }

  async listLoad(){
    this.listaElem = [];
    this.EstadoBusquedaProducto = 1;
    await new Promise(resolve => {
      this.getElemsIfOwn().then(() => {
        CPrint("1");
        this.getElemsIfcode().then(() => {
          CPrint("2");
          //inserto elementos si name
          this.inventoryList.forEach(element => {
            if(element.product_STORE_NAME.toLowerCase( ).includes(this.inputForCode.toLowerCase())){
              this.listaElem.push(element);
            }
          });
          this.EstadoBusquedaProducto = 2;
          //resolve();
        })
      })
    });
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

  id_menu = 144;
  pedidosList=[];
  SelectedPedido="-1";
  reload(){
    CPrint("RELOAD");
    this.ngOnInit();
  }

  mostrandoCargando = false;
  async DelayedgetInventoryList(){
    this.mostrandoCargando = true;
    //Esto es debido a un delay en localstorage, entonces espero hasta que se inicialice para continuar
    while(1==1){
      await new Promise(resolve => setTimeout(resolve, 100));
      if(this.locStorage.getIdStore() != 1){break;}
    }
    if(this.locStorage.getBoxStatus()){
      await this.getInventoryList(this.locStorage.getIdStore())
    };
    this.mostrandoCargando = false;
  }

  ngOnInit() {
    this.mainclassref = this.mainclassref_input;
    CPrint("ON VENTA");
      if (this.billingService.subsVar==undefined) {
        this.billingService.subsVar = this.billingService.
        invokeFirstComponentFunction.subscribe((name:string) => {
          CPrint("ON VENTA name es "+name);
          this.reload();
        });
      }


      if(!this.locStorage.getBoxStatus()){

        const idPerson = this.locStorage.getPerson().id_person;

        localStorage.setItem("id_employee",String(this.locStorage.getToken().id_third));
        let rolesCajeros = this.locStorage.getRol().filter(element => this.locStorage.getListRolesCajeros().includes(element.id_rol) )
        let itemMenu = this.locStorage.getMenu().sort(this.dynamicSort("id_menu")).filter(item => item.id_menu == 143 || (rolesCajeros.length>0) )
        if( itemMenu.length>0 ){
        this.http.get(Urlbase.cierreCaja + "/close/openBoxes/v2?id_third=" + this.locStorage.getToken().id_third).subscribe(answering=>{
              if(localStorage.getItem("SesionExpirada") == "true"){
                return;
              }
              this.myBox = answering;
              localStorage.setItem("myBox",answering.toString());
              this.currentBox = localStorage.getItem("currentBox");
              CPrint("this is res",answering);

              //@ts-ignore
              if(answering.length > 0 && this.locStorage.getDoINav()==false){
                // if(res.length === 1 ){
                //   this.unicaCaja = true;
                // }else{
                //   this.unicaCaja = false;
                // }
                let dialogRef = this.dialog.open(Openorclosebox2Component, {
                  width: '60vw',
                  data: {answering},
                  disableClose: true
                }).afterClosed().subscribe(response=> {
                  CPrint(response);
                  if(response.resp){
                    this.locStorage.setBoxStatus(true);
                    this.locStorage.setIdCaja(Number(answering[0].id_CAJA));
                    this.locStorage.setCajaOld(Number(answering[0].id_CAJA));

                    this.http.get(Urlbase.cierreCaja+"/close/myboxes?id_person="+this.locStorage.getPerson().id_person).subscribe(resp => {
                      CPrint(resp);
                      //@ts-ignore
                      resp.forEach(element => {
                        if(element.id_CAJA==Number(answering[0].id_CAJA)){
                          CPrint("ENTRE");
                          this.locStorage.setIdStore(element.id_STORE);
                          this.getStoreType(element.id_STORE);
                        }
                      });
                      this.SelectedStore=this.locStorage.getIdStore();
                      this.service.onMainEvent.emit(Number(answering[0].id_CAJA));
                      this.getStores2();
                      this.ngOnInit();
                    });
                    CPrint("IM ON THE TRUE SIDE OF THINGS")
                  }else{
                    if(!response.open){

                      this.locStorage.setIdCaja(response.idcaja);
                      this.locStorage.setCajaOld(response.idcaja);
                      this.getStores3();
                      this.http.get(Urlbase.cierreCaja+"/close/myboxes?id_person="+this.locStorage.getPerson().id_person).subscribe(resp => {
                        //@ts-ignore
                        resp.forEach(element => {
                          if(element.id_CAJA==this.locStorage.getIdCaja()){
                            this.locStorage.setIdStore(element.id_STORE);
                            this.getStoreType(element.id_STORE);
                            this.getStores2();
                          }
                        });
                      })

                    }else{
                    this.locStorage.setIdCaja(Number(answering[0].id_CAJA));
                    this.locStorage.setCajaOld(Number(answering[0].id_CAJA));
                    CPrint("IM ON THE FALSE SIDE OF THINGS");
                    let dialogRef;
                    dialogRef = this.dialog.open(CloseBoxComponent, {
                      width: '60vw',
                      data: {flag:false},
                      disableClose: true
                    }).afterClosed().subscribe(response=> {
                      dialogRef = this.dialog.open(SelectboxComponent, {
                        width: '60vw',
                        data: {},
                        disableClose: true
                      }).afterClosed().subscribe(response2=> {
                        if(response2.logout){
                          // noinspection JSIgnoredPromiseFromCall
                          this.logout();
                        }else{
                          this.locStorage.setIdCaja(response2.idcaja);
                          this.locStorage.setCajaOld(response2.idcaja);
                          this.http.get(Urlbase.cierreCaja+"/close/myboxes?id_person="+this.locStorage.getPerson().id_person).subscribe(resp => {
                            //@ts-ignore
                            resp.forEach(element => {
                              if(element.id_CAJA==this.locStorage.getIdCaja()){
                                this.locStorage.setIdStore(element.id_STORE);
                                this.getStoreType(element.id_STORE);
                              }
                            });
                          });
                          dialogRef = this.dialog.open(OpenBoxComponent, {
                            width: '60vw',
                            data: {},
                            disableClose: true
                          }).afterClosed().subscribe(response=> {
                            this.http.post(Urlbase.facturacion+"/pedidos/abrirCajaPlanilla?IDCIERRECAJA="+this.locStorage.getIdCaja(),{}).subscribe(e=> {
                              this.locStorage.setBoxStatus(true);
                              this.SelectedStore=this.locStorage.getIdStore();
                              this.getStores2();
                              this.DelayedgetInventoryList();
                              CPrint("ID CAJA: ",this.locStorage.getIdCaja());
                              CPrint("ID STORE: ",this.locStorage.getIdStore());
                              CPrint("STORE TYPE: ",this.locStorage.getTipo());
                              CPrint("BOX TYPE: ",this.locStorage.getBoxStatus());
                              CPrint("OR ITS ME?");
                            });
                          });
                        }
                      });

                    });
                  }}
                });

              }else{
                if( this.locStorage.getDoINav()==false){

                  CPrint("IM ON THE NO OPEN BOX SIDE OF THINGS");
                  let dialogRef = this.dialog.open(SelectboxComponent, {
                    width: '60vw',
                    data: {},
                    disableClose: true
                  }).afterClosed().subscribe(response2=> {
                    if(response2.logout){
                      // noinspection JSIgnoredPromiseFromCall
                      this.logout();
                    }else if(response2.open){
                      this.locStorage.setIdCaja(response2.idcaja);
                      this.locStorage.setCajaOld(response2.idcaja);
                      CPrint("-------------------------------------------------");
                      CPrint("THIS IS 1-quickconfirm: ", this.quickconfirm);
                      CPrint("THIS IS 2-isfull: ", this.isfull());
                      CPrint("THIS IS 3-getBoxStatus: ", !this.locStorage.getBoxStatus());
                      CPrint("-------------------------------------------------");
                      this.locStorage.setBoxStatus(false);
                      this.http.get(Urlbase.cierreCaja+"/close/myboxes?id_person="+this.locStorage.getPerson().id_person).subscribe(asd => {
                        //@ts-ignore
                        asd.forEach(element => {
                          if(element.id_CAJA==this.locStorage.getIdCaja()){
                            this.locStorage.setIdStore(element.id_STORE);
                            this.getStoreType(element.id_STORE);
                          }
                        });
                      });
                      dialogRef = this.dialog.open(OpenBoxComponent, {
                        width: '60vw',
                        data: {},
                        disableClose: true
                      }).afterClosed().subscribe(response=> {
                        this.http.post(Urlbase.facturacion+"/pedidos/abrirCajaPlanilla?IDCIERRECAJA="+this.locStorage.getIdCaja(),{}).subscribe(e=> {
                          this.service.onMainEvent.emit(this.locStorage.getIdStore());
                          this.locStorage.setBoxStatus(true);
                          CPrint("ID CAJA: ",this.locStorage.getIdCaja());
                          CPrint("ID STORE: ",this.locStorage.getIdStore());
                          CPrint("STORE TYPE: ",this.locStorage.getTipo());
                          CPrint("BOX TYPE: ",this.locStorage.getBoxStatus());
                          CPrint("OR AM I?");

                          this.SelectedStore=this.locStorage.getIdStore();
                          this.getStores2();
                          this.DelayedgetInventoryList();
                        });
                      });
                    }else{
                      this.locStorage.setIdCaja(response2.idcaja);
                      this.locStorage.setCajaOld(response2.idcaja);
                      this.getStores3();
                      this.http.get(Urlbase.cierreCaja+"/close/myboxes?id_person="+this.locStorage.getPerson().id_person).subscribe(resp => {
                        //@ts-ignore
                        resp.forEach(element => {
                          if(element.id_CAJA==this.locStorage.getIdCaja()){
                            this.locStorage.setIdStore(element.id_STORE);
                            this.getStoreType(element.id_STORE);
                            this.getStores2();
                          }
                        });
                      })
                    }
                  });

                }
              }
            })}
      }else{this.getStoreType(this.locStorage.getIdStore());}
    //PROTECCION URL TERMINA
    setTimeout(() => {

      this.elementRef2.nativeElement.focus();
      this.elementRef2.nativeElement.select();

    }, 100);
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

    });
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
    localStorage.getItem('currentUser');
    this.options = { headers: this.headers };
    this.getStorages();
  }

  isfull(){
    return this.inventoryList.length == 0;
  }

  getStores3() {
    this.billingService.getStoresByThird(this.locStorage.getToken().id_third).subscribe(data => {
      CPrint(data);
      this.Stores = data;
      this.SelectedStore = data[0].id_STORE;
      this.locStorage.setIdStore(data[0].id_STORE)
    })
  }

  dynamicSort(property) {
    let sortOrder = 1;
    if(property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
    }
    return function (a,b) {
      /* next line works with strings and numbers,
        * and you may want to customize it to your needs
      */
      const result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
    }
  }

  goIndex() {
    let link = ['/'];
    // noinspection JSIgnoredPromiseFromCall
    this.router.navigate(link);
  }

  async logout() {
    if(!this.locStorage.isSession()){
      this.token=null;
      localStorage.setItem("Logo","-1");
      this.goIndex();
      return;
    }
    let promesa = await this.authService.logout();
    if(promesa[0] == 1){
      this.token=null;
      localStorage.setItem("Logo","-1");
      this.goIndex();

      this.showNotification('top','right');
    }else{
      CPrint("promesa");
      CPrint(promesa);

      this.showNotification('top','right',promesa[1]);
    }
  }
  Stores;
  SelectedStore;
  getStores2() {
    this.billingService.getStoresByThird(this.locStorage.getToken().id_third).subscribe(data => {
      CPrint("DATO: ", this.Stores);
      this.Stores = data;
      this.SelectedStore = this.locStorage.getIdStore();
      this.service.onMainEvent.emit(this.locStorage.getIdStore());
    }      )
  }

  getStoreType(id_store){
    this.httpClient.get(Urlbase.tienda+"/store/tipoStore?id_store="+id_store).subscribe( response => {
      this.locStorage.setTipo(response);
      CPrint("ID CAJA: ",this.locStorage.getIdCaja());
      CPrint("ID STORE: ",this.locStorage.getIdStore());
      CPrint("STORE TYPE: ",this.locStorage.getTipo());
      CPrint("BOX TYPE: ",this.locStorage.getBoxStatus());
      CPrint("AM I?");
    })
  }

  loadDetails(){
    this.productsObject = []
    this.http.get(Urlbase.facturacion + "/billing/detail?id_bill="+this.SelectedPedido).subscribe(r => {
      //@ts-ignore
      r.forEach(element => {;
          this.addDetail3(element[3],Number(element[0]));
      });
    })
  }


  addDetail3(code,quantity) {
    let key: any = null;
    this.productsObject.forEach(item => {
      if(item.code == code || item.ownbarcode == code || String(item.product_store_code) == code ){
        key = item;
      }
    });
    if (key != null) {
      this.productsObject[this.productsObject.indexOf(key)].quantity = quantity;
    } else {
      const product = this.inventoryList.find(item => (item.code == code || item.ownbarcode == code || String(item.product_STORE_CODE) == code));
      //@ts-ignore
      if(product){
        this.getPriceList2(product,code,product.id_PRODUCT_STORE,quantity);
        setTimeout(() => {

          this.elementRef2.nativeElement.focus();
          this.elementRef2.nativeElement.select();

        }, 100);
      }else{
        this.showNotification('top', 'center', 3, "<h3>Ese codigo no esta asociado a un producto.</h3> ", 'danger')
      }
    }
  }
  disableDoubleClickSearch = false;

  addDetail2(code) {
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

  addDetail5(code,storecode) {
    let validate = true;
    console.log("Go im in: ", code, " - ",storecode);
    if(this.disableDoubleClickSearch){
      return;
    }
    this.disableDoubleClickSearch = true;

    // CPrint(code,"da code :3")

    const product = this.inventoryList.find(item => this.findCode(code, item));


      if(validate){

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
          // CPrint("//-----------------------------------");Ss
          if(item.ownbarcode == code && String(item.product_store_code) == storecode ){
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
          this.disableDoubleClickSearch = false;

        } else {

          const product = this.inventoryList.find(item => item.ownbarcode == code && item.product_STORE_CODE == storecode);
          // var product = this.inventoryList.find(item => (item.code == code || item.ownbarcode == code || String(item.product_STORE_CODE) == code));
          //@ts-ignore
          if(product){
            this.getPriceList(product,code,product.id_PRODUCT_STORE);
            setTimeout(() => {
              this.elementRef.nativeElement.focus();
              this.elementRef.nativeElement.select();

            }, 100);
          }else{
            if(localStorage.getItem("SesionExpirada") != "true"){ alert('Ese codigo no esta asociado a un producto.');}
            this.disableDoubleClickSearch = false;
          }
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

    modal.afterClosed().subscribe(() => {
      CPrint("ESTE ES EL CODIGO DE BARRAS QUE QUIERO EJECUTAR: ",this.locStorage.getCodigoBarras());
      if(this.locStorage.getCodigoBarras() != "-1"){
        this.addDetail2(this.locStorage.getCodigoBarras());
        this.locStorage.setCodigoBarras("-1");
        setTimeout(() => {

          this.elementRef.nativeElement.focus();
          this.elementRef.nativeElement.select();

        }, 100);
      }
    });
  }

  getStorages() {
    this.httpClient.get(Urlbase.tienda+"/store/s?id_store="+this.id_store).subscribe((res)=>{
      this.storageList = res;
    });

  }

  getBillData(event){
    this.httpClient.get(Urlbase.facturacion+"/billing-state/billData?consecutive="+event.target.value).subscribe((res)=>{
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
      params = params.append('state', state+"");
      this.httpClient.put(Urlbase.facturacion+"/billing-state/billState/"+this.IdBillDevolucion,null,{params: params}).subscribe(()=>{
        const notas = this.NotasDevolucion + ' / Factura Anulada Por Motivo de Devolucion';
        let params2 = new HttpParams();
        params2 = params2.append('body', notas);
        this.httpClient.put(Urlbase.facturacion+"/billing-state/documentBody/"+this.IdDocumentDevolucion,null,{params: params2}).subscribe(()=>{
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


    this.dialog.open(CloseBoxComponent, {
      width: '60vw',
      data: {}
    });

  }

  openCategories(){


    this.dialog.open(CategoriesComponent, {
      width: '60vw',
      data: {}
    });

  }

  openInventories(){


    this.dialog.open(InventoryComponent, {
      width: '60vw',
      data: {}
    });

  }

  openStores(){


    this.dialog.open(StoresComponent, {
      width: '60vw',
      data: {}
    });

  }

  openUpdateLegalData(){

    this.dialog.open(UpdateLegalDataComponent, {
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
  }

  setCategoryID(id,name){
    this.categoryID = id;
    this.categoryIDboolean = true;
    this.CategoryName = name;
  }

  putStandardPrice(element){
    let key = element.code;
    try{
      this.httpClient.put(Urlbase.tienda+"/store/standardprice?standard_price="+element.price+"&id_ps="+element.productStoreId,null).subscribe(() => {
        CPrint("THIS IS THING", this.inventoryList.find(item => (item.code == key || item.ownbarcode == key || String(item.product_STORE_CODE) == key)));
        let index = this.inventoryList.indexOf(this.inventoryList.find(item => (item.code == key || item.ownbarcode == key || String(item.product_STORE_CODE) == key)));
        this.inventoryList[index].standard_PRICE = element.price;
        this.showNotification('top','center',3,"<h3 class = 'text-center'>Se actualizo el precio de compra Exitosamente<h3>",'info');
      })
    }catch(Exception){
      this.showNotification('top','center',3,"<h3 class = 'text-center'>No se pudo actualizar el precio de compra.<h3>",'Danger');
    }
  }


  getNewTax(element){

    let key: any = null;

    this.productsObject.forEach(item => {
      if(item.code == element.code || item.ownbarcode == element.code || String(item.product_store_code) == element.code ){
        key = item;
      }
    });

    this.productsObject[this.productsObject.indexOf(key)].tax = this.getPercentTax(this.productsObject[this.productsObject.indexOf(key)].tax_product)


  }

  getPriceList(product,code,id){
    CPrint("id is: ",id);
    this.httpClient.get(Urlbase.tienda+"/store/pricelist?id_product_store="+id).subscribe(response => {
      CPrint("This is picked price list: ",response);
      const datos = response;
      CPrint("this is datos: ",datos);
      console.log("QUANTITIES");
      console.log(product.quantity)
      if (product) {
        let new_product = {
          quantity: 1,
          price: product.standard_PRICE,
          tax: this.getPercentTax(product.id_TAX),
          id_product_third: product.id_PRODUCT_STORE,
          tax_product: String(product.id_TAX),
          state: this.commonStateDTO,
          description: product.product_STORE_NAME,
          code: product.code,
          id_inventory_detail: product.id_INVENTORY_DETAIL,
          ownbarcode: product.ownbarcode,
          product_store_code: String(product.product_STORE_CODE),
          pricelist: response,
          standarPrice: product.standard_PRICE,
          productStoreId: id,
          invQuantity: product.quantity
        };
        new_product.price = response[0].price;

        //this.detailBillDTOList.push(new_product);

        let key: any = null;

        this.productsObject.forEach(item => {
          if(item.code == code || item.ownbarcode == code || String(item.product_store_code) == code ){
            key = item;
          }
        });
        if (key != null) {
          this.productsObject[this.productsObject.indexOf(key)].quantity += 1;
        } else {
          this.productsObject.unshift(new_product);
          this.dataSourceProductosSeleccionados = new MatTableDataSourceWithCustomSort(this.productsObject);
          this.dataSourceProductosSeleccionados.sort = this.sort;
        }
        // event.target.blur();
        // event.target.value = '';
        // setTimeout(() => {
        //   document.getElementById('lastDetailQuantity');
        // });
      } else {
        let codeList;
        this.httpClient.get(Urlbase.tienda+"/products2/code/general?code="+String(code)).subscribe(data => {
          codeList = data;
          CPrint("this is codeList: ", codeList);
          //@ts-ignore
          if( data.length == 0 ){
            this.showNotification('top', 'center', 3, "<h3>El producto no existe.</h3> ", 'danger')
          }else{
            let dialogRef;
            dialogRef = this.dialog.open(NewProductStoreComponent, {
              width: '30vw',
              data: {codeList: codeList[0]}
            });
            dialogRef.afterClosed().subscribe(()=>{
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
            // this.http.post(Urlbase.tienda+"/store/ps",body,this.options).subscribe(data=>
            // {
            //   CPrint("Post hecho");});
          }
        });

      }

    });
  }




  getPriceList2(product,code,id,quantity){
    CPrint("id is: ",id);
    this.httpClient.get(Urlbase.tienda+"/store/pricelist?id_product_store="+id).subscribe(response => {
      CPrint("This is picked price list: ",response);
      const datos = response;
      CPrint("this is datos: ",datos);
      console.log("QUANTITIES");
      console.log(quantity)
      console.log(product.quantity)
      if (product) {
        let new_product = {
          quantity: 1,
          price: product.standard_PRICE,
          tax: this.getPercentTax(product.id_TAX),
          id_product_third: product.id_PRODUCT_STORE,
          tax_product: String(product.id_TAX),
          state: this.commonStateDTO,
          description: product.product_STORE_NAME,
          code: product.code,
          id_inventory_detail: product.id_INVENTORY_DETAIL,
          ownbarcode: product.ownbarcode,
          product_store_code: String(product.product_STORE_CODE),
          pricelist: response,
          standarPrice: product.standard_PRICE,
          productStoreId: id,
          invQuantity: product.quantity
        };
        new_product.price = response[0].price;

        //this.detailBillDTOList.push(new_product);

        let key: any = null;

        this.productsObject.forEach(item => {
          if(item.code == code || item.ownbarcode == code || String(item.product_store_code) == code ){
            key = item;
          }
        });
        if (key != null) {
          this.productsObject[this.productsObject.indexOf(key)].quantity = quantity;
        } else {
          this.productsObject.unshift(new_product);
          this.dataSourceProductosSeleccionados = new MatTableDataSourceWithCustomSort(this.productsObject);
          this.dataSourceProductosSeleccionados.sort = this.sort;
        }
        // event.target.blur();
        // event.target.value = '';
        // setTimeout(() => {
        //   document.getElementById('lastDetailQuantity');
        // });
      } else {
        let codeList;
        this.httpClient.get(Urlbase.tienda+"/products2/code/general?code="+String(code)).subscribe(data => {
          codeList = data;
          CPrint("this is codeList: ", codeList);
          //@ts-ignore
          if( data.length == 0 ){
            this.showNotification('top', 'center', 3, "<h3>El producto no existe.</h3> ", 'danger')
          }else{
            let dialogRef;
            dialogRef = this.dialog.open(NewProductStoreComponent, {
              width: '30vw',
              data: {codeList: codeList[0]}
            });
            dialogRef.afterClosed().subscribe(()=>{
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
            // this.http.post(Urlbase.tienda+"/store/ps",body,this.options).subscribe(data=>
            // {
            //   CPrint("Post hecho");});
          }
        });

      }

    });
  }

  addDetail(event) {
    console.log(this.elementRef.nativeElement.disabled);
    if(this.disableDoubleClickSearch){
      return;
    }
    this.disableDoubleClickSearch = true;
    const code = String(event.target.value);
    // CPrint(code,"da code :3")

    // var codeFilter = this.productsObject.filter(item => (String(item.code) === code || String(item.ownbarcode) === code || String(item.product_store_code) === code ));

    const product = this.inventoryList.find(item => this.findCode(code, item));
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
        }else{
          if(localStorage.getItem("SesionExpirada") != "true"){ alert('Ese codigo no esta asociado a un producto.');}
          this.disableDoubleClickSearch = false;
        }
      }


  }

  addDetailTY(event) {
    CPrint("THIS IS DATA: ",event);
    const code = event;
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
    } else {
      const product = this.inventoryList.find(item => (item.code == code || item.ownbarcode == code || String(item.product_STORE_CODE) == code));
      CPrint("this is price product: ", this.priceList);
      //@ts-ignore
      if(product){
        this.getPriceList(product,code,product.id_PRODUCT_STORE);
        setTimeout(() => {

          this.elementRef2.nativeElement.focus();
          this.elementRef2.nativeElement.select();

        }, 100);
      }else{
        this.getPriceList(product,code,-1);
        setTimeout(() => {

          this.elementRef2.nativeElement.focus();
          this.elementRef2.nativeElement.select();

        }, 100);
      }
    }
  }


  calculateTotalPrice(element){
    return (element.price+(element.tax*element.price)) * Math.floor(element.quantity)
  }

  calculateSubtotal() {
    let subtotal = 0;
    const attr = this.flagVenta ? 'price' : 'purchaseValue';
    for (let code in this.productsObject) {
      subtotal += this.productsObject[code][attr] * Math.floor(this.productsObject[code]['quantity']);
    }
    return subtotal;
  }

  calculateTax() {
    let tax = 0;
    // if (!this.form.value['isRemission']) {
    for (let code in this.productsObject) {
      if(this.flagVenta){
        tax += this.productsObject[code]['price'] * Math.floor(this.productsObject[code]['quantity']) * this.productsObject[code]['tax'];
      }else{
        tax += this.productsObject[code]['price'] * Math.floor(this.productsObject[code]['quantity']) * this.productsObject[code]['tax'];
      }
    }
    // }
    return tax;
  }

  calculateTotal() {
    return this.calculateSubtotal() + this.calculateTax();
  }


  editPurchaseValue(event: any) {
    // noinspection JSDeprecatedSymbols
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
    setTimeout(() => {

      this.elementRef2.nativeElement.focus();
      this.elementRef2.nativeElement.select();

    }, 100);
    this.id_person=3088;
    this.pedidosList=[];
    this.SelectedPedido="-1";
    this.obs="";
    this.inputForCode="";
    this.ccClient="";
    this.EstadoBusquedaProducto = -1;
    this.datos="";
    this.date3="";
    this.listaElem = [];
    this.cliente="Cliente Ocasional";
    this.form.reset();
    this.clientData = new ClientData(true, 'Cliente Ocasional', '--', '000', 'N/A', '000', 'N/A', null);
    this.productsObject = [];
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

  // openDialogTransactionConfirm(disc,isCompra): void {
  //   if(this.datos=="" || this.date3==""){
  //     this.showNotification('top', 'center', 3, "<h3>Tiene que ingresar una fecha de factura y consecutivo</b></h3> ", 'danger')
  //   }else{
  //     if( disc==1 || disc==2 ){
  //       const dialogRef = this.dialog.open(TransactionConfirmProvDialogComponent, {
  //         width: '60vw',
  //         height: '80vh',
  //         data: { total: this.calculateTotal(), productsQuantity: Object.keys(this.productsObject).length }
  //       });
  //
  //       dialogRef.afterClosed().subscribe(result => {
  //         if(result){
  //           this.clientData = result.clientData;
  //           CPrint("THIS IS RESULT: ",result);
  //           this.save(result,disc,isCompra);
  //         }
  //       });
  //     }else{
  //       var result = 0;
  //       this.save(result,disc,isCompra);
  //     }
  //   }
  // }

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
    this.httpClient.get(Urlbase.tienda+"/products2/inventoryListActivos?id_store="+this.locStorage.getIdStore()).subscribe((data: InventoryName[]) => {
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

  transformDate(date){
    return this.datePipe.transform(date, 'yyyy/MM/dd');
  }
  transformDateWithHour(date){
    return this.datePipe.transform(date, 'yyyy/MM/dd, h:mm a');
  }

  beginPlusOrDiscount(inventoryQuantityDTOList,isDisc) {
    if(isDisc == 1 || isDisc == 4){



      // this.inventoriesService.putQuantity(id_Store,quantity,code,inventoryQuantityDTOList);


      try{
        inventoryQuantityDTOList.forEach(element =>{
          this.inventoriesService.putQuantity(this.locStorage.getIdStore(),(-1)*Math.floor(element.quantity),element.code,inventoryQuantityDTOList,isDisc,element.id_storage).subscribe(() =>{
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
          this.inventoriesService.putQuantity(this.locStorage.getIdStore(),((-1)*Math.floor(element.quantity)),element.code,inventoryQuantityDTOList,isDisc,element.id_storage).subscribe(() =>{
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

    Math.floor((Math.random() * 4) + 1);

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

  upQuantity(elemento){
    elemento.quantity+=1;
  }

  downQuantity(elemento){
    if(1<elemento.quantity){
      elemento.quantity-=1;
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
