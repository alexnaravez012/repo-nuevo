import {Component, ElementRef, Input, OnInit, ViewChild} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {LocalStorage} from '../../../../../../../services/localStorage';
import {MatDialog} from '@angular/material';
/* import components */
import {ReportesComponent} from '../../../billing/bill-main/reportes/reportes.component';
import {QuantityDialogComponent} from '.././quantity-dialog/quantity-dialog.component';
import {ThirdDialogComponent} from '.././third-dialog/third-dialog.component';
import {CloseBoxComponent} from '.././close-box/close-box.component';
import {EmployeeDialogComponent} from '.././employee-dialog/employee-dialog.component';
import {PersonDialogComponent} from '.././person-dialog/person-dialog.component';
import {SearchClientDialogComponent} from '.././search-client-dialog/search-client-dialog.component';
import {SearchProductDialogComponent} from '.././search-product-dialog/search-product-dialog.component';
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
import {InventoryComponent} from './../inventory/inventory.component';
import {StoresComponent} from './../stores/stores.component';
import {UpdateLegalDataComponent} from './../update-legal-data/update-legal-data.component';
import {NewProductStoreComponent} from './../new-product-store/new-product-store.component';
import {ThirdService} from '../../../../../../../services/third.service';
import {BillInventoryComponentComponent} from '../../bill-main/bill-inventory-component/bill-inventory-component.component';
import {StoreSelectorService} from '../../../../../../../components/store-selector.service';
import {TopProductsComponent} from './../top-products/top-products.component';
import {paymentDetailDTO} from './../../models/paymentDetailDTO';
import {stateDTO} from './../../models/stateDTO';
import {ThirdselectComponent} from '../../thirdselect/thirdselect.component';
import {GenerateThirdComponent2Component} from '../generate-third-component2/generate-third-component2.component';
import * as jQuery from 'jquery';
import 'bootstrap-notify';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../../../../../../services/authentication.service';
import {PedidosComponent} from '../pedidos/pedidos.component';

let $: any = jQuery;

@Component({
  selector: 'app-bill-order',
  templateUrl: './bill-order.component.html',
  styleUrls: ['./bill-order.component.scss']
})
export class BillOrderComponent implements OnInit {
  @Input()
  pedidosRef_input:PedidosComponent;
  pedidosRef:PedidosComponent;

  api_uri = Urlbase.tienda;

  CUSTOMER_ID;
  // venta =1
  // venta con remision 107

  //list
  itemLoadBilling: InventoryDetail;
  // inventoryList: InventoryDetail[];
  inventoryList;
  codeList: any;
  categoryList = [] as any[];
  notCategoryList: any;
  productList: any;
  categoryIDboolean = false;
  categoryID: number;
  usableProducts = [] as any[];
  productsByCategoryList = [] as any[];
  codesByProductList = [] as any[];
  codesByCategoryList = [] as any[];
  tab: number = 0;
  selected = new FormControl(0);
  CategoryName: string = "";
  taxesList: any;
  state: any;
  paymentDetailFinal: paymentDetailDTO = new paymentDetailDTO(1, 1, 0, " ", new stateDTO(1));
  paymentDetail: string = '[{';
  paymentDetailObservable = this.http;
  tipoFactura: string = "venta";
  isTotalDev: boolean = false;
  idBillOriginal: String = "";
  storageList;
  priceList = [];
  pdfDatas: pdfData;


  openBox = false;

  storageActual: string = "1";


  FechaDevolucion: String = "--/--/--";
  NotasDevolucion: String = "--Sin notas--";
  TotalDevolucion: String = "--No se Cargo el Total--";
  IdBillDevolucion: String = "";
  IdDocumentDevolucion: String = "";
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
  storeName = " ";
  public flag = "0";
  public productsObject = [];
  public setObject = [];
  public removalArray = new Set();

  public flagVenta = true;
  public vendedor = {};
  public animal;
  public name;
  public form;
  public token: Token;
  public clientData: ClientData;

  public searchData;
  public searchInput: string = "";
  public ObservationsInOrOut: string = "";

  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  private options;

  public pickedPriceList: any;

  public doIAddItems = false;
  public idBillToAdd = 0;
  public topProds = [];

  public busqueda = "";

  listaElem = [];

  quickconfirm = false;

  providerList = [];


  constructor(
      private service: StoreSelectorService,
      public thirdService: ThirdService,
      private http: HttpClient,
      public locStorage: LocalStorage,
      private fb: FormBuilder,
      private billingService: BillingService,
      public inventoriesService: InventoriesService,
      public dialog: MatDialog,
      public router: Router,
      private authService:AuthenticationService
  ) {
  }
  currentBox;
  idThird;
  myBox;
  SelectedStore = this.locStorage.getIdStore();
  Stores;

  listElem = "";
  cliente = "";
  id_person = 0;
  ccClient = "";

  reorderHours = 1;
  interno = false;

  SelectedStoreRe;

  storeList;

  disableDoubleClickSearch = false;

  @ViewChild('nameit') private elementRef: ElementRef;

  getStores2() {
    this.billingService.getStoresByThird(this.locStorage.getToken().id_third).subscribe(data => {
      CPrint(data);
      this.Stores = data;
      this.SelectedStore = this.SelectedStore;
      this.service.onMainEvent.emit(this.SelectedStore);
    })
  }




  onSearchChange(key,event){

        if(this.productsObject[key].quantity == null){
          setTimeout(() => {

            this.elementRef.nativeElement.focus();
            this.elementRef.nativeElement.select();
            setTimeout(() => {
              this.productsObject[key].quantity = 1;

            }, 100);

          }, 100);
        }
  }



