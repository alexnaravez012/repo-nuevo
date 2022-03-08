import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {LocalStorage} from '../../../../../../services/localStorage';
//import { Http, Headers, Response, URLSearchParams } from '@angular/http';
import {MatDialog, MatTableDataSource} from '@angular/material';
/* import components */
import {ReportesComponent} from '../../billing/bill-main/reportes/reportes.component';
import {QuantityDialogComponent} from './quantity-dialog/quantity-dialog.component';
import {ThirdDialogComponent} from './third-dialog/third-dialog.component';
import {CloseBoxComponent} from './close-box/close-box.component';
import {EmployeeDialogComponent} from './employee-dialog/employee-dialog.component';
import {PersonDialogComponent} from './person-dialog/person-dialog.component';
import {SearchClientDialogComponent} from './search-client-dialog/search-client-dialog.component';
import {SearchProductDialogComponent} from './search-product-dialog/search-product-dialog.component';
import {TransactionConfirmDialogComponent} from './transaction-confirm-dialog/transaction-confirm-dialog.component';
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
import {InventoryComponent} from './inventory/inventory.component';
import {StoresComponent} from './stores/stores.component';
import {UpdateLegalDataComponent} from './update-legal-data/update-legal-data.component';
import {NewProductStoreComponent} from './new-product-store/new-product-store.component';
import {ThirdService} from '../../../../../../services/third.service';
import {BillInventoryComponentComponent} from '../bill-main/bill-inventory-component/bill-inventory-component.component';
import {StoreSelectorService} from '../../../../../../components/store-selector.service';
import {TopProductsComponent} from './top-products/top-products.component';
import {paymentDetailDTO} from './../models/paymentDetailDTO';
import {stateDTO} from './../models/stateDTO';
import {OpenBoxComponent} from '../../../../../../components/open-box/open-box.component';
import {OpenorcloseboxComponent} from '../../../../../../components/openorclosebox/openorclosebox.component';
import {SelectboxComponent} from '../../../../../../components/selectbox/selectbox.component';
import * as jQuery from 'jquery';
import 'bootstrap-notify';
import {Router} from '@angular/router';
import {MatTableDataSourceWithCustomSort} from './pedidos/pedidos.component';
import {MatSort} from '@angular/material/sort';
import pdfMake from 'pdfmake/build/pdfmake.min';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import {ContingencyBillListComponent} from './contingency-bill-list/contingency-bill-list.component';
import {AuthenticationService} from '../../../../../../services/authentication.service';
import { TransactionConfirmDialog2Component } from './transaction-confirm-dialog2/transaction-confirm-dialog2.component';


let $: any = jQuery;
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Component({
    selector: 'app-bill-main',
    templateUrl: './bill-main.component.html',
    styleUrls: ['./bill-main.component.scss']
  })
export class BillMainComponent implements OnInit  {
    api_uri = Urlbase.tienda;

    url_icono = Urlbase.imagenes+"/productos/top20.png";


    sizeList = [47544]


    id_store = this.locStorage.getIdStore();
    CUSTOMER_ID;
    // venta =1
    // venta con remision 107

    //list
    itemLoadBilling: InventoryDetail;
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
    tabtab: number = 0;
    selected = new FormControl(0);
    CategoryName: string = "";
    taxesList: any;
    state: any;
    paymentDetailFinal: paymentDetailDTO = new paymentDetailDTO(1,1,0," ",new stateDTO(1));
    paymentDetail: string = '[{';
    paymentDetailObservable = this.httpClient;
    isTotalDev: boolean = false;
    idBillOriginal: String = "";
    storageList;
    priceList = [];
    pdfDatas: pdfData;


    selectedDomi = "-1";
    domiName = "";


    openBox = false;

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
    storeName=" ";
    public flag = "0";
    public productsObject = [];
    public removalArray = new Set();

    public flagVenta = true;
    public vendedor = {};
    public animal;
    public name;
    public form;
    public token:Token;
    public clientData: ClientData;

    public disccount = 0;
    public disccountPercent = 0;

    public searchData;
    public searchInput : string ="";
    public ObservationsInOrOut: string ="";

    private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    private options;

    public pickedPriceList: any;

    public doIAddItems = false;
    public idBillToAdd = 0;
    public topProds = [];

    public busqueda="";

    listaElem = [];

    quickconfirm = false;

    checker = true;

    mostrandoCargando = false;
    OcurrioError = "-1";


    cajeroInfo:any = {};
    //COSAS RELACIONADAS CON LAS TABLAS
    dataSourceBuscadoProductos = new MatTableDataSource();
    PrimeraCarga = true;
    dataSourceProductosSeleccionados = new MatTableDataSourceWithCustomSort(this.productsObject);
    @ViewChild(MatSort, {static: true}) sort: MatSort;

    GetKeys(){
      return ["code","description","quantity","price","tax","total"];
    }

    PromesaFiltrado = -1;
    ValorFiltrado = "";