  searchClient2() {

    CPrint("THIS ARE HEADERS", this.headers);
    const identificacionCliente = this.ccClient;
    let aux;
    this.http.get<any[]>(Urlbase.tercero + '/persons/search?doc_person=' + String(identificacionCliente), {
      headers: this.headers
    }).subscribe((res) => {
      CPrint(res);
      if (res.length == 0) {
        this.openDialogClient2();
        // this.searchClient(event);
      } else {
        const dialogRef = this.dialog.open(ThirdselectComponent, {
          width: '60vw',
          height: '80vh',

          data: {
            thirdList: res
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {

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
            CPrint("THIS IS THE CLIENT", this.clientData);
            setTimeout(() => {

              this.elementRef.nativeElement.focus();
              this.elementRef.nativeElement.select();

              this.http.get(Urlbase.facturacion + "/pedidos/stores?idthird=" + this.clientData.id_third+"&id_store_client="+this.SelectedStore).subscribe(response => {
                //@ts-ignore
                if (response.length == 0) {
                  CPrint("//---- Es Externo ----//");
                  this.interno = false;
                  // noinspection JSIgnoredPromiseFromCall
                  this.getInventoryList(this.SelectedStore)

                } else {
                  this.getInventoryList2(this.SelectedStore,response[0].id_STORE);
                  CPrint("RESPONSE: ", response);
                  CPrint("//---- Es interno ----//");
                  this.interno = true;
                  this.storeList = response;
                  this.SelectedStoreRe = response[0].id_STORE;

                  //tester testing testongo

                }
              })

            }, 100);

          }
        });


      }


    });


  }


  selectedProviders = [];
  getProviderList(){
    this.selectedProviders = [];
    this.providerList.forEach(element => {
      if(element.checked){
        this.selectedProviders.push(element.id_provider);
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
        let isNaturalPerson = result.data.hasOwnProperty('profile');
        let dataPerson = isNaturalPerson ? result.data.profile : result.data;
        this.clientData.is_natural_person = isNaturalPerson;
        this.clientData.fullname = dataPerson.info.fullname;
        this.clientData.document_type = dataPerson.info.id_document_type;
        this.clientData.document_number = dataPerson.info.document_number;
        this.clientData.address = dataPerson.directory.address;
        this.clientData.phone = dataPerson.directory.phones[0].phone;
        this.clientData.email = dataPerson.directory.hasOwnProperty('mails') ? dataPerson.directory.mails[0].mail : 'N/A';
        setTimeout(() => {

          this.elementRef.nativeElement.focus();
          this.elementRef.nativeElement.select();

          this.http.get(Urlbase.facturacion + "/pedidos/stores?idthird=" + this.clientData.id_third+"&id_store_client="+this.SelectedStore).subscribe(response => {
            //@ts-ignore
             if (response.length == 0) {
                  CPrint("//---- Es Externo ----//");
                  this.interno = false;
                  // noinspection JSIgnoredPromiseFromCall
               this.getInventoryList(this.SelectedStore)

                } else {
                  this.getInventoryList2(this.SelectedStore,response[0].id_STORE);
                  CPrint("RESPONSE: ", response);
                  CPrint("//---- Es interno ----//");
                  this.interno = true;
                  this.storeList = response;
                  this.SelectedStoreRe = response[0].id_STORE;

                  //tester testing testongo

                }
          })

        }, 100);
      }
      setTimeout(() => {

        this.elementRef.nativeElement.focus();
        this.elementRef.nativeElement.select();

      }, 100);
    });
  }

  searchClient(event) {
    const identificacionCliente = String(event.target.value);
    let aux;
    this.http.get<any[]>(Urlbase.tercero + '/persons/search?doc_person=' + String(identificacionCliente), {
      headers: this.headers
    }).subscribe((res) => {
      CPrint(res);
      if (res.length == 0) {
        this.openDialogClient2();
        // this.searchClient(event);
      } else {
        const dialogRef = this.dialog.open(ThirdselectComponent, {
          width: '60vw',
          height: '80vh',

          data: {
            thirdList: res
          }
        });

        dialogRef.afterClosed().subscribe(result => {
          if (result) {

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
            CPrint("THIS IS THE CLIENT", this.clientData);
            setTimeout(() => {
              this.elementRef.nativeElement.focus();
              this.elementRef.nativeElement.select();

              this.http.get(Urlbase.facturacion + "/pedidos/stores?idthird=" + this.clientData.id_third+"&id_store_client="+this.SelectedStore).subscribe(response => {
                //@ts-ignore
                if (response.length == 0) {
                  CPrint("//---- Es Externo ----//");
                  this.interno = false;
                  // noinspection JSIgnoredPromiseFromCall
                  this.getInventoryList(this.SelectedStore)

                } else {
                  this.getInventoryList2(this.SelectedStore,response[0].id_STORE);
                  CPrint("RESPONSE: ", response);
                  CPrint("//---- Es interno ----//");
                  this.interno = true;
                  this.storeList = response;
                  this.SelectedStoreRe = response[0].id_STORE;

                  //tester testing testongo

                }
              })

            }, 100);

          }
        });
      }
    });
  }

  listLoad() {
    this.listaElem = [];
    CPrint("THIS IS LISTA, ", this.listaElem);
    this.getElemsIfOwn().then(e => {
      CPrint("1");
      this.getElemsIfcode().then(a => {
        CPrint("2");
        //inserto elementos si name
        this.inventoryList.forEach(element => {
          if (element.product_STORE_NAME.toLowerCase().includes(this.listElem.toLowerCase())) {
            this.listaElem.push(element);
          }
        })
      })
    })
  }

  async getElemsIfOwn() {
    this.inventoryList.forEach(element => {
      if (element.ownbarcode == this.listElem) {
        CPrint("PUDE ENTRAR 1");
        this.listaElem.push(element);
      }
    })
  }

  async getElemsIfcode() {
    this.inventoryList.forEach(element => {
      if (element.product_STORE_CODE == this.listElem) {
        CPrint("PUDE ENTRAR 2");
        this.listaElem.push(element);
      }
    })
  }

  addDetailsReorder(element) {

    let length = element.length;
    for (let j = 0; j < length; j++) {
      this.addDetail3(element[j].ownbarcode, element[j].cantidad);
    }

  }

  reorden() {
    this.http.get(Urlbase.facturacion + "/reorder/manual?id_third=" + this.clientData.id_third + "&id_store=" + this.SelectedStore + "&days=" + this.reorderHours).subscribe(element => {
      CPrint("THIS IS ELEMNT: ", element);
      this.addDetailsReorder(element)
    })
  }

  getStoreType(id_store) {
    //@ts-ignore
    this.http.get(Urlbase.tienda + "/store/tipoStore?id_store=" + id_store).subscribe(response => {
      this.locStorage.setTipo(response);
      CPrint("ID CAJA: ", this.locStorage.getIdCaja());
      CPrint("ID STORE: ", this.SelectedStore);
      CPrint("STORE TYPE: ", this.locStorage.getTipo());
      CPrint("BOX TYPE: ", this.locStorage.getBoxStatus());
      CPrint("AM I?");
      this.getStores();
    })
  }

  getStores() {
    this.billingService.getStoresByThird(this.locStorage.getToken().id_third).subscribe(data => {
      data.forEach(element => {
        if (element.id_STORE == this.SelectedStore) {
          this.storeName = element.store_NAME;
        }
      });
    })
  }

  getStoresStoring() {
    this.billingService.getStoresByThird(this.locStorage.getToken().id_third).subscribe(data => {
      console.log("This is data; ",data);
      this.SelectedStore = this.locStorage.getIdStore();
      this.Stores = data;})
  }

  getTopProds(idstore) {
    this.topProds = [];
    this.http.get(Urlbase.facturacion + "/billing/top20?idstore=" + idstore).subscribe(res => {
      for (let i = 0; i < 20; i++) {
        this.topProds.push(res[i]);
      }

      CPrint("THIS IS LIST, ", this.topProds)
    })
  }

  reload() {
    this.ngOnInit();
    this.getTopProds(this.SelectedStore)
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

  ngOnInit() {
    this.getStoresStoring();
    this.pedidosRef = this.pedidosRef_input;
    //CONSTRUCTOR
    this.clientData = new ClientData(true, 'Cliente Ocasional', ' ', ' ', ' ', ' ', ' ', null);
    this.detailBillingDTOList = [];
    this.inventoryList = [];
    this.inventoryQuantityDTOList = [];
    this.detailBillDTOList = [];

    this.commonStateDTO = new CommonStateDTO(1, null, null);
    this.documentDTO = new DocumentDTO(null, null);
    this.inventoryQuantityDTO = new InventoryQuantityDTO(null, null, null, null, null);
    this.detailBillDTO = new DetailBillDTO(null, null, null, null, null, this.commonStateDTO, null);
    this.billDTO = new BillDTO(this.SelectedStore, null, null, null, null, null, null, null, null, null, null, null, null, this.commonStateDTO, null, this.detailBillDTOList, this.documentDTO);
    this.createControls();
    this.service.onDataSendEvent.subscribe(log => {
      CPrint("THIS CODE DID RUN, ", log)
    });
    //////////////////
    CPrint("ON VENTA");
    if (this.billingService.subsVar == undefined) {
      this.billingService.subsVar = this.billingService.
      invokeFirstComponentFunction.subscribe((name: string) => {
        this.reload();
      });
    }

    this.openBox = this.locStorage.getBoxStatus();
    CPrint("ID CAJAAAAA: ", this.locStorage.getIdCaja());
    CPrint("ID STOREEEEE: ", this.SelectedStore);
    CPrint("Box STATUS: ", this.locStorage.getBoxStatus());

    //-----machete para telefono y direccion
    if (this.locStorage.getThird().id_third == 542) {
      this.locStorage.setDireccion("Cali, Cra 42C # 52-05");
      this.locStorage.setTelefono("2345678 / 3222345674");
    }

    if (this.locStorage.getThird().id_third == 601) {
      this.locStorage.setDireccion("Cali, Calle 3 Oeste # 1-80");
      this.locStorage.setTelefono("3209807254");
    }
    //-----machete para telefono y direccion

    setTimeout(() => {

      this.elementRef.nativeElement.focus();
      this.elementRef.nativeElement.select();

    }, 100);



      this.idThird = this.locStorage.getToken().id_third;
      CPrint(this.idThird, "I NEEDED THIS THIRD ID :V");
      localStorage.setItem("id_employee", String(this.idThird));

    this.state = {
      state: 1
    };
    this.loadData();
    this.token = this.locStorage.getToken();
    this.CUSTOMER_ID = this.token.id_third_father;
    this.vendedor['fullname'] = this.locStorage.getPerson().info.fullname;
    this.vendedor['cargo'] = this.locStorage.getRol().map((item) => {
      return item.rol;
    }).join(" / ");
    this.getCodes();

    this.headers = new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization':  this.locStorage.getTokenValue(),
    });
    let token = localStorage.getItem('currentUser');
    this.options = {
      headers: this.headers
    };
    this.getStorages();
  }

  setCode(code) {

    this.addDetail2(code);

  }

  roundnum(num) {
    return Math.round(num);
  }

  getStores3() {
    this.billingService.getStoresByThird(this.locStorage.getToken().id_third).subscribe(data => {
      CPrint(data);
      this.Stores = data;
      this.SelectedStore = data[0].id_STORE;
      this.locStorage.setIdStore(data[0].id_STORE)
    })
  }

  getPriceList3(product, code, id, quantity) {
    CPrint("id is: ", id);
    CPrint("product is: ", product);
    this.http.get(Urlbase.tienda + "/store/pricelist?id_product_store=" + id).subscribe(response => {
      this.elementRef.nativeElement.disabled = false;
      CPrint("This is picked price list: ", response);
      const datos = response;
      CPrint("this is datos: ", datos);
      if (product) {
        CPrint("this.storageList en getPriceList3 es");
        CPrint(this.storageList);
        let new_product = {
          quantity: quantity,
          quantity_inv: product.quantity,
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
          pricelist: response
        };
        if(this.interno){
          new_product.price = product.price
        }else{
          new_product.price = response[0].price;
        }
        //this.detailBillDTOList.push(new_product);
        this.productsObject.unshift(new_product);
        this.setObject = Object.keys(this.productsObject);
        this.disableDoubleClickSearch = false;
        this.elementRef.nativeElement.disabled = false;
        setTimeout(() => {

          this.elementRef.nativeElement.focus();
          this.elementRef.nativeElement.select();

        }, 100);

      } else {
        let codeList;
        this.http.get(Urlbase.tienda + "/products2/code/general?code=" + String(code)).subscribe(data => {
          codeList = data;
          CPrint("this is codeList: ", codeList);
          //@ts-ignore
          if (data.length == 0) {
            if(localStorage.getItem("SesionExpirada") != "true"){ alert('Product not exist');}
            this.disableDoubleClickSearch = false;

            this.elementRef.nativeElement.disabled = false;
            setTimeout(() => {

              this.elementRef.nativeElement.focus();
              this.elementRef.nativeElement.select();

            }, 100);
          } else {
            let dialogRef;
            dialogRef = this.dialog.open(NewProductStoreComponent, {
              width: '30vw',
              data: {
                codeList: codeList[0]
              }
            });
            dialogRef.afterClosed().subscribe(res => {
              this.disableDoubleClickSearch = false;

              this.elementRef.nativeElement.disabled = false;
              setTimeout(() => {

                this.elementRef.nativeElement.focus();
                this.elementRef.nativeElement.select();

              }, 100);
              this.ngOnInit()
            })
          }
        });

      }

    });
  }