  public IsMobile(){
    return window.innerWidth < 700;
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
            filteredList = filteredList.filter( element => element.ownbarcode.includes(listWord[i].toLowerCase().toLowerCase()) || element.product_STORE_CODE.toLowerCase().includes(listWord[i].toLowerCase()) || element.product_STORE_NAME.toLowerCase().normalize('NFD')
            .replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,"$1")
            .normalize().includes(listWord[i].toLowerCase().normalize('NFD')
            .replace(/([^n\u0300-\u036f]|n(?!\u0303(?![\u0300-\u036f])))[\u0300-\u036f]+/gi,"$1")
            .normalize()) )
          }
        }

        let filteredListSize = filteredList.length;
        if(filteredListSize>100){
          this.dataSourceBuscadoProductos = new MatTableDataSource(filteredList.slice(0,100));
        }else{
          this.dataSourceBuscadoProductos = new MatTableDataSource(filteredList);
        }

        return;
      }
      else{
        this.dataSourceBuscadoProductos = new MatTableDataSource([]);
      }

    }


    constructor(public router: Router, private authService:AuthenticationService, private service: StoreSelectorService, public thirdService: ThirdService,private http2: HttpClient,private http: HttpClient, public locStorage: LocalStorage,private fb: FormBuilder, private billingService: BillingService,
                public inventoriesService: InventoriesService, public dialog: MatDialog, private httpClient: HttpClient) {


                  this.getStoresNames();

      this.clientData = new ClientData(true, 'Cliente Ocasional', ' ', ' ', ' ', ' ', ' ', null);
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
      this.service.onDataSendEvent.subscribe(log => {
        CPrint("THIS CODE DID RUN, ", log)
      });
    }
    currentBox;
    idThird;
    myBox;
    SelectedStore;
    Stores;
    Stores2;
    listElem = "";
    domiList;
    @ViewChild('nameit') private elementRef: ElementRef;

    openOfflineListBill(){

      const dialogRef = this.dialog.open(ContingencyBillListComponent, {
        width: '60vw',
        height: '80vh',
        data: { total: this.taxesList }
      });


    }

    getDomiName(){
      const elem = this.domiList.find(item => item.id_THIRD_DOMICILIARIO == Number(this.selectedDomi));

      if(elem){
        this.domiName = elem.domiciliario;
      }else{
        this.domiName = "Sin Domicilio"
      }
    }

    getStores2() {
      this.billingService.getCajaByIdStatus(localStorage.getItem("id_employee")).subscribe(res => {
        this.http2.get(Urlbase.facturacion + "/billing/cantidadFacturas?id_caja="+this.locStorage.getIdCaja()+"&id_cierre_caja="+res).subscribe(data => {
          console.log("VALUE: ", data)
          //@ts-ignore
          this.locStorage.setBills(data);
        });
      });
      this.billingService.getStoresByThird(this.locStorage.getToken().id_third).subscribe(data => {
        CPrint("DATO: ", this.Stores);
        this.Stores = data;
        this.SelectedStore = this.locStorage.getIdStore();
        this.service.onMainEvent.emit(this.locStorage.getIdStore());
      }      )
    }


    calcPercent(){
      if(this.disccount>=this.roundnum(this.calculateSubtotal()+this.calculateTax())){
        this.disccount=this.roundnum(this.calculateSubtotal()+this.calculateTax());

      }

      if(this.disccount<=0){
        this.disccount=0;
      }

      this.disccountPercent = (this.disccount*100)/this.roundnum(this.calculateSubtotal()+this.calculateTax());
    }

    calcDiscount(){
      if(this.disccountPercent>=100){
        this.disccountPercent=100;

      }

      if(this.disccountPercent<=0){
        this.disccountPercent=0;
      }

      this.disccount = (this.disccountPercent*this.roundnum(this.calculateSubtotal()+this.calculateTax()))/100;
    }

    changeOnline(){
      if(this.locStorage.getOnline()){
        this.locStorage.setDateOnline(new Date());
        this.showNotification('top', 'center', 3, "<h3>CAMBIANDO AL MODO OFFLINE</h3> ", 'info');
        //this.getInventoryList(this.locStorage.getIdStore());

        // this.http2.post(Urlbase.tienda + "/resource/auditoria?nombre='SE ACTIVO EL MODO OFFLINE DE LA APLICACION'&id_third_employee="+this.locStorage.getToken().id_third+"&id_store="+this.locStorage.getIdStore()+"&valor_anterior=1&valor_nuevo=0",{}).subscribe(data => {
        //   CPrint(data);
        // })
        this.locStorage.setOnline(!this.locStorage.getOnline());
      }else{
        this.http2.post(Urlbase.tienda + "/resource/auditoria?nombre='"+this.locStorage.getDateOnline()+" - SE ACTIVO EL MODO OFFLINE DE LA APLICACION'&id_third_employee="+this.locStorage.getToken().id_third+"&id_store="+this.locStorage.getIdStore()+"&valor_anterior=1&valor_nuevo=0",{}).subscribe(data => {
          CPrint(data);
          //CryptoJS.AES.encrypt(JSON.stringify(this.locStorage.getOfflineBillList()), 'aADes54s3aS').toString()
          //var file = new File([JSON.stringify(this.locStorage.getOfflineBillList())], "BillList.JSON", {type: "text/plain;charset=utf-8"});
          //var FileSaver = require('file-saver');
          //FileSaver.saveAs(file);
          this.http2.post(Urlbase.tienda + "/resource/auditoria?nombre='SE ACTIVO EL MODO ONLINE DE LA APLICACION'&id_third_employee="+this.locStorage.getToken().id_third+"&id_store="+this.locStorage.getIdStore()+"&valor_anterior=0&valor_nuevo='ONLINE'",{}).subscribe(data => {
            CPrint(data);
            CPrint("BILL TO POST LIST: ",this.locStorage.getOfflineBillList());
            this.locStorage.setBills(this.locStorage.getBills()+this.locStorage.getOfflineBillList().length);
            this.http2.post(Urlbase.facturacion+"/billing/v2/bills",{"bills" : this.locStorage.getOfflineBillList(), "dates" : this.locStorage.getDateOfflineBills()}).subscribe(response => {
              this.getInventoryList(this.locStorage.getIdStore(),true);
              this.locStorage.setOnline(!this.locStorage.getOnline());
              //@ts-ignore
              if(response.length>0){
                this.showNotification('top', 'center', 3, "<h3>se presentaron problemas al pasar algunas facturas al modo ONLINE</h3> ", 'danger');
                this.locStorage.setOfflineBillList(response);
              }else{
                this.locStorage.setOfflineBillList([]);
              }
            })
          })
        },
        error => {
          this.showNotification('top', 'center', 3, "<h3>No se pudo pasar al modo ONLINE, hay problemas de red</h3> ", 'danger');
        })
      }
    }


    id_menu=143;

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

    GetNameFromIDStore(){
      let name = "";
      if(this.Stores2 == null){ return name; }
      for(let n = 0;n<this.Stores2.length;n++){
        if(this.Stores2[n].id_STORE == this.locStorage.getIdStore()){
          name = this.Stores2[n].store_NAME;
          break;
        }
      }
      return name;
    }

    getStoresNames(){
      this.billingService.getStoresByThird(this.locStorage.getToken().id_third).subscribe(data => {
        this.Stores2 = data;
      })

    }

    ngOnInit() {
      this.http2.get(Urlbase.tienda+"/price-list/priceList?idstore="+this.locStorage.getIdStore()).subscribe(response => {
        this.locStorage.setPriceList(response);
        // this.inventoriesService.getInventory(this.locStorage.getIdStore()).subscribe(res => {
        //   this.locStorage.setInventoryList(res);
        // })
        //this.getInventoryList(this.locStorage.getIdStore());
      })
      this.getInventoryList(this.locStorage.getIdStore(),true);

      CPrint("STUFF: ",this.locStorage.getIdStore());

      CPrint("TIPOS STORE", this.locStorage.getTipo());

      //PROTECCION URL INICIA
      CPrint(JSON.stringify(this.locStorage.getMenu()));
      const elem = this.locStorage.getMenu().find(item => item.id_menu == this.id_menu);

      if(!elem){
        // noinspection JSIgnoredPromiseFromCall
        this.router.navigateByUrl("/dashboard/business/movement/nopermision");
      }
      //PROTECCION URL TERMINA

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

        let rolesCajeros = this.locStorage.getRol().filter(element => this.locStorage.getListRolesCajeros().includes(element.id_rol) )
        localStorage.setItem("id_employee",String(this.locStorage.getToken().id_third));
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
                let dialogRef = this.dialog.open(OpenorcloseboxComponent, {
                  width: '60vw',
                  data: {answering},
                  disableClose: true
                }).afterClosed().subscribe(response=> {
                  CPrint("this is the response for adriano: ", response);
                  if(response){
                    this.locStorage.setBoxStatus(true);
                    this.locStorage.setIdCaja(Number(answering[0].id_CAJA));
                    this.locStorage.setCajaOld(Number(answering[0].id_CAJA));
                    this.billingService.getCajaByIdStatus(localStorage.getItem("id_employee")).subscribe(res => {
                      this.http2.get(Urlbase.facturacion + "/billing/cantidadFacturas?id_caja="+this.locStorage.getIdCaja()+"&id_cierre_caja="+res).subscribe(data => {
                        console.log("VALUE: ", data)
                        //@ts-ignore
                        this.locStorage.setBills(data);
                      });
                    });



                    this.http2.get(Urlbase.cierreCaja+"/close/myboxes?id_person="+this.locStorage.getPerson().id_person).subscribe(resp => {
                      CPrint(resp);
                      //@ts-ignore
                      resp.forEach(element => {
                        if(element.id_CAJA==Number(answering[0].id_CAJA)){
                          CPrint("ENTRE");
                          this.locStorage.setIdStore(element.id_STORE);
                          this.getStoreType(element.id_STORE);
                          this.getTopProds(element.id_STORE);
                        }
                      });

                      this.SelectedStore=this.locStorage.getIdStore();
                      this.service.onMainEvent.emit(Number(answering[0].id_CAJA));
                      this.getStores2();
                      this.ngOnInit();

                    });

                    CPrint("IM ON THE TRUE SIDE OF THINGS")
                  }else{
                    this.locStorage.setIdCaja(Number(answering[0].id_CAJA));
                    this.locStorage.setCajaOld(Number(answering[0].id_CAJA));
                    this.billingService.getCajaByIdStatus(localStorage.getItem("id_employee")).subscribe(res => {
                      this.http2.get(Urlbase.facturacion + "/billing/cantidadFacturas?id_caja="+this.locStorage.getIdCaja()+"&id_cierre_caja="+res).subscribe(data => {
                        console.log("VALUE: ", data)
                        //@ts-ignore
                        this.locStorage.setBills(data);
                      });
                    });
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
                          this.billingService.getCajaByIdStatus(localStorage.getItem("id_employee")).subscribe(res => {
                            this.http2.get(Urlbase.facturacion + "/billing/cantidadFacturas?id_caja="+this.locStorage.getIdCaja()+"&id_cierre_caja="+res).subscribe(data => {
                              console.log("VALUE: ", data)
                              //@ts-ignore
                              this.locStorage.setBills(data);
                            });
                          });
                          this.http2.get(Urlbase.cierreCaja+"/close/myboxes?id_person="+this.locStorage.getPerson().id_person).subscribe(resp => {
                            //@ts-ignore
                            resp.forEach(element => {
                              if(element.id_CAJA==this.locStorage.getIdCaja()){
                                this.locStorage.setIdStore(element.id_STORE);
                                this.getStoreType(element.id_STORE);
                                this.getTopProds(element.id_STORE);
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
                              this.getTopProds(this.locStorage.getIdStore());
                              this.getStores2();
                              CPrint("ID CAJA: ",this.locStorage.getIdCaja());
                              CPrint("ID STORE: ",this.locStorage.getIdStore());
                              CPrint("STORE TYPE: ",this.locStorage.getTipo());
                              CPrint("BOX TYPE: ",this.locStorage.getBoxStatus());
                              CPrint("OR ITS ME?");
                              setTimeout(() => {

                                this.elementRef.nativeElement.focus();
                                this.elementRef.nativeElement.select();

                              }, 100);
                            });
                          });
                        }
                      });

                    });
                  }
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
                      this.billingService.getCajaByIdStatus(localStorage.getItem("id_employee")).subscribe(res => {
                        this.http2.get(Urlbase.facturacion + "/billing/cantidadFacturas?id_caja="+this.locStorage.getIdCaja()+"&id_cierre_caja="+res).subscribe(data => {
                          console.log("VALUE: ", data)
                          //@ts-ignore
                          this.locStorage.setBills(data);
                        });
                      });
                      this.locStorage.setBoxStatus(false);
                      this.http2.get(Urlbase.cierreCaja+"/close/myboxes?id_person="+this.locStorage.getPerson().id_person).subscribe(asd => {
                        //@ts-ignore
                        asd.forEach(element => {
                          if(element.id_CAJA==this.locStorage.getIdCaja()){
                            this.locStorage.setIdStore(element.id_STORE);
                            this.getStoreType(element.id_STORE);
                            this.getTopProds(element.id_STORE);
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

                          setTimeout(() => {

                            this.elementRef.nativeElement.focus();
                            this.elementRef.nativeElement.select();

                          }, 100);

                          this.SelectedStore=this.locStorage.getIdStore();
                          this.getTopProds(this.locStorage.getIdStore());
                          this.getStores2();
                        });
                      });
                    }else{
                      this.locStorage.setIdCaja(response2.idcaja);
                      this.locStorage.setCajaOld(response2.idcaja);
                      this.billingService.getCajaByIdStatus(localStorage.getItem("id_employee")).subscribe(res => {
                        this.http2.get(Urlbase.facturacion + "/billing/cantidadFacturas?id_caja="+this.locStorage.getIdCaja()+"&id_cierre_caja="+res).subscribe(data => {
                          console.log("VALUE: ", data)
                          //@ts-ignore
                          this.locStorage.setBills(data);
                        });
                      });
                      this.getStores3();
                      this.http2.get(Urlbase.cierreCaja+"/close/myboxes?id_person="+this.locStorage.getPerson().id_person).subscribe(resp => {
                        //@ts-ignore
                        resp.forEach(element => {
                          if(element.id_CAJA==this.locStorage.getIdCaja()){
                            this.locStorage.setIdStore(element.id_STORE);
                            this.getTopProds(element.id_STORE);
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

      this.openBox = this.locStorage.getBoxStatus();
      CPrint("ID CAJAAAAA: ", this.locStorage.getIdCaja());
      CPrint("ID STOREEEEE: ", this.locStorage.getIdStore());
      CPrint("Box STATUS: ", this.locStorage.getBoxStatus());

      this.http.get(Urlbase.tienda+"/products/cajeroInfo?id_caja="+this.locStorage.getIdCaja()).subscribe(
        response => {
          this.cajeroInfo = response;
          CPrint("DATOS QUE NECESITAMOS: ",response);
        }
      );

      //-----machete para telefono y direccion
      if(this.locStorage.getThird().id_third == 542){
        this.locStorage.setDireccion("Cali, Cra 42C # 52-05");
        this.locStorage.setTelefono("2345678 / 3222345674");
      }

      if(this.locStorage.getThird().id_third == 601){
        this.locStorage.setDireccion("Cali, Calle 3 Oeste # 1-80");
        this.locStorage.setTelefono("3209807254");
      }
      //-----machete para telefono y direccion

      setTimeout(() => {

        this.elementRef.nativeElement.focus();
        this.elementRef.nativeElement.select();

      }, 100);


      this.idThird = this.locStorage.getToken().id_third

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
      this.getCodes();
      // noinspection JSIgnoredPromiseFromCall
      this.headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization':  this.locStorage.getTokenValue(),
      });
      let token = localStorage.getItem('currentUser');
      this.options = { headers: this.headers };
      this.getStorages();
      //Seteo el logo en localstorage
      if(localStorage.getItem('Logo') == "-1" || localStorage.getItem('Logo') == null){
        // noinspection JSIgnoredPromiseFromCall
        this.GetLogo(Urlbase.logos+"/"+this.locStorage.getThird().info.type_document+" "+this.locStorage.getThird().info.document_number+".jpg");
      }
    }


    async GetLogo(url,intento = 0){
      if(intento >= 10){
        CPrint("No se pudo obtener el logom intento >= 10");
        return;
      }else{
        try{
          let LogoBase64 = await this.getBase64ImageFromUrl(url);
          localStorage.setItem("Logo",LogoBase64+"");
        }catch (e) {
          this.GetLogo(url,intento + 1);
        }
      }
    }

    async getBase64ImageFromUrl(imageUrl) {
      //var res = await fetch("https://cors-anywhere.herokuapp.com/"+imageUrl);
      var res = await fetch(imageUrl,{mode:"no-cors"});
      var blob = await res.blob();

      return new Promise((resolve, reject) => {
        var reader  = new FileReader();
        reader.addEventListener("load", function () {
          resolve(reader.result);
        }, false);

        reader.onerror = () => {
          return reject(this);
        };
        reader.readAsDataURL(blob);
      })
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


    // async DelayedgetInventoryList(){
    //   this.mostrandoCargando = true;
    //   //Esto es debido a un delay en localstorage, entonces espero hasta que se inicialice para continuar
    //   while(1==1){
    //     await new Promise(resolve => setTimeout(resolve, 50));
    //     if(this.locStorage.getIdStore() != 1){break;}
    //   }
    //   if(this.locStorage.getBoxStatus()){
    //     await this.getInventoryList(this.locStorage.getIdStore())
    //   };
    //   this.mostrandoCargando = false;
    // }

    async getElemsIfOwn(){
      this.inventoryList.forEach(element => {
        if(element.ownbarcode==this.listElem){
          CPrint("PUDE ENTRAR 1");
          this.listaElem.push(element);
        }
      })
    }

    async getElemsIfcode(){
      this.inventoryList.forEach(element => {
        if(element.product_STORE_CODE==this.listElem){
          CPrint("PUDE ENTRAR 2");
          this.listaElem.push(element);
        }
      })
    }

    getStoreType(id_store){
      //@ts-ignore
      this.http2.get(Urlbase.tienda+"/store/tipoStore?id_store="+id_store).subscribe( response => {
        this.locStorage.setTipo(response);
        CPrint("ID CAJA: ",this.locStorage.getIdCaja());
        CPrint("ID STORE: ",this.locStorage.getIdStore());
        CPrint("STORE TYPE: ",this.locStorage.getTipo());
        CPrint("BOX TYPE: ",this.locStorage.getBoxStatus());
        CPrint("AM I?");
        this.getStores();
      })
    }

    getStores() {
      this.billingService.getCajaByIdStatus(localStorage.getItem("id_employee")).subscribe(res => {
        this.http2.get(Urlbase.facturacion + "/billing/cantidadFacturas?id_caja="+this.locStorage.getIdCaja()+"&id_cierre_caja="+res).subscribe(data => {
          console.log("VALUE: ", data)
          //@ts-ignore
          this.locStorage.setBills(data);
        });
      });
      this.billingService.getStoresByThird(this.locStorage.getToken().id_third).subscribe(data => {
        this.Stores = data;
        CPrint("DATO: ", this.Stores);
        data.forEach(element => {
          if(element.id_STORE==this.locStorage.getIdStore()){
            this.storeName = element.store_NAME;
          }
        });
      })
    }

    getTopProds(idstore){
      this.topProds = [];
      this.http2.get(Urlbase.facturacion+"/billing/top20?idstore="+idstore).subscribe(res=> {
        for(let i=0;i<20;i++){
          this.topProds.push(res[i]);
        }

        CPrint("THIS IS LIST, ",this.topProds)
      })
    }

    reload(){
      CPrint("RELOAD");
      this.ngOnInit();
      this.getTopProds(this.locStorage.getIdStore())
    }

    //   getPriceList(id){
    //   this.inventoryList.forEach(item => {
    //     this.http2.get(Urlbase.tienda+"/store/pricelist?id_product_store="+id).subscribe((data) => {
    //       this.priceList[item.id_PRODUCT_STORE] = data;
    //      })
    //   });
    // }

    setCode(code){

      this.addDetail2(code);

    }

    roundnum(num){
      return Math.round(num / 50)*50;
    }

    getStores3() {
      this.billingService.getCajaByIdStatus(localStorage.getItem("id_employee")).subscribe(res => {
        this.http2.get(Urlbase.facturacion + "/billing/cantidadFacturas?id_caja="+this.locStorage.getIdCaja()+"&id_cierre_caja="+res).subscribe(data => {
          console.log("VALUE: ", data)
          //@ts-ignore
          this.locStorage.setBills(data);
        });
      });
      this.billingService.getStoresByThird(this.locStorage.getToken().id_third).subscribe(data => {
        CPrint(data);
        this.Stores = data;
        this.SelectedStore = data[0].id_STORE;
        this.locStorage.setIdStore(data[0].id_STORE)
      })
    }

    getPriceList3(product,code,id,quantity){
      CPrint("id is: ",id);
      this.http2.get(Urlbase.tienda+"/store/pricelist?id_product_store="+id).subscribe(response => {
        CPrint("This is picked price list: ",response);
        const datos = response;
        CPrint("this is datos: ",datos);
        if (product) {
          let new_product = {
            quantity: quantity,
            id_storage: this.storageList[0].id_storage,
            price: datos[0].price,
            tax: this.getPercentTax(product.id_TAX),
            id_product_third: product.id_PRODUCT_STORE,
            tax_product: product.id_TAX,
            state: this.commonStateDTO,
            description: product.product_STORE_NAME,
            code: product.code,
            id_inventory_detail: product.id_INVENTORY_DETAIL,
            ownbarcode: product.ownbarcode,
            product_store_code: String(product.product_STORE_CODE),
            pricelist: response
          };
          new_product.price = response[0].price;
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
          this.http2.get(Urlbase.tienda+"/products2/code/general?code="+String(code)).subscribe(data => {
            codeList = data;
            CPrint("this is codeList: ", codeList);
            //@ts-ignore
            if( data.length == 0 ){
              if(localStorage.getItem("SesionExpirada") != "true"){}
              if(localStorage.getItem("SesionExpirada") != "true"){ alert('Product not exist');}
            }else{
              let dialogRef;
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
              // this.http.post(Urlbase.tienda+"/store/ps",body,this.options).subscribe(data=>
              // {
              //   CPrint("Post hecho");});
            }
          });

        }

      });
    }


    getPriceList(product,code,id){
      CPrint("id is: ",id);
      if(this.locStorage.getOnline()){
        if (product) {
          let new_product = {
            quantity: 1,
            id_storage: this.storageList[0].id_storage,
            price: this.locStorage.getPriceList().filter(item => item.id_PRODUCT_STORE == id )[0].price,
            tax: this.getPercentTax(product.id_TAX),
            id_product_third: product.id_PRODUCT_STORE,
            tax_product: product.id_TAX,
            state: this.commonStateDTO,
            description: product.product_STORE_NAME,
            code: product.code,
            id_inventory_detail: product.id_INVENTORY_DETAIL,
            ownbarcode: product.ownbarcode,
            product_store_code: String(product.product_STORE_CODE),
            pricelist: this.locStorage.getPriceList().filter(item => item.id_PRODUCT_STORE == id ),
            invQuantity: product.quantity
          };
          new_product.price = this.locStorage.getPriceList().filter(item => item.id_PRODUCT_STORE == id )[0].price;
          //this.detailBillDTOList.push(new_product);
          this.productsObject.unshift(new_product);
          this.dataSourceProductosSeleccionados = new MatTableDataSourceWithCustomSort(this.productsObject);
          this.dataSourceProductosSeleccionados.sort = this.sort;


          this.disableDoubleClickSearch = false;
          // event.target.blur();
          // event.target.value = '';
          // setTimeout(() => {
          //   document.getElementById('lastDetailQuantity');
          // });
        } else {
          let codeList;
          this.http2.get(Urlbase.tienda+"/products2/code/general?code="+String(code)).subscribe(data => {
            codeList = data;
            CPrint("this is codeList: ", codeList);
            //@ts-ignore
            if( data.length == 0 ){
              if(localStorage.getItem("SesionExpirada") != "true"){ alert('Product not exist');}
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
              // this.http.post(Urlbase.tienda+"/store/ps",body,this.options).subscribe(data=>
              // {
              //   CPrint("Post hecho");});
            }
          });

        }

    }else{
          CPrint("This is picked price list: ",this.locStorage.getPriceList().filter(item => item.id_PRODUCT_STORE == id ));
          if (product) {
            let new_product = {
              quantity: 1,
              id_storage: this.storageList[0].id_storage,
              price: this.locStorage.getPriceList().filter(item => item.id_PRODUCT_STORE == id )[0].price,
              tax: this.getPercentTax(product.id_TAX),
              id_product_third: product.id_PRODUCT_STORE,
              tax_product: product.id_TAX,
              state: this.commonStateDTO,
              description: product.product_STORE_NAME,
              code: product.code,
              id_inventory_detail: product.id_INVENTORY_DETAIL,
              ownbarcode: product.ownbarcode,
              product_store_code: String(product.product_STORE_CODE),
              pricelist: this.locStorage.getPriceList().filter(item => item.id_PRODUCT_STORE == id ),
              invQuantity: product.quantity
            };

            new_product.price = this.locStorage.getPriceList().filter(item => item.id_PRODUCT_STORE == id )[0].price;
            //this.detailBillDTOList.push(new_product);
            this.productsObject.unshift(new_product);
            this.dataSourceProductosSeleccionados = new MatTableDataSourceWithCustomSort(this.productsObject);
            this.dataSourceProductosSeleccionados.sort = this.sort;
            this.disableDoubleClickSearch = false;
            // event.target.blur();
            // event.target.value = '';
            // setTimeout(() => {
            //   document.getElementById('lastDetailQuantity');
           // });
          } else {
            let codeList;
            this.http2.get(Urlbase.tienda+"/products2/code/general?code="+String(code)).subscribe(data => {
              codeList = data;
              CPrint("this is codeList: ", codeList);
              //@ts-ignore
              if( data.length == 0 ){
                if(localStorage.getItem("SesionExpirada") != "true"){ alert('Product not exist');}
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
                // this.http.post(Urlbase.tienda+"/store/ps",body,this.options).subscribe(data=>
                // {
                //   CPrint("Post hecho");});
              }
            });

          }

      };
    }


    getStorages() {
      this.http2.get(Urlbase.tienda+"/store/s?id_store="+this.id_store).subscribe((res)=>{
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
        this.http.put(Urlbase.facturacion+"/billing-state/billState/"+this.IdBillDevolucion,null,{params: params}).subscribe((res)=>{
          const notas = this.NotasDevolucion + ' / Factura Anulada Por Motivo de Devolucion';
          this.http.put(Urlbase.facturacion+"/billing-state/documentBody/"+this.IdDocumentDevolucion,null,{params: {'body': notas}}).subscribe((resp)=>{
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

      let dialogRef = this.dialog.open(CloseBoxComponent, {
        width: '60vw',
        data: {flag:true}
      });

    }




    openTop(){
      CPrint("THIS IS ROLES: ", this.locStorage.getTipo());

      let modal;
      modal = this.dialog.open(TopProductsComponent, {
        width: '1040px',
        height: '680px',
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




    openCategories(){
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

    openInventories(){

      let dialogRef = this.dialog.open(InventoryComponent, {
        width: '60vw',
        data: {}
      });


    }

    openStores(){

      let dialogRef = this.dialog.open(StoresComponent, {
        width: '60vw',
        data: {}
      });

    }
    openUpdateLegalData(){
      let dialogRef = this.dialog.open(UpdateLegalDataComponent, {
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
    }


    setCategoryID(id,name){
      this.categoryID = id;
      this.categoryIDboolean = true;
      this.CategoryName = name;
    }

    addDetail3(code,quantity) {

      if(code == "TEMPOMESA3BANDAS" || code == "TEMPOMESALIBRES" || code == "TEMPOMESAPOOL"){
        return;
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
      } else {

        // var product = this.inventoryList.find(item => (item.ownbarcode == code || item.code == code || String(item.product_STORE_CODE) == code));
        const product = this.inventoryList.find(item => this.findCode(code, item));
        //@ts-ignore
        if(product){
          this.getPriceList3(product,code,product.id_PRODUCT_STORE,quantity)
        }else{
          if(localStorage.getItem("SesionExpirada") != "true"){ alert('El codigo '+code+' no esta asociado a un producto.');}
        }
      }
    }


    findCode(code,item){

      if(item.ownbarcode == code){
        return item;
      }else{
        if(String(item.product_STORE_CODE) == code){
          return item;
        }
      }

    }

    findCode2(code,storeCode,item){

      if(item.ownbarcode == code){
        return item;
      }else{
        if(String(item.product_STORE_CODE) == code){
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
      console.log(this.inventoryList)
      // CPrint(code,"da code :3")

      const product = this.inventoryList.find(item => this.findCode(code, item));

      if(product && product.inventario_DISPONIBLE==='S'){
        if(this.locStorage.getOnline()){
          console.log("INSIDE ONLINE")
        this.http.get(Urlbase.facturacion+"/billing/validateProductQuantity?idps="+product.id_PRODUCT_STORE).subscribe(element => {
          if(element<=0){
            let pos = this.inventoryList.map(function(e) { return e.id_PRODUCT_STORE; }).indexOf(product.id_PRODUCT_STORE);
            console.log("INDEX OF ELEMENT: "+pos);
            this.getInventoryList(this.locStorage.getIdStore,false);
            product.quantity = element;
            this.inventoryList[pos].quantity = element;
            this.showNotification('top', 'center', 3, "<h3>El producto que intenta agregar al carrito se encuentra agotado.</h3> ", 'danger');
            this.disableDoubleClickSearch = false;
          }else{
            if(validate){
              if(product && product.inventario_DISPONIBLE == 'S' ){
                if((!(product.status == 'ACTIVO') || product.quantity < 1)){
                  this.disableDoubleClickSearch = false;
                  return;
                }
              }

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

                if(product.inventario_DISPONIBLE == 'S' ){
                  if(this.productsObject[this.productsObject.indexOf(key)].quantity > this.productsObject[this.productsObject.indexOf(key)].invQuantity){
                    this.productsObject[this.productsObject.indexOf(key)].quantity = this.productsObject[this.productsObject.indexOf(key)].invQuantity;
                  }
                }
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
        },error=>{
          console.log(error);
          this.disableDoubleClickSearch = false;
          this.showNotification('top', 'center', 3, "<h3>Hay un error de conexion, por favor utilizar el modo OffLine</h3> ", 'danger');
        })}else{
          console.log("INSIDE OFFLINE2")
          if(validate){
            console.log("INSIDE OFFLINE2")
            if(product && product.inventario_DISPONIBLE == 'S' ){
              if((!(product.status == 'ACTIVO') || product.quantity < 1)){
                this.disableDoubleClickSearch = false;
                return;
              }
            }

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

              if(product.inventario_DISPONIBLE == 'S' ){
                if(this.productsObject[this.productsObject.indexOf(key)].quantity > this.productsObject[this.productsObject.indexOf(key)].invQuantity){
                  this.productsObject[this.productsObject.indexOf(key)].quantity = this.productsObject[this.productsObject.indexOf(key)].invQuantity;
                }
              }
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
      }else{
        if(validate){
          if(product && product.inventario_DISPONIBLE == 'S' ){
            if((!(product.status == 'ACTIVO') || product.quantity < 1)){
              this.disableDoubleClickSearch = false;
              return;
            }
          }

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

            if(product.inventario_DISPONIBLE == 'S' ){
              if(this.productsObject[this.productsObject.indexOf(key)].quantity > this.productsObject[this.productsObject.indexOf(key)].invQuantity){
                this.productsObject[this.productsObject.indexOf(key)].quantity = this.productsObject[this.productsObject.indexOf(key)].invQuantity;
              }
            }
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
    }



    selectedVendor = "-1";



    getMessage(element){
      return "Cantidad Disponible: "+element.invQuantity;
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
        this.disableDoubleClickSearch = false;
      } else {

        const product = this.inventoryList.find(item => this.findCode(code, item));
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

    addDetail(event) {
      console.log(this.elementRef.nativeElement.disabled);
      if(this.disableDoubleClickSearch){
        return;
      }
      this.disableDoubleClickSearch = true;
      CPrint("STORE NAME, "+this.storeName);
      const code = String(event.target.value);
      // CPrint(code,"da code :3")

      // var codeFilter = this.productsObject.filter(item => (String(item.code) === code || String(item.ownbarcode) === code || String(item.product_store_code) === code ));

      const product = this.inventoryList.find(item => this.findCode(code, item));

      if(product && product.inventario_DISPONIBLE==='S'){
        if(this.locStorage.getOnline()){
          console.log("INSIDE ONLINE")
        this.http.get(Urlbase.facturacion+"/billing/validateProductQuantity?idps="+product.id_PRODUCT_STORE).subscribe(element => {
          if(!(element>0)){
            product.quantity = element;
            this.showNotification('top', 'center', 3, "<h3>El producto que intenta agregar al carrito se encuentra agotado.</h3> ", 'danger');
            this.getInventoryList(this.locStorage.getIdStore(),false);
            this.disableDoubleClickSearch = false;
            return;
          }else{
            if(product && ((product.inventario_DISPONIBLE == 'S' && product.quantity < 1) || !(product.status === 'ACTIVO'))){
              this.disableDoubleClickSearch = false;
              return;
          }

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
            if(product.inventario_DISPONIBLE == 'S' ){
              if(this.productsObject[this.productsObject.indexOf(key)].quantity > this.productsObject[this.productsObject.indexOf(key)].invQuantity){
                this.productsObject[this.productsObject.indexOf(key)].quantity = this.productsObject[this.productsObject.indexOf(key)].invQuantity;
              }
            }
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
        },error=>{
          console.log(error);
          this.disableDoubleClickSearch = false;
          this.showNotification('top', 'center', 3, "<h3>Hay un error de conexion, por favor utilizar el modo OffLine</h3> ", 'danger');
        })}else{
          console.log("INSIDE OFFLINE")
          if(product && ((product.inventario_DISPONIBLE == 'S' && product.quantity < 1) || !(product.status === 'ACTIVO'))){
            this.disableDoubleClickSearch = false;
            return;
        }

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
          if(product.inventario_DISPONIBLE == 'S' ){
            if(this.productsObject[this.productsObject.indexOf(key)].quantity > this.productsObject[this.productsObject.indexOf(key)].invQuantity){
              this.productsObject[this.productsObject.indexOf(key)].quantity = this.productsObject[this.productsObject.indexOf(key)].invQuantity;
            }
          }
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
      }else{
        if(product && ((product.inventario_DISPONIBLE == 'S' && product.quantity < 1) || !(product.status === 'ACTIVO'))){
            this.disableDoubleClickSearch = false;
            return;
        }

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
          if(product.inventario_DISPONIBLE == 'S' ){
            if(this.productsObject[this.productsObject.indexOf(key)].quantity > this.productsObject[this.productsObject.indexOf(key)].invQuantity){
              this.productsObject[this.productsObject.indexOf(key)].quantity = this.productsObject[this.productsObject.indexOf(key)].invQuantity;
            }
          }
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

    }

    setMax(product){
      if(this.inventoryList[0].inventario_DISPONIBLE == 'S'){
        if(product.quantity>product.invQuantity){
          product.quantity = product.invQuantity;
        }else{
          return;
        }
      }

    }


    addDetailFromCat(code) {
      if (this.productsObject.hasOwnProperty(code)) {
        this.productsObject[code]['quantity'] += 1;
        this.resetCategoryMenu();
      } else {
        const product = this.inventoryList.find(item => item['code'] == code);
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

          setTimeout(() => {
            document.getElementById('lastDetailQuantity');
          });
          this.resetCategoryMenu();
        } else {
          this.resetCategoryMenu();
          this.showNotification('top','center',3,"<h3 class = 'text-center'>El producto solicitado no existe<h3>",'danger');
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

    checkItem(event, code) {
      if (event.target.checked) {
        this.removalArray.add(code);
      } else {
        this.removalArray.delete(code);
      }
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

    prodcode="";

    cancel() {
      //this.http2.post(Urlbase.tienda + "/resource/auditoria?nombre='SE ACTIVO PRESIONO CANCELAR EN LA FACTURA DE VENTA'&id_third_employee="+this.locStorage.getToken().id_third+"&id_store="+this.locStorage.getIdStore()+"&valor_anterior=1&valor_nuevo=0",{}).subscribe(data => {
        //CPrint(data);
      //});
      this.prodcode="";
      this.selectedDomi = "-1";
      this.disccount = 0;
      this.disccountPercent = 0;
      this.billDTO.id_third_destiny = null;
      this.listElem = "";
      this.listaElem = [];
      this.form.reset();
      this.clientData = new ClientData(true, 'Cliente Ocasional', ' ', ' ', ' ', ' ', ' ', null);
      this.productsObject = [];
      this.dataSourceProductosSeleccionados = new MatTableDataSourceWithCustomSort(this.productsObject);
      this.dataSourceProductosSeleccionados.sort = this.sort;

      this.removalArray = new Set();

      this.CUSTOMER_ID= this.token.id_third_father;
      setTimeout(() => {

        this.elementRef.nativeElement.focus();
        this.elementRef.nativeElement.select();

      }, 100);
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

    openDialogTransactionConfirm(disc,isCompra,oneOrTwo): void {
      this.quickconfirm = true;
      if( disc==1 || disc==2 ){
        if(oneOrTwo){
          const dialogRef = this.dialog.open(TransactionConfirmDialogComponent, {
            width: '60vw',
            height: '80vh',
            data: { total: this.calculateTotal(), productsQuantity: Object.keys(this.productsObject).length },
            disableClose: true
          });

          dialogRef.afterClosed().subscribe(result => {
            this.quickconfirm=false;
            if(result){
              this.clientData = result.clientData;
              this.disccount = result.disccount;
              this.disccountPercent = result.disccountPercent;
              CPrint("this is result for cash: ",result);
              //this.save(result,disc,isCompra);
              this.sendData(result,disc,true);
            }else{

            }
          });
        }else{
          const dialogRef = this.dialog.open(TransactionConfirmDialog2Component, {
            width: '60vw',
            height: '80vh',
            data: { total: this.calculateTotal(), productsQuantity: Object.keys(this.productsObject).length },
            disableClose: true
          });

          dialogRef.afterClosed().subscribe(result => {
            this.quickconfirm=false;
            if(result){
              this.clientData = result.clientData;
              this.disccount = result.disccount;
              this.disccountPercent = result.disccountPercent;
              CPrint("this is result for cash: ",result);
              //this.save(result,disc,isCompra);
              this.sendData(result,disc,true);
            }else{

            }
          });
        }
      }else{

        //this.save(this.clientData,disc,isCompra);
        this.sendData(this.clientData,disc,true);
      }

    }

    FuncionEnCasoDeTimeOut(error,refClase){
      this.quickconfirm = false;
      if(refClase.mostrandoCargando){
        refClase.OcurrioError = error;
        $.notify({
          icon: "notifications",
          message: "<b>Occurrió un error: </b>"+refClase.OcurrioError
        }, {
          type: "danger",
          timer: 200,
          placement: {
            from: 'top',
            align: 'right'
          }
        });
        refClase.mostrandoCargando = false;
        refClase.quickconfirm = false;
        setTimeout(() => {

          refClase.elementRef.nativeElement.focus();
          refClase.elementRef.nativeElement.select();

        }, 100);
      }
    }

    sendData(data,disc,pdf){
      this.http2.get(Urlbase.tienda+"/price-list/priceList?idstore="+this.locStorage.getIdStore()).subscribe(response => {
        this.locStorage.setPriceList(response);
        // this.inventoriesService.getInventory(this.locStorage.getIdStore()).subscribe(res => {
        //   this.locStorage.setInventoryList(res);
        // })
        //this.getInventoryList(this.locStorage.getIdStore());
      })
      console.log("THIS IS THE DATA, ",data);
      let cash =0;
      if(data.cash){
        cash = data.cash;
      }
      this.mostrandoCargando = true;
      let elTimer = setTimeout(this.FuncionEnCasoDeTimeOut,20000,"Error al procesar la venta",this);
      let detailList = '';
      //GENERO LA LISTA DE DTOs DE DETALLES
      this.productsObject.forEach(item => {
        CPrint(item);
        detailList = detailList+ "{"+item.id_product_third+","+item.price+","+item.tax_product+","+item.quantity+"},"
      });

      CPrint("THIS IS MY DETAIL STRING: ", detailList.substring(0, detailList.length - 1));
      //GENERO EL DTO DE FACTURA
      this.getDomiName();
      if(this.locStorage.getIdStore() == 81){
        this.flag = "1"
      }
      let datos = "";
      if(data.paymentMethod == "efectivo"){
        datos = "Efectivo"
      }
      if(data.paymentMethod == "debito"){
        datos = "Débito"
      }
      if(data.paymentMethod == "credito"){
        datos = "Crédito"
      }
      if(data.paymentMethod == "transferencia"){
        datos = "Transferencia"
      }
      datos = datos;//esto es pa que no salga variable si uso :v
      CPrint("this is id person: ",data.id_person);
      if(data.id_person){
        CPrint("ENTRE");
        //@ts-ignore
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

        this.billDTO.id_store = this.locStorage.getIdStore();
        if (detailList.length > 0 && this.checker) {
          let ID_BILL_TYPE= this.form.value['isRemission']?107:1;
          this.billDTO.id_third_employee = this.token.id_third_father;
          this.billDTO.id_third = this.token.id_third;
          this.billDTO.id_bill_type = 1;
          //instanciar de acuerdo a por remision
          this.billDTO.id_bill_state = 1;
          this.billDTO.purchase_date = new Date();
          this.billDTO.subtotal = this.roundnum(this.calculateSubtotal());
          this.billDTO.tax = this.roundnum(this.calculateTax());
          this.billDTO.totalprice = this.roundnum(this.calculateTotal());
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
              this.paymentDetailFinal.aprobation_code= "";
              this.paymentDetailFinal.id_payment_method=1;
            }
            if(data.paymentMethod == "debito"){
              this.paymentDetail+='"id_payment_method": 2, ';
              this.paymentDetail+='"aprobation_code": "'+data.transactionCode+'", ';
              // this.paymentDetail+='"id_bank_entity": '+Number(data.creditBank)+', ';
              this.paymentDetailFinal.aprobation_code= data.transactionCode;
              this.paymentDetailFinal.id_payment_method=2;
            }
            if(data.paymentMethod == "credito"){
              this.paymentDetail+='"id_payment_method": 3, ';
              this.paymentDetail+='"aprobation_code": "'+data.transactionCode+'", ';
              // this.paymentDetail+='"id_bank_entity": '+Number(data.creditBank)+', ';
              this.paymentDetailFinal.aprobation_code= data.transactionCode;
              this.paymentDetailFinal.id_payment_method=3;
            }
            if(data.paymentMethod == "transferencia"){
              this.paymentDetail+='"id_payment_method": 4, ';
              this.paymentDetail+='"aprobation_code": "'+data.transactionCode+'", ';
              // this.paymentDetail+='"id_bank_entity": '+Number(data.creditBank)+', ';
              this.paymentDetailFinal.aprobation_code= data.transactionCode;
              this.paymentDetailFinal.id_payment_method=4;
            }


            if(data.wayToPay == "contado"){
              this.paymentDetail+='"id_way_to_pay": 1, ';
              this.paymentDetailFinal.id_way_to_pay = 1;
            }

            if(data.wayToPay == "credito"){
              this.paymentDetail+='"id_way_to_pay": 2, ';
              this.paymentDetailFinal.id_way_to_pay = 2;
            }



            if(data.list && data.list!=null && data.list != undefined && data.list.length>0){
              this.paymentDetailFinal.payment_value = (data.cash)
              this.paymentDetailFinal.state = new stateDTO(1);
              this.paymentDetail+='"payment_value": '+(data.cash)+', ';
              this.paymentDetail+='"state": {"state": 1}}]';
            }else{
              this.paymentDetailFinal.payment_value = (data.cash-data.cambio)
              this.paymentDetailFinal.state = new stateDTO(1);
              this.paymentDetail+='"payment_value": '+(data.cash-data.cambio)+', ';
              this.paymentDetail+='"state": {"state": 1}}]';
            }

          }


          CPrint("THIS IS BILL DTO V2: ", JSON.stringify({idthirdemployee:this.billDTO.id_third,
            idthird:this.billDTO.id_third_employee,
            idbilltype:this.billDTO.id_bill_type,
            notes:this.billDTO.documentDTO.body,
            idthirddestinity:this.billDTO.id_third_destiny,
            idcaja:this.locStorage.getIdCaja(),
            idstore:this.locStorage.getIdStore(),
            idthirddomiciliario:this.selectedDomi,
            idpaymentmethod:this.paymentDetailFinal.id_payment_method,
            idwaytopay:this.paymentDetailFinal.id_way_to_pay,
            approvalcode:this.paymentDetailFinal.aprobation_code,
            idbankentity:1,
            idbillstate:1,
            details:detailList.substring(0, detailList.length - 1),
            disccount: this.disccount,
            num_documento_factura: "0"}));

            if(this.locStorage.getOnline()){
          this.http2.post(Urlbase.facturacion+"/billing/v2",{idthirdemployee:this.billDTO.id_third,
            idthird:this.billDTO.id_third_employee,
            idbilltype:this.billDTO.id_bill_type,
            notes:this.billDTO.documentDTO.body,
            idthirddestinity:this.billDTO.id_third_destiny,
            idcaja:this.locStorage.getIdCaja(),
            idstore:this.locStorage.getIdStore(),
            idthirddomiciliario:this.selectedDomi,
            idpaymentmethod:this.paymentDetailFinal.id_payment_method,
            idwaytopay:this.paymentDetailFinal.id_way_to_pay,
            approvalcode:this.paymentDetailFinal.aprobation_code,
            idbankentity:1,
            idbillstate:1,
            details:detailList.substring(0, detailList.length - 1),
            disccount: this.disccount,
            num_documento_factura: "0",
            idthirdvendedor: this.selectedVendor}).subscribe(idBill => {

              if(idBill>0){
                if(data.list && data.list!=null && data.list != undefined && data.list.length>0){
                  this.http.post(Urlbase.facturacion+"/billing/registrar_primer_pago?idBill="+idBill+"&valor="+data.cash,{},{}).subscribe(element => {
                    console.log("IT WORKED: ABC: "+element)
                  })
                  this.sendPaymentDetails(data.list,idBill);
                }
                this.getInventoryList(this.locStorage.getIdStore(),false);
                this.applyFilter(this.prodcode);
                this.locStorage.increaseBills();
                this.http.get(Urlbase.facturacion+"/billing/validatePdfDrawing?idbill="+idBill).subscribe(element => {

                  if(element>0){

              if(pdf){

                let size = false;
                if(this.sizeList.includes(this.locStorage.getIdStore())){
                  size = true;
                }

                  this.http2.get(Urlbase.facturacion+"/billing/UniversalPDF?id_bill="+idBill+"&pdf=0&cash="+cash+"&size="+size,{responseType: 'text'}).subscribe(response =>{
                    //-----------------------------------------------------------------------------------------------------------------
                    window.open(Urlbase.facturas+"/"+response, "_blank");
                    clearTimeout(elTimer);
                    this.showNotification('top', 'center', 3, "<h3>Se ha realizado el movimento <b>CORRECTAMENTE</b></h3> ", 'info');
                    //CPrint("MY STUFF: "+Urlbase.cierreCaja+"/close/alertForEmail?id_caja="+this.locStorage.getIdCaja()+"&id_third="+this.locStorage.getThird().id_third);
                    //this.http2.get(Urlbase.cierreCaja+"/close/alertForEmail?id_caja="+this.locStorage.getIdCaja()+"&id_third="+this.locStorage.getThird().id_third).subscribe(data => {
                      //@ts-ignore
                      //CPrint(data);00000000
                      setTimeout(() => {


                        this.quickconfirm=false;
                        this.mostrandoCargando = false;
                        this.cancel();

                        this.elementRef.nativeElement.focus();
                        this.elementRef.nativeElement.select();

                      }, 100);
                  //});
                  });
              }{
               // this.http2.get(Urlbase.cierreCaja+"/close/alertForEmail?id_caja="+this.locStorage.getIdCaja()+"&id_third="+this.locStorage.getThird().id_third).subscribe(data => {
                  //@ts-ignore
                 // CPrint(data);

                setTimeout(() => {
                  clearTimeout(elTimer);
                  this.quickconfirm=false;
                  this.mostrandoCargando = false;
                  this.cancel();

                  this.elementRef.nativeElement.focus();
                  this.elementRef.nativeElement.select();
                  this.showNotification('top', 'center', 3, "<h3>Se ha realizado el movimento <b>CORRECTAMENTE</b></h3> ", 'info');


                }, 100);
                //})
            }}else{

              this.showNotification('top', 'center', 3, "<h3>Error. No se pudo generar la factura, porque el inventario está agotado.</h3> ", 'danger');
              this.quickconfirm=false;
              this.mostrandoCargando = false;
              this.productsObject = [];
              this.dataSourceProductosSeleccionados = new MatTableDataSourceWithCustomSort(this.productsObject);
              this.dataSourceProductosSeleccionados.sort = this.sort;
              this.elementRef.nativeElement.focus();
              this.elementRef.nativeElement.select();

            }
          });}else{
              if(idBill == -2){

                this.showNotification('top', 'center', 3, "<h3>No se puede crear factura con caja Cerrada.</h3> ", 'danger');
                this.mostrandoCargando = false;
                this.quickconfirm = false;
                }else{
                this.showNotification('top', 'center', 3, "<h3>Se presento un error al crear la factura</h3> ", 'danger');
                this.mostrandoCargando = false;
                this.quickconfirm = false;
                }
              }
            })}else{
              this.locStorage.pushBillOffline({idthirdemployee:this.billDTO.id_third,
                idthird:this.billDTO.id_third_employee,
                idbilltype:this.billDTO.id_bill_type,
                notes:this.billDTO.documentDTO.body,
                idthirddestinity:this.billDTO.id_third_destiny,
                idcaja:this.locStorage.getIdCaja(),
                idstore:this.locStorage.getIdStore(),
                idthirddomiciliario:this.selectedDomi,
                idpaymentmethod:this.paymentDetailFinal.id_payment_method,
                idwaytopay:this.paymentDetailFinal.id_way_to_pay,
                approvalcode:this.paymentDetailFinal.aprobation_code,
                idbankentity:1,
                idbillstate:1,
                details:detailList.substring(0, detailList.length - 1),
                disccount: this.disccount});
                this.locStorage.pushDateOfflineBills(new Date());
                setTimeout(() => {
                  CPrint("TENGO PDF PAPoH");

                if(pdf){
                  CPrint("TENGO PDF PAPEH");
                  this.GeneratePdfFast({idthirdemployee:this.billDTO.id_third,
                    idthird:this.billDTO.id_third_employee,
                    idbilltype:this.billDTO.id_bill_type,
                    notes:this.billDTO.documentDTO.body,
                    idthirddestinity:this.billDTO.id_third_destiny,
                    idcaja:this.locStorage.getIdCaja(),
                    idstore:this.locStorage.getIdStore(),
                    idthirddomiciliario:this.selectedDomi,
                    idpaymentmethod:this.paymentDetailFinal.id_payment_method,
                    idwaytopay:this.paymentDetailFinal.id_way_to_pay,
                    approvalcode:this.paymentDetailFinal.aprobation_code,
                    idbankentity:1,
                    idbillstate:1,
                    details:detailList.substring(0, detailList.length - 1),
                    disccount: this.disccount});}
                  clearTimeout(elTimer);

                  this.removeDetailsOffline(detailList);

                  this.quickconfirm=false;
                  this.mostrandoCargando = false;
                  this.cancel();

                  this.elementRef.nativeElement.focus();
                  this.elementRef.nativeElement.select();
                  this.showNotification('top', 'center', 3, "<h3>Se ha realizado el movimento <b>CORRECTAMENTE</b> OFFLINE</h3> ", 'info');

                }, 100);
            }
        }else{
          clearTimeout(elTimer);
          this.checker = true;
          this.quickconfirm=false;
          this.cancel();
          this.showNotification('top', 'center', 3, "<h3> Intentaste agregar un producto con cantidad en <b>CERO</b> a la factura, para agregarlo al carrito, tiene que tener cantidad en 1</h3> ", 'danger');
        }
      }else{
        CPrint("ENTRE - NO PERSON");
        this.billDTO.id_store = this.locStorage.getIdStore();
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

        if (detailList.length > 0 && this.checker) {
          let ID_BILL_TYPE= this.form.value['isRemission']?107:1;
          this.billDTO.id_third_employee = this.token.id_third_father;
          this.billDTO.id_third = this.token.id_third;
          this.billDTO.id_bill_type = 1;
          //instanciar de acuerdo a por remision
          this.billDTO.id_bill_state = 1;
          this.billDTO.purchase_date = new Date();
          this.billDTO.subtotal = Math.floor(this.calculateSubtotal()* 100) / 100;
          this.billDTO.tax = Math.floor(this.calculateTax()* 100) / 100;
          this.billDTO.totalprice = Math.floor(this.calculateTotal()* 100) / 100;
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
              this.paymentDetailFinal.aprobation_code = "";
              this.paymentDetailFinal.id_payment_method = 1;
            }
            if(data.paymentMethod == "debito"){
              this.paymentDetail+='"id_payment_method": 2, ';
              this.paymentDetail+='"aprobation_code": "'+data.transactionCode+'", ';
              // this.paymentDetail+='"id_bank_entity": '+Number(data.creditBank)+', ';
              this.paymentDetailFinal.aprobation_code = data.transactionCode;
              this.paymentDetailFinal.id_payment_method = 2;
            }
            if(data.paymentMethod == "credito"){
              this.paymentDetail+='"id_payment_method": 3, ';
              this.paymentDetail+='"aprobation_code": "'+data.transactionCode+'", ';
              // this.paymentDetail+='"id_bank_entity": '+Number(data.creditBank)+', ';
              this.paymentDetailFinal.aprobation_code = data.transactionCode;
              this.paymentDetailFinal.id_payment_method = 3;
            }
            if(data.paymentMethod == "transferencia"){
              this.paymentDetail+='"id_payment_method": 4, ';
              this.paymentDetail+='"aprobation_code": "'+data.transactionCode+'", ';
              // this.paymentDetail+='"id_bank_entity": '+Number(data.creditBank)+', ';
              this.paymentDetailFinal.aprobation_code = data.transactionCode;
              this.paymentDetailFinal.id_payment_method = 4;
            }


            if(data.wayToPay == "contado"){
              this.paymentDetail+='"id_way_to_pay": 1, ';
              this.paymentDetailFinal.id_way_to_pay=1;
            }

            if(data.wayToPay == "credito"){
              this.paymentDetail+='"id_way_to_pay": 2, ';
              this.paymentDetailFinal.id_way_to_pay=2;
            }

            if(data.list && data.list!=null && data.list != undefined && data.list.length>0){
              this.paymentDetailFinal.payment_value = (data.cash)
              this.paymentDetailFinal.state = new stateDTO(1);
              this.paymentDetail+='"payment_value": '+(data.cash)+', ';
              this.paymentDetail+='"state": {"state": 1}}]';
            }else{
              this.paymentDetailFinal.payment_value = (data.cash-data.cambio)
              this.paymentDetailFinal.state = new stateDTO(1);
              this.paymentDetail+='"payment_value": '+(data.cash-data.cambio)+', ';
              this.paymentDetail+='"state": {"state": 1}}]';
            }
          }
          CPrint("THIS IS BILL DTO V2: ", JSON.stringify({idthirdemployee:this.billDTO.id_third,
            idthird:this.billDTO.id_third_employee,
            idbilltype:this.billDTO.id_bill_type,
            notes:this.billDTO.documentDTO.body,
            idthirddestinity:this.billDTO.id_third_destiny,
            idcaja:this.locStorage.getIdCaja(),
            idstore:this.locStorage.getIdStore(),
            idthirddomiciliario:this.selectedDomi,
            idpaymentmethod:this.paymentDetailFinal.id_payment_method,
            idwaytopay:this.paymentDetailFinal.id_way_to_pay,
            approvalcode:this.paymentDetailFinal.aprobation_code,
            idbankentity:1,
            idbillstate:1,
            details:detailList.substring(0, detailList.length - 1),
            disccount: this.disccount,
            num_documento_factura: ""}));

            if(this.locStorage.getOnline()){
          this.http2.post(Urlbase.facturacion+"/billing/v2",{idthirdemployee:this.billDTO.id_third,
            idthird:this.billDTO.id_third_employee,
            idbilltype:this.billDTO.id_bill_type,
            notes:this.billDTO.documentDTO.body,
            idthirddestinity:this.billDTO.id_third_destiny,
            idcaja:this.locStorage.getIdCaja(),
            idstore:this.locStorage.getIdStore(),
            idthirddomiciliario:this.selectedDomi,
            idpaymentmethod:this.paymentDetailFinal.id_payment_method,
            idwaytopay:this.paymentDetailFinal.id_way_to_pay,
            approvalcode:this.paymentDetailFinal.aprobation_code,
            idbankentity:1,
            idbillstate:1,
            details:detailList.substring(0, detailList.length - 1),
            disccount: this.disccount,
            num_documento_factura: "0",
            idthirdvendedor: this.selectedVendor}).subscribe(idBill => {
              if(idBill>0){
                if(data.list && data.list!=null && data.list != undefined && data.list.length>0){
                  this.http.post(Urlbase.facturacion+"/billing/registrar_primer_pago?idBill="+idBill+"&valor="+data.cash,{},{}).subscribe(element => {
                    console.log("IT WORKED: ABC: "+element)
                  })
                  this.sendPaymentDetails(data.list,idBill);
                }
                console.log("IM INSIDE DUUUUDE")
                this.getInventoryList(this.locStorage.getIdStore(),false);
                this.applyFilter(this.prodcode);
                this.locStorage.increaseBills();

                this.http.get(Urlbase.facturacion+"/billing/validatePdfDrawing?idbill="+idBill).subscribe(element => {
                  if(element>0){
                if(pdf){

                  let size = false;
                  if(this.sizeList.includes(this.locStorage.getIdStore())){
                    size = true;
                  }

                  this.http2.get(Urlbase.facturacion+"/billing/UniversalPDF?id_bill="+idBill+"&pdf=0&cash="+cash+"&size="+size,{responseType: 'text'}).subscribe(response =>{

                      //-----------------------------------------------------------------------------------------------------------------
                      window.open(Urlbase.facturas+"/"+response, "_blank");
                      clearTimeout(elTimer);
                      this.showNotification('top', 'center', 3, "<h3>Se ha realizado el movimento <b>CORRECTAMENTE</b></h3> ", 'info');
                      //this.http2.get(Urlbase.cierreCaja+"/close/alertForEmail?id_caja="+this.locStorage.getIdCaja()+"&id_third="+this.locStorage.getThird().id_third).subscribe(data => {
                        //@ts-ignore
                        //CPrint(data);
                        setTimeout(() => {
                          this.quickconfirm=false;
                          this.mostrandoCargando = false;
                          this.cancel();

                          this.elementRef.nativeElement.focus();
                          this.elementRef.nativeElement.select();

                        }, 100);
                    });

                }else{
                  //this.http2.get(Urlbase.cierreCaja+"/close/alertForEmail?id_caja="+this.locStorage.getIdCaja()+"&id_third="+this.locStorage.getThird().id_third).subscribe(data => {
                    //@ts-ignore
                    //CPrint(data);

                  setTimeout(() => {
                    clearTimeout(elTimer);
                    this.quickconfirm=false;
                    this.mostrandoCargando = false;
                    this.cancel();

                    this.elementRef.nativeElement.focus();
                    this.elementRef.nativeElement.select();
                    this.showNotification('top', 'center', 3, "<h3>Se ha realizado el movimento <b>CORRECTAMENTE</b></h3> ", 'info');


                  }, 100);
                  //})
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
          });
          }else{
              if(idBill == -2){

              this.showNotification('top', 'center', 3, "<h3>No se puede crear factura con caja Cerrada.</h3> ", 'danger');
              this.mostrandoCargando = false;
              this.quickconfirm = false;
              }else{
              this.showNotification('top', 'center', 3, "<h3>Se presento un error al crear la factura</h3> ", 'danger');
              this.mostrandoCargando = false;
              this.quickconfirm = false;
              }
            }
          })}else{
            this.locStorage.pushBillOffline({idthirdemployee:this.billDTO.id_third,
              idthird:this.billDTO.id_third_employee,
              idbilltype:this.billDTO.id_bill_type,
              notes:this.billDTO.documentDTO.body,
              idthirddestinity:this.billDTO.id_third_destiny,
              idcaja:this.locStorage.getIdCaja(),
              idstore:this.locStorage.getIdStore(),
              idthirddomiciliario:this.selectedDomi,
              idpaymentmethod:this.paymentDetailFinal.id_payment_method,
              idwaytopay:this.paymentDetailFinal.id_way_to_pay,
              approvalcode:this.paymentDetailFinal.aprobation_code,
              idbankentity:1,
              idbillstate:1,
              details:detailList.substring(0, detailList.length - 1),
              disccount: this.disccount,
              num_documento_factura: "0"});
              this.locStorage.pushDateOfflineBills(new Date());
              setTimeout(() => {
                CPrint("TENGO PDF PAPoH");
                if(pdf){
                  CPrint("TENGO PDF PAPEH");
                  this.GeneratePdfFast({idthirdemployee:this.billDTO.id_third,
                    idthird:this.billDTO.id_third_employee,
                    idbilltype:this.billDTO.id_bill_type,
                    notes:this.billDTO.documentDTO.body,
                    idthirddestinity:this.billDTO.id_third_destiny,
                    idcaja:this.locStorage.getIdCaja(),
                    idstore:this.locStorage.getIdStore(),
                    idthirddomiciliario:this.selectedDomi,
                    idpaymentmethod:this.paymentDetailFinal.id_payment_method,
                    idwaytopay:this.paymentDetailFinal.id_way_to_pay,
                    approvalcode:this.paymentDetailFinal.aprobation_code,
                    idbankentity:1,
                    idbillstate:1,
                    details:detailList.substring(0, detailList.length - 1),
                    disccount: this.disccount});}




                this.removeDetailsOffline(detailList);


                clearTimeout(elTimer);
                this.quickconfirm=false;
                this.mostrandoCargando = false;
                this.cancel();

                this.elementRef.nativeElement.focus();
                this.elementRef.nativeElement.select();
                this.showNotification('top', 'center', 3, "<h3>Se ha realizado el movimento <b>CORRECTAMENTE</b> OFFLINE</h3> ", 'info');


              }, 100);
          }
        }else{
          clearTimeout(elTimer);
          this.cancel();
          this.checker = true;
          this.quickconfirm = false;
          this.showNotification('top', 'center', 3, "<h3> Intentaste agregar un producto con cantidad en <b>CERO</b> a la factura, para agregarlo al carrito, tiene que tener cantidad en 1</h3> ", 'danger');
        }
      }
    }


    removeDetailsOffline(list){
      this.productsObject.forEach((item) =>  {
        let detail = this.inventoryList.find(element =>  item.id_inventory_detail == element.id_INVENTORY_DETAIL )
        detail.quantity = detail.quantity-item.quantity
      });
    }


    quickConfirm(){
      this.quickconfirm = true;
      //  this.save2({clientData:new ClientData(true, 'Cliente Ocasional', ' ', ' ', ' ', ' ', ' ', null),
      //    cambio:0,
      //    wayToPay: "contado",
      //    cash: this.roundnum(this.calculateTotal()),
      //    creditBank: "",
      //    debitBank: "",
      //    observations: "PAGO RAPIDO",
      //    paymentMethod: "efectivo",
      //    transactionCode: " ",},1,1);
      this.sendData({clientData:new ClientData(true, 'Cliente Ocasional', ' ', ' ', ' ', ' ', ' ', null),
        cambio:0,
        wayToPay: "contado",
        cash: this.roundnum(this.calculateTotal()),
        creditBank: "",
        debitBank: "",
        observations: "PAGO RAPIDO",
        paymentMethod: "efectivo",
        transactionCode: " ",},1, false
      )
    }

    quickConfirmPDF(){
      this.quickconfirm = true;
      //  this.save3({clientData:new ClientData(true, 'Cliente Ocasional', ' ', ' ', ' ', ' ', ' ', null),
      //    cambio:0,
      //    wayToPay: "contado",
      //    cash: this.roundnum(this.calculateTotal()),
      //    creditBank: "",
      //    debitBank: "",
      //    observations: "PAGO RAPIDO",
      //    paymentMethod: "efectivo",
      //    transactionCode: " ",},1,1);
      this.sendData({clientData:new ClientData(true, 'Cliente Ocasional', ' ', ' ', ' ', ' ', ' ', null),
        cambio:0,
        wayToPay: "contado",
        cash: this.roundnum(this.calculateTotal()),
        creditBank: "",
        debitBank: "",
        observations: "PAGO RAPIDO",
        paymentMethod: "efectivo",
        transactionCode: " ",},1, true
      )
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

    // services

    async getInventoryList(store,doI){
      this.disableDoubleClickSearch = true;
      this.quickconfirm = true;
      if(doI){
      this.http2.get(Urlbase.facturacion + "/billing/Vendors?idstore="+this.locStorage.getIdStore()).subscribe(data => {
        this.domiList = data;
        CPrint("DOMI DOMI, "+data)
      });}
       this.http2.get(Urlbase.tienda+"/products2/inventoryListActivos?id_store="+this.locStorage.getIdStore()).subscribe(data => {
            CPrint("This is InventoryList: ",data);
            this.PrimeraCarga = false;
            this.inventoryList = data;
            this.disableDoubleClickSearch = false;
            this.quickconfirm = false;
            //@ts-ignore
            this.dataSourceBuscadoProductos = new MatTableDataSource([]);
            //  this.getPriceList();
            this.locStorage.setInventoryList(data);
            setTimeout(() => {

              this.elementRef.nativeElement.focus();
              this.elementRef.nativeElement.select();

              CPrint("THIS IS SOME DATA I HAVE TO CHECK, do i add stuff? ", this.doIAddItems,", and do i have a id bill? ",this.idBillToAdd);
              if(this.locStorage.getDoIMakeRefund()){
                CPrint("ENTRE A LA LISTA REFUND");
                this.http2.get(Urlbase.facturacion+"/billing/detail?id_bill="+this.locStorage.getIdRefund()).subscribe(response => {
                  this.locStorage.setDoIMakeRefund(false);
                  this.locStorage.setIdRefund(0);
                  //@ts-ignore
                  response.forEach(element => {
                    this.addDetail3(element[3],element[0])
                  });
                })
              }
            }, 100);
          },
          (error) =>{
            CPrint(error);
          },
          () => {
            if (this.inventoryList.length > 0) {

            }
          });

    }

    disableDoubleClickSearch = false;

    save(data,disc,isCompra) {
      this.getDomiName();
      if(this.locStorage.getIdStore() == 81){
        this.flag = "1"
      }
      let datos = "";
      if(data.paymentMethod == "efectivo"){
        datos = "Efectivo"
      }
      if(data.paymentMethod == "debito"){
        datos = "Débito"
      }
      if(data.paymentMethod == "credito"){
        datos = "Crédito"
      }
      if(data.paymentMethod == "transferencia"){
        datos = "Transferencia"
      }
      CPrint("this is id person: ",data.id_person);
      if(data.id_person){
        CPrint("ENTRE");
        //@ts-ignore
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
          this.detailBillDTO.price = element.price;
          this.detailBillDTO.tax = this.getPercentTax(element.tax_product)*100;
          this.detailBillDTO.id_product_third = element.id_product_third;
          this.detailBillDTO.tax_product = element.tax_product;
          this.detailBillDTO.state = this.commonStateDTO;
          this.detailBillDTO.quantity = Math.floor(element.quantity);

          if(element.quantity > 0) {
            this.detailBillDTOList.push(this.detailBillDTO);
          }else{
            this.checker = false;
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
        if (this.detailBillDTOList.length > 0 && this.checker) {
          let ID_BILL_TYPE= this.form.value['isRemission']?107:1;
          this.billDTO.id_third_employee = this.token.id_third_father;
          this.billDTO.id_third = this.token.id_third;
          this.billDTO.id_bill_type = 1;
          //instanciar de acuerdo a por remision
          this.billDTO.id_bill_state = 1;
          this.billDTO.purchase_date = new Date();
          this.billDTO.subtotal = this.roundnum(this.calculateSubtotal());
          this.billDTO.tax = this.roundnum(this.calculateTax());
          this.billDTO.totalprice = this.roundnum(this.calculateTotal());
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
              this.paymentDetailFinal.aprobation_code= "";
              this.paymentDetailFinal.id_payment_method=1;
            }
            if(data.paymentMethod == "debito"){
              this.paymentDetail+='"id_payment_method": 2, ';
              this.paymentDetail+='"aprobation_code": "'+data.transactionCode+'", ';
              // this.paymentDetail+='"id_bank_entity": '+Number(data.creditBank)+', ';
              this.paymentDetailFinal.aprobation_code= data.transactionCode;
              this.paymentDetailFinal.id_payment_method=2;
            }
            if(data.paymentMethod == "credito"){
              this.paymentDetail+='"id_payment_method": 3, ';
              this.paymentDetail+='"aprobation_code": "'+data.transactionCode+'", ';
              // this.paymentDetail+='"id_bank_entity": '+Number(data.creditBank)+', ';
              this.paymentDetailFinal.aprobation_code= data.transactionCode;
              this.paymentDetailFinal.id_payment_method=3;
            }
            if(data.paymentMethod == "transferencia"){
              this.paymentDetail+='"id_payment_method": 4, ';
              this.paymentDetail+='"aprobation_code": "'+data.transactionCode+'", ';
              // this.paymentDetail+='"id_bank_entity": '+Number(data.creditBank)+', ';
              this.paymentDetailFinal.aprobation_code = data.transactionCode;
              this.paymentDetailFinal.id_payment_method = 4;
            }


            if(data.wayToPay == "contado"){
              this.paymentDetail+='"id_way_to_pay": 1, ';
              this.paymentDetailFinal.id_way_to_pay = 1;
            }

            if(data.wayToPay == "credito"){
              this.paymentDetail+='"id_way_to_pay": 2, ';
              this.paymentDetailFinal.id_way_to_pay = 2;
            }



            if(data.list && data.list!=null && data.list != undefined && data.list.length>0){
              this.paymentDetailFinal.payment_value = (data.cash)
              this.paymentDetailFinal.state = new stateDTO(1);
              this.paymentDetail+='"payment_value": '+(data.cash)+', ';
              this.paymentDetail+='"state": {"state": 1}}]';
            }else{
              this.paymentDetailFinal.payment_value = (data.cash-data.cambio)
              this.paymentDetailFinal.state = new stateDTO(1);
              this.paymentDetail+='"payment_value": '+(data.cash-data.cambio)+', ';
              this.paymentDetail+='"state": {"state": 1}}]';
            }

          }
          CPrint(JSON.stringify(this.billDTO),"This is Bill DTO");
          this.billingService.postBillResource(this.billDTO, disc)
              .subscribe(
                  result => {

                    this.http2.put(Urlbase.facturacion + "/billing/domiciliario?id_bill="+result+"&id_third="+this.selectedDomi,{}).subscribe(responseItem => {
                      CPrint("THIS IS ITEM, "+responseItem);
                      this.selectedDomi = "-1";
                      CPrint("THIS IS RESULT", result);
                      if (result) {
                        this.http2.post(Urlbase.facturacion+"/billing/procedureup2?idbill="+result,{}).subscribe(resp => {
                          CPrint("THIS IS MY RESP: ",result);
                          this.beginPlusOrDiscount(this.inventoryQuantityDTOList,disc);

                          if(disc==1 || disc==2){

                            try{
                              CPrint("THIS IS THE PAYMENT DETAIL ILL TRY TO EMULATE, ", JSON.parse(this.paymentDetail));
                              CPrint("THIS IS THE PAYMENT DETAIL ILL TRY TO EMULATE 2, ", this.paymentDetailFinal);
                              this.billingService.postPaymentDetail([this.paymentDetailFinal],Number(result)).subscribe(answer =>{
                                    this.paymentDetailFinal = new paymentDetailDTO(1,1,this.calculateTotal()," ",new stateDTO(1));
                                    this.http.get(Urlbase.facturacion+"/billing/validatePdfDrawing?idbill="+result).subscribe(element => {
                                      if(element>0){

                                    this.http2.get(Urlbase.facturacion+"/billing/UniversalPDF?id_bill="+result+"&pdf=0&cash=0&size="+false,{responseType: 'text'}).subscribe(response =>{
                                      //-----------------------------------------------------------------------------------------------------------------
                                      window.open(Urlbase.facturas+"/"+response, "_blank");
                                      this.showNotification('top', 'center', 3, "<h3>Se ha realizado el movimento <b>CORRECTAMENTE</b></h3> ", 'info');
                                       // this.http2.get(Urlbase.cierreCaja+"/close/alertForEmail?id_caja="+this.locStorage.getIdCaja()+"&id_third="+this.locStorage.getThird().id_third).subscribe(data => {
                                          //@ts-ignore
                                         // CPrint(data)
                                        //})
                                      setTimeout(() => {

                                        this.elementRef.nativeElement.focus();
                                        this.elementRef.nativeElement.select();

                                      }, 100);
                                    });}else{

                                      this.showNotification('top', 'center', 3, "<h3>Error. No se pudo generar la factura, porque el inventario está agotado.</h3> ", 'danger');
                                      this.quickconfirm=false;
                                      this.mostrandoCargando = false;
                                      this.productsObject = [];
                                      this.dataSourceProductosSeleccionados = new MatTableDataSourceWithCustomSort(this.productsObject);
                                      this.dataSourceProductosSeleccionados.sort = this.sort;
                                      this.elementRef.nativeElement.focus();
                                      this.elementRef.nativeElement.select();

                                      }
                                      //-----------------------------------------------------------------------------------------------------------------
                                    });

                                    this.paymentDetail = '[{';
                                  const currentSells = localStorage.getItem('sells');
                                  let mySells = '';
                                  const total = this.calculateTotal();
                                  if(currentSells !== 'null'){
                                      mySells = currentSells + ',' + String(total)
                                    }else{
                                      mySells = String(total)
                                    }
                                    localStorage.setItem("sells",mySells);
                                    CPrint(localStorage.getItem("sells"))
                                  },
                                  error => {
                                    this.showNotification('top', 'center', 3, "<h3>El movimento presento <b>PROBLEMAS</b></h3> ", 'danger')

                                  });

                            }catch{
                              this.showNotification('top', 'center', 3, "<h3>El movimento presento <b>PROBLEMAS</b></h3> ", 'danger')
                            }



                          }
                          this.paymentDetail = '[{';
                          this.paymentDetailFinal = new paymentDetailDTO(1,1,this.calculateTotal()," ",new stateDTO(1));
                        })
                      }
                    })
                  });
        }else{
          this.checker = true;
          this.quickconfirm=false;
          this.showNotification('top', 'center', 3, "<h3> Intentaste agregar un producto con cantidad en <b>CERO</b> a la factura, para agregarlo al carrito, tiene que tener cantidad en 1</h3> ", 'danger');
        }
      }else{
        this.billDTO.id_store = this.locStorage.getIdStore();
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
          this.detailBillDTO.price = element.price;
          this.detailBillDTO.tax = this.getPercentTax(element.tax_product)*100;
          this.detailBillDTO.id_product_third = element.id_product_third;
          this.detailBillDTO.tax_product = element.tax_product;
          this.detailBillDTO.state = this.commonStateDTO;
          this.detailBillDTO.quantity = Math.floor(element.quantity);

          if(element.quantity > 0) {
            this.detailBillDTOList.push(this.detailBillDTO);
          }else{
           this.checker = false;
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

        if (this.detailBillDTOList.length > 0 && this.checker) {
          let ID_BILL_TYPE= this.form.value['isRemission']?107:1;
          this.billDTO.id_third_employee = this.token.id_third_father;
          this.billDTO.id_third = this.token.id_third;
          this.billDTO.id_bill_type = 1;
          //instanciar de acuerdo a por remision
          this.billDTO.id_bill_state = 1;
          this.billDTO.purchase_date = new Date();
          this.billDTO.subtotal = Math.floor(this.calculateSubtotal()* 100) / 100;
          this.billDTO.tax = Math.floor(this.calculateTax()* 100) / 100;
          this.billDTO.totalprice = Math.floor(this.calculateTotal()* 100) / 100;
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
              this.paymentDetailFinal.aprobation_code = "";
              this.paymentDetailFinal.id_payment_method = 1;
            }
            if(data.paymentMethod == "debito"){
              this.paymentDetail+='"id_payment_method": 2, ';
              this.paymentDetail+='"aprobation_code": "'+data.transactionCode+'", ';
              // this.paymentDetail+='"id_bank_entity": '+Number(data.creditBank)+', ';
              this.paymentDetailFinal.aprobation_code = data.transactionCode;
              this.paymentDetailFinal.id_payment_method = 2;
            }
            if(data.paymentMethod == "credito"){
              this.paymentDetail+='"id_payment_method": 3, ';
              this.paymentDetail+='"aprobation_code": "'+data.transactionCode+'", ';
              // this.paymentDetail+='"id_bank_entity": '+Number(data.creditBank)+', ';
              this.paymentDetailFinal.aprobation_code = data.transactionCode;
              this.paymentDetailFinal.id_payment_method = 3;
            }
            if(data.paymentMethod == "transferencia"){
              this.paymentDetail+='"id_payment_method": 4, ';
              this.paymentDetail+='"aprobation_code": "'+data.transactionCode+'", ';
              // this.paymentDetail+='"id_bank_entity": '+Number(data.creditBank)+', ';
              this.paymentDetailFinal.aprobation_code = data.transactionCode;
              this.paymentDetailFinal.id_payment_method = 4;
            }


            if(data.wayToPay == "contado"){
              this.paymentDetail+='"id_way_to_pay": 1, ';
              this.paymentDetailFinal.id_way_to_pay=1;
            }

            if(data.wayToPay == "credito"){
              this.paymentDetail+='"id_way_to_pay": 2, ';
              this.paymentDetailFinal.id_way_to_pay=2;
            }


            if(data.list && data.list!=null && data.list != undefined && data.list.length>0){
              this.paymentDetailFinal.payment_value = (data.cash)
              this.paymentDetailFinal.state = new stateDTO(1);
              this.paymentDetail+='"payment_value": '+(data.cash)+', ';
              this.paymentDetail+='"state": {"state": 1}}]';
            }else{
              this.paymentDetailFinal.payment_value = (data.cash-data.cambio)
              this.paymentDetailFinal.state = new stateDTO(1);
              this.paymentDetail+='"payment_value": '+(data.cash-data.cambio)+', ';
              this.paymentDetail+='"state": {"state": 1}}]';
            }

          }
          CPrint(JSON.stringify(this.billDTO),"This is Bill DTO");
          this.billingService.postBillResource(this.billDTO, disc)
              .subscribe(
                  result => {
                    this.http2.put(Urlbase.facturacion + "/billing/domiciliario?id_bill="+result+"&id_third="+this.selectedDomi,{}).subscribe(responseItem => {
                      CPrint("THIS IS ITEM, "+responseItem);
                      this.selectedDomi = "-1";

                    CPrint("THIS IS RESULT", result);

                    if (result) {
                      this.http2.post(Urlbase.facturacion+"/billing/procedureup2?idbill="+result,{}).subscribe(resp => {
                        CPrint("THIS IS MY RESP: ",result);
                        CPrint("this is bull DTO",JSON.stringify(this.billDTO));
                        this.beginPlusOrDiscount(this.inventoryQuantityDTOList,disc);
                        CPrint("THIS IS THE PAYMENT DETAIL ILL TRY TO EMULATE, ", JSON.parse(this.paymentDetail));
                        CPrint("THIS IS THE PAYMENT DETAIL ILL TRY TO EMULATE2, ", this.paymentDetailFinal);


                        if(disc==1 || disc==2){

                          try{
                            CPrint("THIS IS THE PAYMENT DETAIL ILL TRY TO EMULATE, ", JSON.parse(this.paymentDetail));
                            CPrint("THIS IS THE PAYMENT DETAIL ILL TRY TO EMULATE 2, ", this.paymentDetailFinal);
                            this.billingService.postPaymentDetail([this.paymentDetailFinal],Number(result)).subscribe(answer =>{
                                  this.paymentDetailFinal = new paymentDetailDTO(1,1,this.calculateTotal()," ",new stateDTO(1));
                                  this.http.get(Urlbase.facturacion+"/billing/validatePdfDrawing?idbill="+result).subscribe(element => {
                                    if(element>0){
                                  this.http2.get(Urlbase.facturacion+"/billing/UniversalPDF?id_bill="+result+"&pdf=0&cash=0&size="+false,{responseType: 'text'}).subscribe(response =>{
                                    //-----------------------------------------------------------------------------------------------------------------
                                    window.open(Urlbase.facturas+"/"+response, "_blank");
                                    this.showNotification('top', 'center', 3, "<h3>Se ha realizado el movimento <b>CORRECTAMENTE</b></h3> ", 'info');
                                      //this.http2.get(Urlbase.cierreCaja+"/close/alertForEmail?id_caja="+this.locStorage.getIdCaja()+"&id_third="+this.locStorage.getThird().id_third).subscribe(data => {
                                        //@ts-ignore
                                        //CPrint(data)
                                      //})
                                    setTimeout(() => {

                                      this.elementRef.nativeElement.focus();
                                      this.elementRef.nativeElement.select();

                                    }, 100);
                                  });}else{

                                    this.showNotification('top', 'center', 3, "<h3>Error. No se pudo generar la factura, porque el inventario está agotado.</h3> ", 'danger');
                                    this.quickconfirm=false;
                                    this.mostrandoCargando = false;
                                    this.productsObject = [];
                                    this.dataSourceProductosSeleccionados = new MatTableDataSourceWithCustomSort(this.productsObject);
                                    this.dataSourceProductosSeleccionados.sort = this.sort;
                                    this.elementRef.nativeElement.focus();
                                    this.elementRef.nativeElement.select();

                                  }
                                    //-----------------------------------------------------------------------------------------------------------------
                                  });

                                  this.paymentDetail = '[{';
                                const currentSells = localStorage.getItem('sells');
                                let mySells = '';
                                const total = this.calculateTotal();
                                if(currentSells !== 'null'){
                                    mySells = currentSells + ',' + String(total)
                                  }else{
                                    mySells = String(total)
                                  }
                                  localStorage.setItem("sells",mySells);
                                  CPrint(localStorage.getItem("sells"))
                                },
                                error => {
                                  this.showNotification('top', 'center', 3, "<h3>El movimento presento <b>PROBLEMAS</b></h3> ", 'danger')

                                }
                            );

                          }catch{
                            this.showNotification('top', 'center', 3, "<h3>El movimento presento <b>PROBLEMAS</b></h3> ", 'danger')
                          }



                        }
                        this.paymentDetail = '[{';

                        this.paymentDetailFinal = new paymentDetailDTO(1,1,this.calculateTotal()," ",new stateDTO(1));
                      })
                    }
                  })
                  },
                  error => {
                    this.showNotification('top', 'center', 3, "<h3>El movimento presento <b>PROBLEMAS</b></h3> ", 'danger')

                  });


        }else{

          this.checker = true;
          this.quickconfirm=false;
          this.showNotification('top', 'center', 3, "<h3> Intentaste agregar un producto con cantidad en <b>CERO</b> a la factura, para agregarlo al carrito, tiene que tener cantidad en 1</h3> ", 'danger');
        }
      }

    }


    save2(data,disc,isCompra) {
      this.getDomiName();
      if(this.locStorage.getIdStore() == 81){
        this.flag = "1"
      }
      let datos = "";
      if(data.paymentMethod == "efectivo"){
        datos = "Efectivo"
      }
      if(data.paymentMethod == "debito"){
        datos = "Débito"
      }
      if(data.paymentMethod == "credito"){
        datos = "Crédito"
      }
      if(data.paymentMethod == "transferencia"){
        datos = "Transferencia"
      }
      CPrint("this is id person: ",data.id_person);
      if(data.id_person){
        CPrint("ENTRE");
        //@ts-ignore
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
          this.detailBillDTO.price = element.price;
          this.detailBillDTO.tax = this.getPercentTax(element.tax_product)*100;
          this.detailBillDTO.id_product_third = element.id_product_third;
          this.detailBillDTO.tax_product = element.tax_product;
          this.detailBillDTO.state = this.commonStateDTO;
          this.detailBillDTO.quantity = Math.floor(element.quantity);

          if(element.quantity > 0) {
            this.detailBillDTOList.push(this.detailBillDTO);
          }else{
            this.checker = false;
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
        if (this.detailBillDTOList.length > 0 && this.checker) {
          let ID_BILL_TYPE= this.form.value['isRemission']?107:1;
          this.billDTO.id_third_employee = this.token.id_third_father;
          this.billDTO.id_third = this.token.id_third;
          this.billDTO.id_bill_type = 1;
          //instanciar de acuerdo a por remision
          this.billDTO.id_bill_state = 1;
          this.billDTO.purchase_date = new Date();
          this.billDTO.subtotal = this.roundnum(this.calculateSubtotal());
          this.billDTO.tax = this.roundnum(this.calculateTax());
          this.billDTO.totalprice = this.roundnum(this.calculateTotal());
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

            if(data.paymentMethod == "transferencia"){
              this.paymentDetail+='"id_payment_method": 4, ';
              this.paymentDetail+='"aprobation_code": "'+data.transactionCode+'", ';
              // this.paymentDetail+='"id_bank_entity": '+Number(data.creditBank)+', ';
              this.paymentDetailFinal.aprobation_code = data.transactionCode;
              this.paymentDetailFinal.id_payment_method = 4;
            }

            if(data.wayToPay == "contado"){
              this.paymentDetail+='"id_way_to_pay": 1, ';
              this.paymentDetailFinal.id_way_to_pay=1;

            }

            if(data.wayToPay == "credito"){
              this.paymentDetail+='"id_way_to_pay": 2, ';
              this.paymentDetailFinal.id_way_to_pay=2;
            }


            if(data.list && data.list!=null && data.list != undefined && data.list.length>0){
              this.paymentDetailFinal.payment_value = (data.cash)
              this.paymentDetailFinal.state = new stateDTO(1);
              this.paymentDetail+='"payment_value": '+(data.cash)+', ';
              this.paymentDetail+='"state": {"state": 1}}]';
            }else{
              this.paymentDetailFinal.payment_value = (data.cash-data.cambio)
              this.paymentDetailFinal.state = new stateDTO(1);
              this.paymentDetail+='"payment_value": '+(data.cash-data.cambio)+', ';
              this.paymentDetail+='"state": {"state": 1}}]';
            }

          }
          CPrint(JSON.stringify(this.billDTO),"This is Bill DTO");
          this.billingService.postBillResource(this.billDTO, disc)
              .subscribe(
                  result => {


                    this.http2.put(Urlbase.facturacion + "/billing/domiciliario?id_bill="+result+"&id_third="+this.selectedDomi,{}).subscribe(responseItem => {
                      CPrint("THIS IS ITEM, "+responseItem);
                      this.selectedDomi = "-1";

                    CPrint("THIS IS RESULT", result);

                    if (result) {
                      this.http2.post(Urlbase.facturacion+"/billing/procedureup2?idbill="+result,{}).subscribe(resp => {
                        CPrint("THIS IS MY RESP: ",result);
                        this.beginPlusOrDiscount(this.inventoryQuantityDTOList,disc);

                        if(disc==1 || disc==2){

                          try{
                            CPrint("THIS IS THE PAYMENT DETAIL ILL TRY TO EMULATE, ", JSON.parse(this.paymentDetail));
                            CPrint("THIS IS THE PAYMENT DETAIL ILL TRY TO EMULATE 2, ", this.paymentDetailFinal);
                            this.billingService.postPaymentDetail([this.paymentDetailFinal],Number(result)).subscribe(answer =>{
                                  this.paymentDetailFinal = new paymentDetailDTO(1,1,this.calculateTotal()," ",new stateDTO(1));

                                  this.http.get(Urlbase.facturacion+"/billing/validatePdfDrawing?idbill="+result).subscribe(element => {
                                    if(element>0){
                                  this.http2.get(Urlbase.facturacion+"/billing/UniversalPDF?id_bill="+result+"&pdf=0&cash=0&size="+false,{responseType: 'text'}).subscribe(response =>{
                                    //-----------------------------------------------------------------------------------------------------------------
                                    this.quickconfirm = false;
                                    //window.open(Urlbase.facturas+"/"+response, "_blank");
                                    this.showNotification('top', 'center', 3, "<h3>Se ha realizado el movimento <b>CORRECTAMENTE</b></h3> ", 'info');
                                      //this.http2.get(Urlbase.cierreCaja+"/close/alertForEmail?id_caja="+this.locStorage.getIdCaja()+"&id_third="+this.locStorage.getThird().id_third).subscribe(data => {
                                        //@ts-ignore
                                        //CPrint(data)
                                      //})
                                    setTimeout(() => {

                                      this.elementRef.nativeElement.focus();
                                      this.elementRef.nativeElement.select();

                                    }, 100);
                                  });}else{

                                    this.showNotification('top', 'center', 3, "<h3>Error. No se pudo generar la factura, porque el inventario está agotado.</h3> ", 'danger');
                                    this.quickconfirm=false;
                                    this.mostrandoCargando = false;
                                    this.productsObject = [];
                                    this.dataSourceProductosSeleccionados = new MatTableDataSourceWithCustomSort(this.productsObject);
                                    this.dataSourceProductosSeleccionados.sort = this.sort;
                                    this.elementRef.nativeElement.focus();
                                    this.elementRef.nativeElement.select();

                                  }
                                    //-----------------------------------------------------------------------------------------------------------------
                                  });

                                  this.paymentDetail = '[{';
                                const currentSells = localStorage.getItem('sells');
                                let mySells = '';
                                const total = this.calculateTotal();
                                if(currentSells !== 'null'){
                                    mySells = currentSells + ',' + String(total)
                                  }else{
                                    mySells = String(total)
                                  }
                                  localStorage.setItem("sells",mySells);
                                  CPrint(localStorage.getItem("sells"))
                                },
                                error => {
                                  this.showNotification('top', 'center', 3, "<h3>El movimento presento <b>PROBLEMAS</b></h3> ", 'danger')

                                });

                          }catch{
                            this.showNotification('top', 'center', 3, "<h3>El movimento presento <b>PROBLEMAS</b></h3> ", 'danger')
                          }



                        }

                        this.paymentDetailFinal = new paymentDetailDTO(1,1,this.calculateTotal()," ", new stateDTO(1));
                        this.paymentDetail = '[{';
                      });
                    }
                  })
                  });


        }else{
          this.checker = true;
          this.quickconfirm=false;
          this.showNotification('top', 'center', 3, "<h3> Intentaste agregar un producto con cantidad en <b>CERO</b> a la factura, para agregarlo al carrito, tiene que tener cantidad en 1</h3> ", 'danger');

        }
      }else{
        this.billDTO.id_store = this.locStorage.getIdStore();
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
          this.detailBillDTO.price = element.price;
          this.detailBillDTO.tax = this.getPercentTax(element.tax_product)*100;
          this.detailBillDTO.id_product_third = element.id_product_third;
          this.detailBillDTO.tax_product = element.tax_product;
          this.detailBillDTO.state = this.commonStateDTO;
          this.detailBillDTO.quantity = Math.floor(element.quantity);

          if(element.quantity > 0) {
            this.detailBillDTOList.push(this.detailBillDTO);
          }else{
            this.checker = false;
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

        if (this.detailBillDTOList.length > 0 && this.checker) {
          let ID_BILL_TYPE= this.form.value['isRemission']?107:1;
          this.billDTO.id_third_employee = this.token.id_third_father;
          this.billDTO.id_third = this.token.id_third;
          this.billDTO.id_bill_type = 1;
          //instanciar de acuerdo a por remision
          this.billDTO.id_bill_state = 1;
          this.billDTO.purchase_date = new Date();
          this.billDTO.subtotal = Math.floor(this.calculateSubtotal()* 100) / 100;
          this.billDTO.tax = Math.floor(this.calculateTax()* 100) / 100;
          this.billDTO.totalprice = Math.floor(this.calculateTotal()* 100) / 100;
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
            if(data.paymentMethod == "transferencia"){
              this.paymentDetail+='"id_payment_method": 4, ';
              this.paymentDetail+='"aprobation_code": "'+data.transactionCode+'", ';
              // this.paymentDetail+='"id_bank_entity": '+Number(data.creditBank)+', ';
              this.paymentDetailFinal.aprobation_code = data.transactionCode;
              this.paymentDetailFinal.id_payment_method = 4;
            }

            if(data.wayToPay == "contado"){
              this.paymentDetail+='"id_way_to_pay": 1, ';
              this.paymentDetailFinal.id_way_to_pay = 1;
            }

            if(data.wayToPay == "credito"){
              this.paymentDetail+='"id_way_to_pay": 2, ';
              this.paymentDetailFinal.id_way_to_pay = 2;
            }


            if(data.list && data.list!=null && data.list != undefined && data.list.length>0){
              this.paymentDetailFinal.payment_value = (data.cash)
              this.paymentDetailFinal.state = new stateDTO(1);
              this.paymentDetail+='"payment_value": '+(data.cash)+', ';
              this.paymentDetail+='"state": {"state": 1}}]';
            }else{
              this.paymentDetailFinal.payment_value = (data.cash-data.cambio)
              this.paymentDetailFinal.state = new stateDTO(1);
              this.paymentDetail+='"payment_value": '+(data.cash-data.cambio)+', ';
              this.paymentDetail+='"state": {"state": 1}}]';
            }

          }
          CPrint(JSON.stringify(this.billDTO),"This is Bill DTO");
          this.billingService.postBillResource(this.billDTO, disc)
              .subscribe(
                  result => {
                    this.http2.put(Urlbase.facturacion + "/billing/domiciliario?id_bill="+result+"&id_third="+this.selectedDomi,{}).subscribe(responseItem => {
                      CPrint("THIS IS ITEM, "+responseItem);
                      this.selectedDomi = "-1";

                    CPrint("THIS IS RESULT", result);
                    if (result) {
                      this.http2.post(Urlbase.facturacion+"/billing/procedureup2?idbill="+result,{}).subscribe(resp => {
                        CPrint("THIS IS MY RESP: ",result);
                        CPrint("this is bull DTO",JSON.stringify(this.billDTO));
                        this.beginPlusOrDiscount(this.inventoryQuantityDTOList,disc);


                        if(disc==1 || disc==2){

                          try{
                            CPrint("THIS IS THE PAYMENT DETAIL ILL TRY TO EMULATE, ", JSON.parse(this.paymentDetail));
                            CPrint("THIS IS THE PAYMENT DETAIL ILL TRY TO EMULATE 2, ", this.paymentDetailFinal);
                            this.billingService.postPaymentDetail([this.paymentDetailFinal],Number(result)).subscribe(answer =>{
                                  this.paymentDetailFinal = new paymentDetailDTO(1,1,this.calculateTotal()," ",new stateDTO(1));

                                  this.http.get(Urlbase.facturacion+"/billing/validatePdfDrawing?idbill="+result).subscribe(element => {
                                    if(element>0){

                                  this.http2.get(Urlbase.facturacion+"/billing/UniversalPDF?id_bill="+result+"&pdf=0&cash=0&size="+false,{responseType: 'text'}).subscribe(response =>{
                                    //-----------------------------------------------------------------------------------------------------------------
                                    this.quickconfirm = false;
                                    //window.open(Urlbase.facturas+"/"+response, "_blank");
                                    this.showNotification('top', 'center', 3, "<h3>Se ha realizado el movimento <b>CORRECTAMENTE</b></h3> ", 'info');
                                      //this.http2.get(Urlbase.cierreCaja+"/close/alertForEmail?id_caja="+this.locStorage.getIdCaja()+"&id_third="+this.locStorage.getThird().id_third).subscribe(data => {
                                        //@ts-ignore
                                        //CPrint(data);
                                        //CPrint()
                                      //})
                                    setTimeout(() => {

                                      this.elementRef.nativeElement.focus();
                                      this.elementRef.nativeElement.select();

                                    }, 100);
                                  });}else{

                                    this.showNotification('top', 'center', 3, "<h3>Error. No se pudo generar la factura, porque el inventario está agotado.</h3> ", 'danger');
                                    this.quickconfirm=false;
                                    this.mostrandoCargando = false;
                                    this.productsObject = [];
                                    this.dataSourceProductosSeleccionados = new MatTableDataSourceWithCustomSort(this.productsObject);
                                    this.dataSourceProductosSeleccionados.sort = this.sort;
                                    this.elementRef.nativeElement.focus();
                                    this.elementRef.nativeElement.select();

                                  }
                                    //-----------------------------------------------------------------------------------------------------------------
                                  });

                                  this.paymentDetail = '[{';
                                const currentSells = localStorage.getItem('sells');
                                let mySells = '';
                                const total = this.calculateTotal();
                                if(currentSells !== 'null'){
                                    mySells = currentSells + ',' + String(total)
                                  }else{
                                    mySells = String(total)
                                  }
                                  localStorage.setItem("sells",mySells);
                                  CPrint(localStorage.getItem("sells"))
                                },
                                error => {
                                  this.showNotification('top', 'center', 3, "<h3>El movimento presento <b>PROBLEMAS</b></h3> ", 'danger')

                                });

                          }catch{
                            this.showNotification('top', 'center', 3, "<h3>El movimento presento <b>PROBLEMAS</b></h3> ", 'danger')
                          }



                        }
                        this.paymentDetail = '[{';
                        this.paymentDetailFinal = new paymentDetailDTO(1,1,this.calculateTotal()," ", new stateDTO(1));
                      });
                    }
                  })
                  });


        }else{
          this.checker = true;
          this.quickconfirm=false;
          this.showNotification('top', 'center', 3, "<h3> Intentaste agregar un producto con cantidad en <b>CERO</b> a la factura, para agregarlo al carrito, tiene que tener cantidad en 1</h3> ", 'danger');

        }
      }

    }



    save3(data,disc,isCompra) {
      this.getDomiName();
      if(this.locStorage.getIdStore() == 81){
        this.flag = "1"
      }
      let datos = "";
      if(data.paymentMethod == "efectivo"){
        datos = "Efectivo"
      }
      if(data.paymentMethod == "debito"){
        datos = "Débito"
      }
      if(data.paymentMethod == "credito"){
        datos = "Crédito"
      }
      if(data.paymentMethod == "transferencia"){
        datos = "Transferencia"
      }
      CPrint("this is id person: ",data.id_person);
      if(data.id_person){
        CPrint("ENTRE");
        //@ts-ignore
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
          this.detailBillDTO.price = element.price;
          this.detailBillDTO.tax = this.getPercentTax(element.tax_product)*100;
          this.detailBillDTO.id_product_third = element.id_product_third;
          this.detailBillDTO.tax_product = element.tax_product;
          this.detailBillDTO.state = this.commonStateDTO;
          this.detailBillDTO.quantity = Math.floor(element.quantity);

          if(element.quantity > 0) {
            this.detailBillDTOList.push(this.detailBillDTO);
          }else{
            this.checker = false;
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
        if (this.detailBillDTOList.length > 0 && this.checker) {
          let ID_BILL_TYPE= this.form.value['isRemission']?107:1;
          this.billDTO.id_third_employee = this.token.id_third_father;
          this.billDTO.id_third = this.token.id_third;
          this.billDTO.id_bill_type = 1;
          //instanciar de acuerdo a por remision
          this.billDTO.id_bill_state = 1;
          this.billDTO.purchase_date = new Date();
          this.billDTO.subtotal = this.roundnum(this.calculateSubtotal());
          this.billDTO.tax = this.roundnum(this.calculateTax());
          this.billDTO.totalprice = this.roundnum(this.calculateTotal());
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
            if(data.paymentMethod == "transferencia"){
              this.paymentDetail+='"id_payment_method": 4, ';
              this.paymentDetail+='"aprobation_code": "'+data.transactionCode+'", ';
              // this.paymentDetail+='"id_bank_entity": '+Number(data.creditBank)+', ';
              this.paymentDetailFinal.aprobation_code = data.transactionCode;
              this.paymentDetailFinal.id_payment_method = 4;
            }


            if(data.wayToPay == "contado"){
              this.paymentDetail+='"id_way_to_pay": 1, ';
              this.paymentDetailFinal.id_way_to_pay=1;

            }

            if(data.wayToPay == "credito"){
              this.paymentDetail+='"id_way_to_pay": 2, ';
              this.paymentDetailFinal.id_way_to_pay=2;
            }


            if(data.list && data.list!=null && data.list != undefined && data.list.length>0){
              this.paymentDetailFinal.payment_value = (data.cash)
              this.paymentDetailFinal.state = new stateDTO(1);
              this.paymentDetail+='"payment_value": '+(data.cash)+', ';
              this.paymentDetail+='"state": {"state": 1}}]';
            }else{
              this.paymentDetailFinal.payment_value = (data.cash-data.cambio)
              this.paymentDetailFinal.state = new stateDTO(1);
              this.paymentDetail+='"payment_value": '+(data.cash-data.cambio)+', ';
              this.paymentDetail+='"state": {"state": 1}}]';
            }

          }
          CPrint(JSON.stringify(this.billDTO),"This is Bill DTO");
          this.billingService.postBillResource(this.billDTO, disc)
              .subscribe(
                  result => {
                    this.http2.put(Urlbase.facturacion + "/billing/domiciliario?id_bill="+result+"&id_third="+this.selectedDomi,{}).subscribe(responseItem => {
                    CPrint("THIS IS ITEM, "+responseItem);
                    this.selectedDomi = "-1";

                    CPrint("THIS IS RESULT", result);
                    if (result) {
                      this.http2.post(Urlbase.facturacion+"/billing/procedureup2?idbill="+result,{}).subscribe(resp => {
                        CPrint("THIS IS MY RESP: ",result);
                        this.beginPlusOrDiscount(this.inventoryQuantityDTOList,disc);

                        if(disc==1 || disc==2){

                          try{
                            CPrint("THIS IS THE PAYMENT DETAIL ILL TRY TO EMULATE, ", JSON.parse(this.paymentDetail));
                            CPrint("THIS IS THE PAYMENT DETAIL ILL TRY TO EMULATE 2, ", this.paymentDetailFinal);
                            this.billingService.postPaymentDetail([this.paymentDetailFinal],Number(result)).subscribe(answer =>{
                                  this.paymentDetailFinal = new paymentDetailDTO(1,1,this.calculateTotal()," ",new stateDTO(1));

                                  this.http.get(Urlbase.facturacion+"/billing/validatePdfDrawing?idbill="+result).subscribe(element => {
                                    if(element>0){
                                  this.http2.get(Urlbase.facturacion+"/billing/UniversalPDF?id_bill="+result+"&pdf=0&cash=0&size="+false,{responseType: 'text'}).subscribe(response =>{
                                    //-----------------------------------------------------------------------------------------------------------------
                                    this.quickconfirm=false;
                                    window.open(Urlbase.facturas+"/"+response, "_blank");
                                    this.showNotification('top', 'center', 3, "<h3>Se ha realizado el movimento <b>CORRECTAMENTE</b></h3> ", 'info');
                                      //this.http2.get(Urlbase.cierreCaja+"/close/alertForEmail?id_caja="+this.locStorage.getIdCaja()+"&id_third="+this.locStorage.getThird().id_third).subscribe(data => {
                                        //@ts-ignore
                                        //CPrint(data)
                                      //})
                                    setTimeout(() => {

                                      this.elementRef.nativeElement.focus();
                                      this.elementRef.nativeElement.select();

                                    }, 100);
                                  });}else{

                                    this.showNotification('top', 'center', 3, "<h3>Error. No se pudo generar la factura, porque el inventario está agotado.</h3> ", 'danger');
                                    this.quickconfirm=false;
                                    this.mostrandoCargando = false;
                                    this.productsObject = [];
                                    this.dataSourceProductosSeleccionados = new MatTableDataSourceWithCustomSort(this.productsObject);
                                    this.dataSourceProductosSeleccionados.sort = this.sort;
                                    this.elementRef.nativeElement.focus();
                                    this.elementRef.nativeElement.select();

                                  }
                                    //-----------------------------------------------------------------------------------------------------------------
                                  });
                                  this.paymentDetail = '[{';
                                const currentSells = localStorage.getItem('sells');
                                let mySells = '';
                                const total = this.calculateTotal();
                                if(currentSells !== 'null'){
                                    mySells = currentSells + ',' + String(total)
                                  }else{
                                    mySells = String(total)
                                  }
                                  localStorage.setItem("sells",mySells);
                                  CPrint(localStorage.getItem("sells"))
                                },
                                error => {
                                  this.showNotification('top', 'center', 3, "<h3>El movimento presento <b>PROBLEMAS</b></h3> ", 'danger')

                                });

                          }catch{
                            this.showNotification('top', 'center', 3, "<h3>El movimento presento <b>PROBLEMAS</b></h3> ", 'danger')
                          }



                        }

                        this.paymentDetailFinal = new paymentDetailDTO(1,1,this.calculateTotal()," ", new stateDTO(1));
                        this.paymentDetail = '[{';
                      });
                    }
                  })
                  });


        }else{
          this.checker = true;
          this.quickconfirm=false;
          this.showNotification('top', 'center', 3, "<h3> Intentaste agregar un producto con cantidad en <b>CERO</b> a la factura, para agregarlo al carrito, tiene que tener cantidad en 1</h3> ", 'danger');

        }
      }else{
        this.billDTO.id_store = this.locStorage.getIdStore();
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
          this.detailBillDTO.price = element.price;
          this.detailBillDTO.tax = this.getPercentTax(element.tax_product)*100;
          this.detailBillDTO.id_product_third = element.id_product_third;
          this.detailBillDTO.tax_product = element.tax_product;
          this.detailBillDTO.state = this.commonStateDTO;
          this.detailBillDTO.quantity = Math.floor(element.quantity);

          if(element.quantity > 0) {
            this.detailBillDTOList.push(this.detailBillDTO);
          }else{
            this.checker = false;
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

        if (this.detailBillDTOList.length > 0 && this.checker) {
          let ID_BILL_TYPE= this.form.value['isRemission']?107:1;
          this.billDTO.id_third_employee = this.token.id_third_father;
          this.billDTO.id_third = this.token.id_third;
          this.billDTO.id_bill_type = 1;
          //instanciar de acuerdo a por remision
          this.billDTO.id_bill_state = 1;
          this.billDTO.purchase_date = new Date();
          this.billDTO.subtotal = Math.floor(this.calculateSubtotal()* 100) / 100;
          this.billDTO.tax = Math.floor(this.calculateTax()* 100) / 100;
          this.billDTO.totalprice = Math.floor(this.calculateTotal()* 100) / 100;
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
            if(data.paymentMethod == "transferencia"){
              this.paymentDetail+='"id_payment_method": 4, ';
              this.paymentDetail+='"aprobation_code": "'+data.transactionCode+'", ';
              // this.paymentDetail+='"id_bank_entity": '+Number(data.creditBank)+', ';
              this.paymentDetailFinal.aprobation_code = data.transactionCode;
              this.paymentDetailFinal.id_payment_method = 4;
            }


            if(data.wayToPay == "contado"){
              this.paymentDetail+='"id_way_to_pay": 1, ';
              this.paymentDetailFinal.id_way_to_pay = 1;
            }

            if(data.wayToPay == "credito"){
              this.paymentDetail+='"id_way_to_pay": 2, ';
              this.paymentDetailFinal.id_way_to_pay = 2;
            }


            if(data.list && data.list!=null && data.list != undefined && data.list.length>0){
              this.paymentDetailFinal.payment_value = (data.cash)
              this.paymentDetailFinal.state = new stateDTO(1);
              this.paymentDetail+='"payment_value": '+(data.cash)+', ';
              this.paymentDetail+='"state": {"state": 1}}]';
            }else{
              this.paymentDetailFinal.payment_value = (data.cash-data.cambio)
              this.paymentDetailFinal.state = new stateDTO(1);
              this.paymentDetail+='"payment_value": '+(data.cash-data.cambio)+', ';
              this.paymentDetail+='"state": {"state": 1}}]';
            }

          }
          CPrint(JSON.stringify(this.billDTO),"This is Bill DTO");
          this.billingService.postBillResource(this.billDTO, disc)
              .subscribe(
                  result => {
                    this.http2.put(Urlbase.facturacion + "/billing/domiciliario?id_bill="+result+"&id_third="+this.selectedDomi,{}).subscribe(responseItem => {
                      CPrint("THIS IS ITEM, "+responseItem);
                      this.selectedDomi = "-1";

                    CPrint("THIS IS RESULT", result);
                    if (result) {
                      this.http2.post(Urlbase.facturacion+"/billing/procedureup2?idbill="+result,{}).subscribe(resp => {
                        CPrint("THIS IS MY RESP: ",result);
                        CPrint("this is bull DTO",JSON.stringify(this.billDTO));
                        this.beginPlusOrDiscount(this.inventoryQuantityDTOList,disc);


                        if(disc==1 || disc==2){

                          try{
                            CPrint("THIS IS THE PAYMENT DETAIL ILL TRY TO EMULATE, ", JSON.parse(this.paymentDetail));
                            CPrint("THIS IS THE PAYMENT DETAIL ILL TRY TO EMULATE 2, ", this.paymentDetailFinal);
                            this.billingService.postPaymentDetail([this.paymentDetailFinal],Number(result)).subscribe(answer =>{
                                  this.paymentDetailFinal = new paymentDetailDTO(1,1,this.calculateTotal()," ",new stateDTO(1));
                                  this.http.get(Urlbase.facturacion+"/billing/validatePdfDrawing?idbill="+result).subscribe(element => {
                                    if(element>0){
                                  this.http2.get(Urlbase.facturacion+"/billing/UniversalPDF?id_bill="+result+"&pdf=0&cash=0&size="+false,{responseType: 'text'}).subscribe(response =>{
                                    //-----------------------------------------------------------------------------------------------------------------
                                    this.quickconfirm=false;
                                    window.open(Urlbase.facturas+"/"+response, "_blank");
                                    this.showNotification('top', 'center', 3, "<h3>Se ha realizado el movimento <b>CORRECTAMENTE</b></h3> ", 'info');
                                      //this.http2.get(Urlbase.cierreCaja+"/close/alertForEmail?id_caja="+this.locStorage.getIdCaja()+"&id_third="+this.locStorage.getThird().id_third).subscribe(data => {
                                        //@ts-ignore
                                        //CPrint(data)
                                      //})
                                    setTimeout(() => {

                                      this.elementRef.nativeElement.focus();
                                      this.elementRef.nativeElement.select();

                                    }, 100);
                                  });}else{

                                    this.showNotification('top', 'center', 3, "<h3>Error. No se pudo generar la factura, porque el inventario está agotado.</h3> ", 'danger');
                                    this.quickconfirm=false;
                                    this.mostrandoCargando = false;
                                    this.productsObject = [];
                                    this.dataSourceProductosSeleccionados = new MatTableDataSourceWithCustomSort(this.productsObject);
                                    this.dataSourceProductosSeleccionados.sort = this.sort;
                                    this.elementRef.nativeElement.focus();
                                    this.elementRef.nativeElement.select();

                                  }
                                    //-----------------------------------------------------------------------------------------------------------------
                                  });

                                  this.paymentDetail = '[{';
                                const currentSells = localStorage.getItem('sells');
                                let mySells = '';
                                const total = this.calculateTotal();
                                if(currentSells !== 'null'){
                                    mySells = currentSells + ',' + String(total)
                                  }else{
                                    mySells = String(total)
                                  }
                                  localStorage.setItem("sells",mySells);
                                  CPrint(localStorage.getItem("sells"))
                                },
                                error => {
                                  this.showNotification('top', 'center', 3, "<h3>El movimento presento <b>PROBLEMAS</b></h3> ", 'danger')

                                });

                          }catch{
                            this.showNotification('top', 'center', 3, "<h3>El movimento presento <b>PROBLEMAS</b></h3> ", 'danger')
                          }



                        }
                        this.paymentDetail = '[{';
                        this.paymentDetailFinal = new paymentDetailDTO(1,1,this.calculateTotal()," ", new stateDTO(1));
                      });
                    }
                  })
                  }
                  );


        }else{
          this.checker = true;
          this.quickconfirm=false;
          this.showNotification('top', 'center', 3, "<h3> Intentaste agregar un producto con cantidad en <b>CERO</b> a la factura, para agregarlo al carrito, tiene que tener cantidad en 1</h3> ", 'danger');

        }
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
          this.cancel();
        }catch{
          this.showNotification('top', 'center', 3, "<h3>El movimento presento <b>PROBLEMAS</b></h3> ", 'danger')
        }
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
          this.showNotification('top', 'center', 3, "<h3>El movimento presento <b>PROBLEMAS</b></h3> ", 'danger')
        }
      }

    }
    isfull(){
      return this.inventoryList.length == 0;
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
      this.http2.post(Urlbase.tienda + "/resource/auditoria?nombre='SE RETIRO UN PRODUCTO DEL CARRITO DE COMRPAS'&id_third_employee="+this.locStorage.getToken().id_third+"&id_store="+this.locStorage.getIdStore()+"&valor_anterior=1&valor_nuevo=0",{}).subscribe(data => {
        CPrint(data);
      });
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
      if(this.inventoryList[0].inventario_DISPONIBLE == 'S'){
        if(elemento.quantity+1>elemento.invQuantity){
          return;
        }else{
          elemento.quantity+=1;
        }
      }else{
        elemento.quantity+=1;
      }

    }

    downQuantity(elemento){
      if(1<elemento.quantity){
        elemento.quantity-=1;
      }
    }

	GeneratePdfFast(ElDTO){
    let formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });
    let CopiaElDTO = JSON.parse(JSON.stringify(ElDTO));
    //CopiaElDTO = {details:"{9431,1400,1,1},{9428,1129,1,1},{9427,1400,1,1}"};
    CopiaElDTO.details = CopiaElDTO.details.substring(1,CopiaElDTO.details.length-1);
    let ListaDetails = CopiaElDTO['details'].split('},{');
    let ListaProductos = [];
    let Subtotal = 0;
    let Tax = 0;
    let Total = 0;
    //Fecha
    var d = new Date,
      dformat = [
          d.getDate(),
          d.getMonth()+1,
          d.getFullYear()].join('/')+' '+
        [d.getHours(),
          d.getMinutes(),
          d.getSeconds()].join(':');
    //Genero factura en función del timestamp
    let IdFactura = "C1000-"+new Date().getTime();
    /////////////////////
    ListaProductos.push([  { text: 'Cant', style: 'TablaHeader', border: [false, false, false, true]  }, { text: 'Prod',style: 'TablaHeader', border: [false, false, false, true]  }, { text: 'Precio', style: 'TablaHeader', border: [false, false, false, true]  }]);
    ListaDetails.forEach(item => {
      //
      let ItemDividido = item.split(',');
      ItemDividido[0] = parseInt(ItemDividido[0]);
      ItemDividido[1] = parseInt(ItemDividido[1]);
      ItemDividido[2] = parseInt(ItemDividido[2]);
      ItemDividido[3] = parseInt(ItemDividido[3]);
      let ItemObtenido = {price:-1,quantity:-1,tax_product:-1,description:''};
      let product;
      for(let n = 0;n < this.inventoryList.length;n++){
        if(this.inventoryList[n].id_PRODUCT_STORE == ItemDividido[0]){
          product = this.inventoryList[n];
          break;
        }
      }
      if(product == null){return;}
      ItemObtenido.tax_product = this.getPercentTax(ItemDividido[2]);
      ItemObtenido.price = ItemDividido[1];
      ItemObtenido.quantity = ItemDividido[3];
      ItemObtenido.description = product.product_STORE_NAME;
      //
      Subtotal += ItemObtenido.price*ItemObtenido.quantity;
      Tax += (ItemObtenido.price*ItemObtenido.quantity)*ItemObtenido.tax_product;
      ListaProductos.push([  { text: ItemObtenido.quantity, style: 'TablaContenido', border: [false, false, false, false]  }, { text: ItemObtenido.description,style: 'TablaContenido', border: [false, false, false, false]  }, { text: formatter.format((ItemObtenido.price*ItemObtenido.quantity)*(1+ItemObtenido.tax_product)), style: 'TablaContenido', border: [false, false, false, false]  },]);
    });
    Total = Subtotal + Tax;
    //
    // let Logo = {
    //   image: localStorage.getItem('Logo'),
    //   fit: [100, 100],
    //   style: {
    //     alignment: 'center'
    //   }
    // };
    // if(localStorage.getItem('Logo') == null || localStorage.getItem('Logo') == "-1"){
    //   Logo = {
    //     image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABHCAIAAAB+uHWbAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACfSURBVHhe7dAxAQAwEAOh+jedWvjbQQJvnMkKZAWyAlmBrEBWICuQFcgKZAWyAlmBrEBWICuQFcgKZAWyAlmBrEBWICuQFcgKZAWyAlmBrEBWICuQFcgKZAWyAlmBrEBWICuQFcgKZAWyAlmBrEBWICuQFcgKZAWyAlmBrEBWICuQFcgKZAWyAlmBrEBWICuQFcgKZAWyAlmBrEDW2fYBJKjlm+nTjCAAAAAASUVORK5CYII=",
    //     fit: [100, 100],
    //     style: {
    //       alignment: 'center'
    //     }
    //   };
    // }
    const docDefinition = {
      pageSize: { width: 137, height: 598 },
      // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
      pageMargins: [ 10,10,10,10 ],
      content: [
        {
          layout: 'noBorders', // optional
          table: {
            headerRows: 1,
              widths: [117],
              body: [
              [
                //Logo
              ],
            ]
          }
        },
        {text: this.locStorage.getThird().info.fullname, style: 'header'},
        {text: this.locStorage.getThird().info.type_document +" "+ this.locStorage.getThird().info.document_number, style: 'header'},
        {text: ' ', style: 'espacioBlanco'},
        {text: 'Cliente: Cliente Ocasional', style: 'header'},
        {text: ' ', style: 'espacioBlanco'},
        {text: dformat, style: 'header2'},
        {text: "Factura # Offline", style: 'header2'},
        {text: "Caja: Pendiente", style: 'header2'},
        {text: "Cajero: "+this.locStorage.getPerson().info.fullname, style: 'header2'},
        {text: ' ', style: 'espacioBlanco'},
        {
          layout: 'noBorders', // optional
          table: {
            headerRows: 1,
            widths: [50,50],
            body: [
              [{text: 'Tienda', style: 'header2', border: [false, false, false, false] },{text: 'Caja', style: 'header2', border: [false, false, false, false] }],
              [{text: this.locStorage.getStoreName(), style: 'header2', border: [false, false, false, false] },{text: this.locStorage.getBoxName() , style: 'header2', border: [false, false, false, false] }],
            ]
          }
        },
        {text: ' ', style: 'espacioBlanco'},
        {
          //layout: 'noBorders', // optional
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: [13,40,40],
            body: ListaProductos
          }
        },
        {text: ' ', style: 'espacioBlanco'},
        {
          layout: 'noBorders', // optional
          table: {
            headerRows: 1,
            widths: [50,50],

            body: [
              [{text: 'Subtotal', style: 'Totales'},{text: formatter.format(Subtotal), style: 'Totales'}],
              [{text: 'IVA', style: 'Totales'},{text: formatter.format(Tax), style: 'Totales'}],
              [{text: 'Total', style: 'Totales'},{text: formatter.format(Total), style: 'Totales'}],
              [{text: 'Cantidad Recibida', style: 'Totales'},{text: formatter.format(Total), style: 'Totales'}],
              [{text: 'Cambio', style: 'Totales'},{text: formatter.format(0), style: 'Totales'}],
              [{text: 'Medio Pago', style: 'Totales'},{text: 'Efectivo', style: 'Totales'}],
            ]
          }
        },
        {text: ' ', style: 'espacioBlanco'},
        {text: 'Observaciones:', style: 'header'},
        {text: CopiaElDTO['notes'], style: 'header'},
      ],
      styles: {
        header: {
          fontSize: 7,
          bold: true,
          alignment: 'center',
        },
        Totales: {
          fontSize: 7,
          bold: true,
          alignment: 'right',
        },
        espacioBlanco: {
          fontSize: 12,
          bold: true,
          alignment: 'center'
        },
        header2: {
          fontSize: 6,
          bold: false,
          alignment: 'center'
        },
        TablaHeader: {
          fontSize: 6,
          bold: false,
          alignment: 'center'
        },
        TablaContenido: {
          fontSize: 6,
          bold: false,
          alignment: 'center'
        },
      }
    };
    pdfMake.createPdf(docDefinition).open();
  }

  sendPaymentDetails(list,idBill){
    let body = []
    list.forEach(element => {
      body.push({
        PAYMENTVALUE: element.valor,
        IDBILL: idBill,
        IDPAYMENTMETHOD: element.medio,
        APPROBATIONCODE: element.cod,
        IDWAYTOPAY: 1,
        IDBANKENTITY: 1
      })
    });

    this.http2.post(Urlbase.facturacion+"/billing/insertPaymentDetail",{detalles: body},{}).subscribe(response => {
      console.log("WORKED?")
      console.log(response)
    })
  }
}



  export class pdfData{
    nit: String;
    regimen: String;
    medio: String;
    empresa: String;
    tienda: String;
    fecha: String;
    caja: String;
    consecutivo: String;
    detalles: [String[]];
    subtotal: number;
    tax: number;
    total: number;
    nombreCajero:String;
    cambio: number;
    direccion: String;
    telefono: String;
    cedula: String;
    cliente: String;
    direccionC: String;
    telefonoC: String;
    resolucion_DIAN:String;
    regimenT : String;
    prefix : String;
    initial_RANGE : String;
    final_RANGE : String;
    pdfSize: number;
    constructor(nit: String,
                regimen: String,
                medio: String,
                empresa: String,
                tienda: String,
                fecha: String,
                caja: String,
                consecutivo: String,
                detalles: [String[]],
                subtotal: number,
                tax: number,
                total: number,
                nombreCajero: string,
                cambio: number,
                direccion: String,
                telefono: String,
                cedula: String,
                cliente: String,
                direccionC: String,
                telefonoC: String,
                resolucion_DIAN:String,
                regimenT : String,
                prefix : String,
                initial_RANGE : String,
                final_RANGE : String,
                pdfSize:number){
      this.resolucion_DIAN = resolucion_DIAN;
      this.regimenT = regimenT;
      this.prefix = prefix;
      this.initial_RANGE = initial_RANGE;
      this.final_RANGE = final_RANGE;
      this.nombreCajero = nombreCajero;
      this.cambio = cambio;
      this.nit = nit;
      this.regimen = regimen;
      this.medio = medio;
      this.empresa = empresa;
      this.tienda = tienda;
      this.fecha = fecha;
      this.caja = caja;
      this.consecutivo = consecutivo;
      this.detalles = detalles;
      this.subtotal = subtotal;
      this.tax = tax;
      this.total = total;
      this.direccion = direccion;
      this.telefono = telefono;
      this.cedula = cedula;
      this.cliente = cliente;
      this.direccionC = direccionC;
      this.telefonoC = telefonoC;
      this.pdfSize = pdfSize;


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