  getPriceList(product, code, id) {
    this.getPriceList3(product,code,id,1);
  }

  getStorages() {
    CPrint("this.id_store es");
    CPrint(this.SelectedStore);
    this.http.get(Urlbase.tienda + "/store/s?id_store=" + this.SelectedStore).subscribe((res) => {
      this.storageList = res;
      CPrint("this.storageList es");
      CPrint(this.storageList)
    });

  }

  getBillData(event) {
    this.http.get(Urlbase.facturacion + "/billing-state/billData?consecutive=" + event.target.value).subscribe((res) => {
      const refund = res;
      try {
        this.FechaDevolucion = refund[0].purchase_DATE;
        this.NotasDevolucion = refund[0].body;
        this.TotalDevolucion = refund[0].totalprice;
        this.IdBillDevolucion = refund[0].id_BILL;
        this.IdDocumentDevolucion = refund[0].id_DOCUMENT;
        this.IdBillState = refund[0].id_BILL_STATE;
        this.botonDevolucionActive = false;
        this.showNotification('top', 'center', 3, "<h3>LA FACTURA FUE CARGADA CORRECTAMENTE</h3> ", 'info');
      } catch (e) {
        this.showNotification('top', 'center', 3, "<h3>NO SE ENCONTRO EL CONSECUTIVO DE FACTURA SOLICITADO</h3> ", 'danger');
      }
    });

  }

  anularFacturaPorDevolucion() {
    if (this.IdBillState != 41) {
      const state = 41;
      let params = new HttpParams();
      params = params.append('state',  state+"");
      this.http.put(Urlbase.facturacion + "/billing-state/billState/" + this.IdBillDevolucion, null, {
        params: params
      }).subscribe((res) => {
        const notas = this.NotasDevolucion + ' / Factura Anulada Por Motivo de Devolucion';
        this.http.put(Urlbase.facturacion + "/billing-state/documentBody/" + this.IdDocumentDevolucion, null, {
          params: {
            'body': notas
          }
        }).subscribe((resp) => {
          this.showNotification('top', 'center', 3, "<h3>LA FACTURA FUE ANULADA CORRECTAMENTE</h3> ", 'success');
        });
      });
    } else {
      this.showNotification('top', 'center', 3, "<h3>LA FACTURA YA SE ENCUENTRABA ANULADA POR DEVOLUCION</h3> ", 'danger');
    }

    this.FechaDevolucion = "--/--/--";
    this.NotasDevolucion = "--Sin notas--";
    this.TotalDevolucion = "--No se Cargo el Total--";
    this.IdBillDevolucion = "";
    this.IdDocumentDevolucion = "";
    this.IdBillState = 0;
    this.botonDevolucionActive = true;

  }

  resetCategoryMenu() {
    this.categoryIDboolean = false;
    this.categoryID = null;
    this.productsByCategoryList = [] as any[];
    this.codesByProductList = [] as any[];
    this.codesByCategoryList = [] as any[];
    this.CategoryName = "";
  }

  getTaxes() {
    this.http.get(this.api_uri + '/tax-tariff').subscribe((res) => {
      this.taxesList = res;
      this.getCategoryList();
    });

  }

  getCodes() {
    this.http.get(this.api_uri + '/codes').subscribe((res) => {
      this.codeList = res;
      this.getCategories();
    });
  }

  openCierreCaja() {
    let dialogRef = this.dialog.open(CloseBoxComponent, {
      width: '60vw',
      data: {
        flag: true
      }
    });

  }

  openTop() {
    CPrint("THIS IS ROLES: ", this.locStorage.getTipo());

    let modal;
    modal = this.dialog.open(TopProductsComponent, {
      width: '1040px',
      height: '680px',
      data: {}
    });

    modal.afterClosed().subscribe(response => {
      CPrint("ESTE ES EL CODIGO DE BARRAS QUE QUIERO EJECUTAR: ", this.locStorage.getCodigoBarras());
      if (this.locStorage.getCodigoBarras() != "-1") {
        this.addDetail2(this.locStorage.getCodigoBarras());
        this.locStorage.setCodigoBarras("-1");
      }
    });
  }

  openCategories() {
    CPrint("THIS IS ROLES: ", this.locStorage.getTipo());

    let modal;
    modal = this.dialog.open(BillInventoryComponentComponent, {
      width: '675px',
      height: '450px',
      data: {}
    });

    modal.afterClosed().subscribe(response => {
      CPrint("ESTE ES EL CODIGO DE BARRAS QUE QUIERO EJECUTAR: ", this.locStorage.getCodigoBarras());
      if (this.locStorage.getCodigoBarras() != "-1") {
        this.addDetail2(this.locStorage.getCodigoBarras());
        this.locStorage.setCodigoBarras("-1");
      }
    });
  }

  openInventories() {
    let dialogRef = this.dialog.open(InventoryComponent, {
      width: '60vw',
      data: {}
    });


  }

  openStores() {
    let dialogRef = this.dialog.open(StoresComponent, {
      width: '60vw',
      data: {}
    });

  }

  openUpdateLegalData() {
    let dialogRef = this.dialog.open(UpdateLegalDataComponent, {
      width: '60vw',
      data: {}
    });
  }

  getProducts() {
    this.http.get(this.api_uri + '/products').subscribe((res) => {
      this.productList = res;
      this.getTaxes();
    });
  }

  getCategories() {
    this.http.get(this.api_uri + '/categories').subscribe((res) => {
      this.notCategoryList = res;
      this.getProducts();
    });
  }

  getPercentTax(idTaxProd) {

    let thisTax;
    let taxToUse;

    for (thisTax in this.taxesList) {
      if (idTaxProd == this.taxesList[thisTax].id_tax_tariff) {
        taxToUse = this.taxesList[thisTax].percent / 100;
      }
    }

    return taxToUse;
  }

  getCodesByCategory() {
    let product: any;
    for (product in this.usableProducts) {
      // noinspection JSDuplicatedDeclaration,ES6ConvertVarToLetConst
      var compProduct = this.usableProducts[product];
      if (compProduct.id_category == this.categoryID) {
        if (!this.productsByCategoryList.includes(compProduct)) {
          this.productsByCategoryList.push(compProduct);
        }
      }

    }
    let code: any;

    for (code in this.codeList) {
      let compCode = this.codeList[code];
      let product: any;
      for (product in this.productList) {
        // noinspection ES6ConvertVarToLetConst
        var compProduct = this.productList[product];
        if (compCode.id_product == compProduct.id_product) {
          compCode.img_url = compProduct.img_url;
          compCode.id_category = compProduct.id_category;
          compCode.description_product = compProduct.description_product;
          compCode.name_product = compProduct.name_product;
          const elem = this.inventoryList.find(item => item.code == compCode.code);
          compCode.price = elem.standard_PRICE;
          if (!this.codesByProductList.includes(compCode)) {
            this.codesByProductList.push(compCode);
          }
        }
      }
    }


    let codeKey: any;

    for (codeKey in this.codeList) {
      // noinspection ES6ConvertVarToLetConst
      var compCode = this.codesByProductList[codeKey];
      if (compCode.id_category == this.categoryID) {
        if (!this.codesByCategoryList.includes(compCode)) {
          this.codesByCategoryList.push(compCode);
        }
      }
    }
    return this.codesByCategoryList;
  }

  getCategoryList() {
    this.codeList.forEach(code => {

      const aux = this.productList.filter(
          product => {
            return code.id_product == product.id_product
          }
      )[0];

      if (!this.usableProducts.includes(aux)) {
        this.usableProducts.push(aux)
      }

    });


    this.usableProducts.forEach(prod => {

      const aux = this.notCategoryList.filter(
          cat => {
            return prod.id_category == cat.id_category;
          }
      )[0];

      if (!this.categoryList.includes(aux)) {
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

    let useProduct: any;
    let category: any;


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

  setCategoryID(id, name) {
    this.categoryID = id;
    this.categoryIDboolean = true;
    this.CategoryName = name;
  }

  addDetail3(code, quantity) {
    let key: any = null;
    this.productsObject.forEach(item => {
      if (item.code == code || item.ownbarcode == code || String(item.product_store_code) == code) {
        key = item;
      }
    });
    if (key != null) {
      this.productsObject[this.productsObject.indexOf(key)].quantity += 1;
    } else {
      const product = this.inventoryList.find(item => this.findCode(code, item));
      //@ts-ignore
      if (product) {
        this.getPriceList3(product, code, product.id_PRODUCT_STORE, quantity)
      } else {
        if(localStorage.getItem("SesionExpirada") != "true"){ alert('Ese codigo no esta asociado a un producto.');}
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

    this.elementRef.nativeElement.disabled = true;
    setTimeout(() => {

      this.elementRef.nativeElement.focus();
      this.elementRef.nativeElement.select();

    }, 100);


    const code = String(event.target.value);
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
      event.target.value = '';
      this.elementRef.nativeElement.disabled = false;
      setTimeout(() => {

        this.elementRef.nativeElement.focus();
        this.elementRef.nativeElement.select();

      }, 100);
    } else {
      event.target.value = '';
      // var product = this.inventoryList.find(item => (item.code == code || item.ownbarcode == code || String(item.product_STORE_CODE) == code));
      const product = this.inventoryList.find(item => this.findCode(code, item));
      //@ts-ignore
      if (product) {
        this.getPriceList(product, code, product.id_PRODUCT_STORE)
      } else {
        this.elementRef.nativeElement.disabled = false;
        setTimeout(() => {

        this.elementRef.nativeElement.focus();
        this.elementRef.nativeElement.select();

      }, 100);
        if(localStorage.getItem("SesionExpirada") != "true"){ alert('Ese codigo no esta asociado a un producto.');
        this.elementRef.nativeElement.disabled = false;}
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
        this.setObject = Object.keys(this.productsObject);

        setTimeout(() => {
          document.getElementById('lastDetailQuantity');
        });
        this.resetCategoryMenu();
        this.tab = 0;
      } else {
        this.resetCategoryMenu();
        this.showNotification('top', 'center', 3, "<h3 class = 'text-center'>El producto solicitado no existe<h3>", 'danger');
        this.tab = 0;
      }
    }
  }

  calculateTotalPrice(key) {
    return (this.productsObject[key].price + (this.productsObject[key].tax * this.productsObject[key].price)) * Math.floor(this.productsObject[key].quantity)
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
      if (this.flagVenta) {
        tax += this.productsObject[code]['price'] * Math.floor(this.productsObject[code]['quantity']) * this.productsObject[code]['tax'];
      } else {
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
    // noinspection JSDeprecatedSymbols
    event.target.blur();
    setTimeout(() => {
      document.getElementById('lastDetailSaleValue').focus();
    });
  }

  readNew(event: any) {
    // noinspection JSDeprecatedSymbols
    event.target.blur();
    setTimeout(() => {
      document.getElementById('reader').focus();
    });
  }

  cancel() {
    this.storeList = [];
    this.inventoryList = [];
    this.quickconfirm = false;
    this.listElem = "";
    this.listaElem = [];
    this.form.reset();
    this.cliente = "";
    this.clientData = new ClientData(true, 'Cliente Ocasional', '  ', ' ', '  ', '   ', '  ', null);
    this.productsObject = [];
    this.setObject = [];
    this.removalArray = new Set();

    this.CUSTOMER_ID = this.token.id_third_father;
    setTimeout(() => {

      this.elementRef.nativeElement.focus();
      this.elementRef.nativeElement.select();

    }, 100);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(QuantityDialogComponent, {
      width: '40vw',
      data: {
        name: this.name,
        animal: this.animal
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
    });
  }

  openDialogClient(tipo): void {
    let dialogRef;
    if (tipo == 0) {
      dialogRef = this.dialog.open(ThirdDialogComponent, {
        width: '60vw',
        data: {}
      });
    }

    if (tipo == 1) {
      dialogRef = this.dialog.open(PersonDialogComponent, {
        width: '60vw',
        data: {}
      });
    }

    if (tipo == 2) {
      dialogRef = this.dialog.open(EmployeeDialogComponent, {
        width: '60vw',
        data: {}
      });
    }

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.CUSTOMER_ID = result.id;
        // CPrint('CREATE CLIENT SUCCESS');
        // CPrint(result);
        let isNaturalPerson = result.data.hasOwnProperty('profile');
        let dataPerson = isNaturalPerson ? result.data.profile : result.data;
        this.clientData.is_natural_person = isNaturalPerson;
        this.clientData.fullname = dataPerson.info.fullname;
        this.clientData.document_type = dataPerson.info.id_document_type;
        this.clientData.document_number = dataPerson.info.document_number;
        this.clientData.address = dataPerson.directory.address;
        this.clientData.phone = dataPerson.directory.phones[0].phone;
        this.clientData.email = dataPerson.directory.hasOwnProperty('mails') ? dataPerson.directory.mails[0].mail : 'N/A';
      }
    });
  }

  openDialogSearchClient(): void {
    const dialogRef = this.dialog.open(SearchClientDialogComponent, {
      width: '40vw',
      data: {
        name: this.name,
        animal: this.animal
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
    });
  }

  openDialogSearchProduct(): void {
    const dialogRef = this.dialog.open(SearchProductDialogComponent, {
      width: '40vw',
      data: {
        name: this.name,
        animal: this.animal
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
    });
  }

  // openDialogTransactionConfirm(disc, isCompra): void {
  //   this.quickconfirm = true;

  //   this.save(this.clientData, disc, isCompra);


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

      date: [{
        value: '',
        disabled: true
      }, Validators.compose([
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
  getInventoryList2(store,storeprov) {
    this.productsObject = [];
    this.setObject = [];
    CPrint("This is my store: "+store);
    CPrint("This is my store: "+storeprov);
    this.http.get(Urlbase.facturacion + "/pedidos/pedidoManual?id_store="+store+"&id_store_prov="+storeprov).subscribe(data => {
          //CPrint("This is InventoryList: ", data);
          this.inventoryList = data;
          //  this.getPriceList();
          //@ts-ignore
          for(let i=0;i<data.length;i++){

            if(this.providerList.filter(function(e) { return e.id_provider === data[i].id_PROVIDER; }).length > 0){

            }else{
              this.providerList.push({id_provider: data[i].id_PROVIDER,
                provider: data[i].provider,
                checked: false});
            }

            // if(!this.providerList.includes({id_provider: data[i].id_PROVIDER,
            //                               provider: data[i].provider,
            //                               checked: false})){

            // }

          }
          setTimeout(() => {

            this.elementRef.nativeElement.focus();
            this.elementRef.nativeElement.select();

          }, 150);
        },
        (error) => {
          CPrint(error);
        },
        () => {
          if (this.inventoryList.length > 0) {

          }
        });

  }


  async getInventoryList(store) {
    this.productsObject = [];
    this.setObject = [];
    this.inventoriesService.getInventory(store).subscribe((data: InventoryName[]) => {
          //CPrint("This is InventoryList: ", data);
          this.inventoryList = data;
          //  this.getPriceList();
          setTimeout(() => {

            this.elementRef.nativeElement.focus();
            this.elementRef.nativeElement.select();

          }, 150);
          CPrint("THIS IS SOME DATA I HAVE TO CHECK, do i add stuff? ", this.doIAddItems, ", and do i have a id bill? ", this.idBillToAdd);
          if (this.locStorage.getDoIMakeRefund()) {
            CPrint("ENTRE A LA LISTA REFUND");
            this.http.get(Urlbase.facturacion + "/billing/detail?id_bill=" + this.locStorage.getIdRefund()).subscribe(response => {
              this.locStorage.setDoIMakeRefund(false);
              this.locStorage.setIdRefund(0);
              //@ts-ignore
              response.forEach(element => {
                this.addDetail3(Number(element[3]), Number(element[0]))
              });
              // //@ts-ignore
              // for(let i=0;i<response.length;i++){
              //   for(let j=0; j < Number(response[i][0]);j++){
              //     this.addDetail2(response[i][3]);
              //   }
              // }
            })
          }
        },
        (error) => {
          CPrint(error);
        },
        () => {
          if (this.inventoryList.length > 0) {

          }
        });

  }

  round(value, precision) {
    const multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }

  detalles="";

  async openDialogTransactionConfirm() {

    let item2 = await this.hasRepeatedElements(this.productsObject)
    if(item2.length>0){

      await console.log("THIS IS MY SECOND RESULT LIST: ",item2)
      await this.showNotification('top', 'center', 3, "<h3>Hay elementos duplicados en su carrito de pedidos, por favor eliminelos.</h3> ", 'danger');
      await this.colorearElementos();

    }else{

      await this.listDetails();
      await console.log("THIS IS THE OBJECT I NEED: ", this.productsObject)
      await console.log("THIS IS MY SECOND RESULT LIST: ",item2)
      await this.postPedido();

    }

  }

  colorearElementos(){

  }

  async hasRepeatedElements(list){
    this.detalles = "";

    let sorted_arr = await list.sort(function(a,b){
      return a.id_product_third - b.id_product_third
    })


    await console.log("sorted_arr: ",sorted_arr);

    let results = await [];

    var filtered = await sorted_arr.filter(function (el) {
      return el != null && el != undefined;
    });

    await console.log("filtered_arr: ",filtered);

    for (let i = 0; i < filtered.length - 1; i++) {
      let a = await 0;
      if (filtered[i + 1].id_product_third == filtered[i].id_product_third ) {
        await results.push(filtered[i]);
      }
    }

    await console.log("THIS IS RESULT LIST: ",results)
    return results;
  }

  async listDetails(){
    console.log("PRODUCTS OBJECT FOR MAKING STRING: ",this.productsObject);
    this.productsObject.forEach( item => {
      this.detalles=this.detalles+"{"+item.id_product_third+","+this.round(item.price,0)+","+item.tax_product+","+item.quantity+"},"
    })
  }


  postPedido(){
    CPrint(this.detalles);
     this.http.post(Urlbase.facturacion + "/pedidos/crearPedidoV2?idthirdclient="+this.locStorage.getThird().id_third+"&idstoreclient="+this.SelectedStore+"&idthirdempclient="+this.locStorage.getToken().id_third+"&idthirdprov="+this.id_person+"&idstoreprov="+this.SelectedStoreRe+"&detallepedido="+this.detalles.substring(0, this.detalles.length - 1),{}).subscribe(
       response=> {
             this.detalles="";
             this.cancel();
             this.showNotification('top', 'center', 3, "<h3>Se creo el pedido exitosamente</h3> ", 'info');

            this.http.get(Urlbase.facturacion+"/billing/validatePdfDrawing?idbill="+response).subscribe(element => {
              this.http.get(Urlbase.facturacion+"/billing/UniversalPDF?id_bill="+response+"&pdf=0&cash=0&size="+false,{responseType: 'text'}).subscribe(responses =>{
                window.open(Urlbase.remisiones+"/"+responses, "_blank");
                this.detalles="";
                this.cancel();
              })
            })
       }
     )
  }



  save(data, disc, isCompra) {
    if (this.SelectedStore == 81) {
      this.flag = "1"
    }

    CPrint("THIS IS THIRD DESTINY ID FU: " + this.clientData.id_third);
    CPrint("this is id person: ", data.id_person);
    this.billDTO.id_third_destiny = this.clientData.id_third;
    this.billDTO.id_store = this.SelectedStore;
    this.detailBillDTOList = [];
    this.commonStateDTO.state = 1;
    this.inventoryQuantityDTOList = [];
    let titleString = this.form.value['isRemission'] ? ' Por Remision' : '';

    this.documentDTO.title = 'Movimiento De Venta';

    this.documentDTO.body = data.observations || '';

    /**
     * building detailBill and Quantity
     */
    for (let code in this.productsObject) {
      let element = this.productsObject[code];

      this.inventoryQuantityDTO = new InventoryQuantityDTO(null, null, null, null, null);
      this.detailBillDTO = new DetailBillDTO(null, null, null, null, null, this.commonStateDTO, null);

      //building detailBill
      this.detailBillDTO.id_storage = element.id_storage;
      this.detailBillDTO.price = Math.round(element.price);
      this.detailBillDTO.tax = this.getPercentTax(element.tax_product) * 100;
      this.detailBillDTO.id_product_third = element.id_product_third;
      this.detailBillDTO.tax_product = element.tax_product;
      this.detailBillDTO.state = this.commonStateDTO;
      this.detailBillDTO.quantity = Math.floor(element.quantity);

      if (element.quantity > 0) {
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
      let ID_BILL_TYPE = this.form.value['isRemission'] ? 107 : 1;
      this.billDTO.id_third_employee = this.token.id_third_father;
      this.billDTO.id_third = this.token.id_third;
      this.billDTO.id_bill_type = 87;
      //instanciar de acuerdo a por remision
      this.billDTO.id_bill_state = 61;
      this.billDTO.purchase_date = new Date();
      this.billDTO.subtotal = Math.floor(this.calculateSubtotal() * 100) / 100;
      this.billDTO.tax = Math.floor(this.calculateTax() * 100) / 100;
      this.billDTO.totalprice = Math.floor(this.calculateTotal() * 100) / 100;
      if (disc == 3 || disc == 4) {
        this.billDTO.subtotal = 0;
        this.billDTO.tax = 0;
        this.billDTO.totalprice = 0;
      }
      this.billDTO.discount = 0;
      this.billDTO.documentDTO = this.documentDTO;
      this.billDTO.state = null;

      this.billDTO.details = this.detailBillDTOList;

      if (disc == 1 || disc == 2) {

        if (data.paymentMethod == "efectivo") {
          this.paymentDetail += '"id_payment_method": 1, ';
          this.paymentDetail += '"aprobation_code": "", ';
          this.paymentDetailFinal.aprobation_code = "";
          this.paymentDetailFinal.id_payment_method = 1;
        }
        if (data.paymentMethod == "debito") {
          this.paymentDetail += '"id_payment_method": 2, ';
          this.paymentDetail += '"aprobation_code": "' + data.transactionCode + '", ';
          // this.paymentDetail+='"id_bank_entity": '+Number(data.creditBank)+', ';
          this.paymentDetailFinal.aprobation_code = data.transactionCode;
          this.paymentDetailFinal.id_payment_method = 2;
        }
        if (data.paymentMethod == "credito") {
          this.paymentDetail += '"id_payment_method": 3, ';
          this.paymentDetail += '"aprobation_code": "' + data.transactionCode + '", ';
          // this.paymentDetail+='"id_bank_entity": '+Number(data.creditBank)+', ';
          this.paymentDetailFinal.aprobation_code = data.transactionCode;
          this.paymentDetailFinal.id_payment_method = 3;
        }


        if (data.wayToPay == "contado") {
          this.paymentDetail += '"id_way_to_pay": 1, ';
          this.paymentDetailFinal.id_way_to_pay = 1;
        }

        if (data.wayToPay == "credito") {
          this.paymentDetail += '"id_way_to_pay": 2, ';
          this.paymentDetailFinal.id_way_to_pay = 2;
        }


        this.paymentDetailFinal.payment_value = this.calculateTotal();
        this.paymentDetailFinal.state = new stateDTO(1);
        this.paymentDetail += '"payment_value": ' + this.calculateTotal() + ', ';
        this.paymentDetail += '"state": {"state": 1}}]';

      }
      CPrint(JSON.stringify(this.billDTO), "This is Bill DTO");
      this.billingService.postBillResource(this.billDTO, disc)
          .subscribe(
              result => {
                if (result) {
                  //this.http.post(Urlbase.facturacion + "/billing/procedureup2?idbill="+result,{}).subscribe(resp => {
                  CPrint("THIS IS MY RESP: ", result);
                  CPrint("this is bull DTO", JSON.stringify(this.billDTO));
                  CPrint("THIS IS THE PAYMENT DETAIL ILL TRY TO EMULATE, ", JSON.parse(this.paymentDetail));
                  CPrint("THIS IS THE PAYMENT DETAIL ILL TRY TO EMULATE2, ", this.paymentDetailFinal);


                  if (disc == 1 || disc == 2) {

                    try {
                      this.http.post(Urlbase.facturacion + "/pedidos/detalles", {
                        listaTipos: [result]
                      }).subscribe(list => {
                        CPrint("THIS IS LIST: ", JSON.stringify({
                          documento: null,
                          cliente: this.clientData.fullname,
                          fecha: new Date(),
                          documento_cliente: this.clientData.document_type + " - " + this.clientData.document_number,
                          correo: this.clientData.email,
                          direccion: this.clientData.address,
                          total: 0,
                          subtotal: 0,
                          tax: 0,
                          detail_list: list,
                          used_list: [],
                          observaciones: null,
                          logo: this.locStorage.getThird().info.type_document + " " + this.locStorage.getThird().info.document_number
                        }));
                        this.http.get(Urlbase.facturacion + "/pedidos/numdoc?idbill=" + result, {
                          responseType: 'text'
                        }).subscribe(answeringdata => {
                          this.http.get(Urlbase.facturacion + "/pedidos/datosCliente?idbill=" + result).subscribe(answer => {

                            CPrint("pdf2order BODY ES ");
                            CPrint({
                              datosProv: answer,
                              documento: answeringdata,
                              cliente: this.clientData.fullname,
                              fecha: new Date(),
                              documento_cliente: this.clientData.document_type + " - " + this.clientData.document_number,
                              correo: this.clientData.email,
                              direccion: this.clientData.address,
                              total: 0,
                              subtotal: 0,
                              tax: 0,
                              detail_list: list,
                              used_list: [],
                              observaciones: 'NA',
                              logo: this.locStorage.getThird().info.type_document + " " + this.locStorage.getThird().info.document_number
                            });

                            //-----------------------------------------------------------------------------------------------------------------

                            if (this.interno == true) {
                              this.http.put(Urlbase.facturacion +"/pedidos/completar?idstore=" + this.SelectedStoreRe + "&idbill=" + result, {}).subscribe(a => {
                                this.http.post(Urlbase.facturacion +"/pedidos/cloneBill?idbill=" + result, {}).subscribe(b => {
                                  this.http.get(Urlbase.facturacion+"/billing/validatePdfDrawing?idbill="+b).subscribe(element => {
                                  this.http.get(Urlbase.facturacion+"/billing/UniversalPDF?id_bill="+b+"&pdf=0&cash=0&size="+false,{responseType: 'text'}).subscribe(response =>{
                                    window.open(Urlbase.remisiones+"/"+response, "_blank");
                                  })
                                  })
                                })
                              })
                            }
                          })
                        })
                      });


                      CPrint("AQUI IMPRIMO EL PDF");


                      this.cancel();
                      this.paymentDetail = '[{';
                      const currentSells = localStorage.getItem('sells');
                      let mySells: string;
                      const total = this.calculateTotal();
                      CPrint("AQUI total es "+total);
                      if (currentSells !== 'null') {
                        mySells = currentSells + ',' + String(total)
                      } else {
                        mySells = String(total)
                      }
                      localStorage.setItem("sells", mySells);
                      CPrint(localStorage.getItem("sells"))


                    } catch (exception) {
                      CPrint(exception)
                    }


                  }
                  this.paymentDetail = '[{';

                  this.paymentDetailFinal = new paymentDetailDTO(1, 1, this.calculateTotal(), " ", new stateDTO(1));
                  // })
                }

              });
    }
  }

  beginPlusOrDiscount(inventoryQuantityDTOList, isDisc) {
    if (isDisc == 1 || isDisc == 4) {


      // this.inventoriesService.putQuantity(id_Store,quantity,code,inventoryQuantityDTOList);


      try {
        inventoryQuantityDTOList.forEach(element => {
          this.inventoriesService.putQuantity(this.SelectedStore, element.quantity, element.code, inventoryQuantityDTOList, isDisc, element.id_storage).subscribe(result => {});
        });
        this.cancel();
      } catch {
        this.showNotification('top', 'center', 3, "<h3>El movimento presento <b>PROBLEMAS</b></h3> ", 'danger')
      }
    }
    if (isDisc == 2 || isDisc == 3) {


      try {
        inventoryQuantityDTOList.forEach(element => {
          CPrint(element);
          this.inventoriesService.putQuantity(this.SelectedStore, ((-1) * element.quantity), element.code, inventoryQuantityDTOList, isDisc, element.id_storage).subscribe(result => {});
        });
        this.showNotification('top', 'center', 3, "<h3>Se ha realizado el movimento <b>CORRECTAMENTE</b></h3> ", 'info');
        this.cancel();
      } catch {
        this.showNotification('top', 'center', 3, "<h3>El movimento presento <b>PROBLEMAS</b></h3> ", 'danger')
      }

    }

  }

  isfull() {
    return this.inventoryList.length == 0;
  }

  showNotification(from, align, id_type ? , msn ? , typeStr ? ) {
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

  individualDelete(code) {

    this.removalArray.add(code);
    this.removeItems()

  }

  openReportes(): void {
    const dialogRef = this.dialog.open(ReportesComponent, {
      width: '40vw',
      height: '60vh',
      data: {
        name: this.name,
        animal: this.animal
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      this.animal = result;
    });
  }

  upQuantity(code) {
    this.productsObject[code].quantity += 1;
  }

  downQuantity(code) {
    if (1 < this.productsObject[code].quantity) {
      this.productsObject[code].quantity -= 1;
    }
  }
}


export class pdfData {
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
  nombreCajero: String;
  cambio: number;
  direccion: String;
  telefono: String;
  cedula: String;
  cliente: String;
  direccionC: String;
  telefonoC: String;
  resolucion_DIAN: String;
  regimenT: String;
  prefix: String;
  initial_RANGE: String;
  final_RANGE: String;
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
              resolucion_DIAN: String,
              regimenT: String,
              prefix: String,
              initial_RANGE: String,
              final_RANGE: String,
              pdfSize: number) {
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


export class InventoryName {
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
              PRODUCT_STORE_CODE: string) {
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
