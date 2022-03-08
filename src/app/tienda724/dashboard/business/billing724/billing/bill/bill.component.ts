import {Component, ElementRef, OnInit, ViewChild, QueryList, ViewChildren} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import {FormBuilder, FormControl, Validators} from '@angular/forms';
import {LocalStorage} from '../../../../../../services/localStorage';
import {DatePipe} from '@angular/common';

import {MatDialog} from '@angular/material';
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
import {StoresComponent} from '../bill-main/stores/stores.component';
import {UpdateLegalDataComponent} from '../bill-main/update-legal-data/update-legal-data.component';
import {NewProductStoreComponent} from '../bill-main/new-product-store/new-product-store.component';
import {ThirdService} from '../../../../../../services/third.service';
import {BillInventoryComponentComponent} from '../bill-main/bill-inventory-component/bill-inventory-component.component';
import {paymentDetailDTO} from './../models/paymentDetailDTO';
import {stateDTO} from './../models/stateDTO';
import {GenerateThirdComponent2Component} from '../bill-main/generate-third-component2/generate-third-component2.component';
import {ThirdselectComponent} from '../thirdselect/thirdselect.component';
import * as jQuery from 'jquery';
import 'bootstrap-notify';
import {Router} from '@angular/router';
import {MatTableDataSourceWithCustomSort} from '../bill-main/pedidos/pedidos.component';
import {MatSort} from '@angular/material/sort';
import { ModalCrearPedidosComponent } from '../bill-main/modal-crear-pedidos/modal-crear-pedidos.component';
import { ModalCrearComoProveedorComponent } from '../bill-main/modal-crear-como-proveedor/modal-crear-como-proveedor.component';
import { ModalCambiarTerceroComponent } from '../bill-main/modal-cambiar-tercero/modal-cambiar-tercero.component';

let $: any = jQuery;

@Component({
  selector: 'app-bill',
  templateUrl: './bill.component.html',
  styleUrls: ['./bill.component.scss']
})
export class BillComponent implements OnInit {
  api_uri = Urlbase.tienda;
  ccClient = "";
  stores;
  SelectedStore = this.locStorage.getIdStore();
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
  item = 1;


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
    //return ["code","codigo_PROVEEDOR", "margen","description","quantity","priceGen","price","priceC","disccount","id_storage","tax","total"];
    return ["code","codigo_PROVEEDOR", "margen","description","quantity","priceC","disccount","tax","total_sin_iva", "total"];
  }

  genMargin(x,y){
    return ((1-(x / y))*100).toFixed(2);
  }
  // DTO's
  inventoryQuantityDTO: InventoryQuantityDTO;
  inventoryQuantityDTOList: InventoryQuantityDTO[];
  detailBillingDTOList: any[];
  commonStateDTO: CommonStateDTO;
  documentDTO: DocumentDTO;
  detailBillDTO: DetailBillDTO;
  detailBillDTOList: DetailBillDTO[];
  billDTO: BillDTO;


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
  @ViewChild('searchClientInput') private elementClientInput: ElementRef;
  @ViewChild('nameit') private elementRef: ElementRef;
  @ViewChild('nameot') private elementRef2: ElementRef;
  @ViewChildren('tableValue') tableValue;
  @ViewChildren('inputQuantity') inputQuantity;
  @ViewChildren('inputValorCompra') inputValorCompra;
  @ViewChildren('inputDescuento') inputDescuento;


  constructor(public router: Router, private datePipe: DatePipe, public thirdService: ThirdService,private http: HttpClient, public locStorage: LocalStorage,private fb: FormBuilder, private billingService: BillingService,
              public inventoriesService: InventoriesService, public dialog: MatDialog, private httpClient: HttpClient) {
    this.headers = new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization':  this.locStorage.getTokenValue(),
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
    this.billDTO = new BillDTO(this.SelectedStore,null, null, null, null, null, null, null, null, null, null, null, null, this.commonStateDTO, null, this.detailBillDTOList, this.documentDTO);
    this.createControls();
  }
  currentBox;
  idThird;
  myBox;
  cliente="---";
  id_person=0;

  obs = "";

  listaElem = [];

  openDialogCreateProduct(flag: boolean){
    const dialogRef = this.dialog.open(ModalCrearPedidosComponent, {
      width: '60vw',
      height: '80vh',
      data: {
        id_third: this.id_person,
        third_name: this.cliente,
        id_store_prov: this.SelectedProviderStore,
        id_third_document: this.clientData.document_number,
        flag: flag
      }
    });
    dialogRef.afterClosed().subscribe(result => {
      if(result.response){
        // this.http.get(Urlbase.tienda + "/products2/inventoryListCompra?id_store="+this.SelectedStore+"&id_store_prov="+this.SelectedProviderStore).subscribe(response => {
        //   this.inventoryList = response;
        //   this.addDetail2(result.code);
        // })
        this.getInventoryListCompraTMP(this.SelectedStore,this.SelectedProviderStore,result.code);

      }
    });
  }

  updateProvCode(element){
    this.http.put(Urlbase.tienda +"/store/updateCodProv?id_store="+this.SelectedProviderStore+"&codProv="+element.codigo_PROVEEDOR+"&ownbarcode="+element.code,{}).subscribe(response => {
      if(response==1){
        alert("Se acutalizo extiosamente el codigo proveedor");
        this.getInventoryListCompra(this.SelectedStore,this.SelectedProviderStore)
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


  searchClient2(){
    CPrint("THIS ARE HEADERS",this.headers);
    const identificacionCliente = this.ccClient;
    let aux;
    if(identificacionCliente.length>2){
    this.http.get<any[]>(Urlbase.tercero + '/persons/search?doc_person='+String(identificacionCliente),{ headers: this.headers }).subscribe(res =>{
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
            this.productsObject = [];
            this.dataSourceProductosSeleccionados = new MatTableDataSourceWithCustomSort(this.productsObject);
            this.inputForCode = "";

    this.listaElem = [];
            aux = this.locStorage.getPersonClient();
            CPrint("THIS THE AUX I NEED:", aux);



            this.http.get(Urlbase.tienda + "/store/get/2?id_third="+aux.id_PERSON).subscribe(
              responseList => {
                console.log("RESPONSE LIST: "+JSON.stringify(responseList))
              //@ts-ignore
              if(responseList.length <= 0){
                this.openDialogGenerateStore(aux);
              }else{
                this.providerStoreList = responseList;
                this.SelectedProviderStore = responseList[0].id_STORE;
                this.http.get(Urlbase.tienda + "/store/getIfIsOnParam?id_store_provider="+responseList[0].id_STORE+"&id_store_client="+this.SelectedStore).subscribe(response => {
                  if (response == 0 ){
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
                    this.http.post(Urlbase.tienda+"/store/createParamPedidos?id_store_provider="+responseList[0].id_STORE+"&id_store_client="+this.SelectedStore+"&id_third_cliente="+this.locStorage.getToken().id_third_father+"&id_third_employee_cliente="+this.locStorage.getToken().id_third+"&id_third_proveedor="+this.id_person,{}).subscribe(response2 => {
                      console.log("Console.log: ",response2)
                    })
                  }else{
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
                  }
                });
                if(this.SelectedStore == responseList[0].id_STORE){
                  alert("Esta tienda no es Valida, se reiniciara el componente");
                  this.cancel();
                }else{
                  this.getInventoryListCompra(this.SelectedStore, responseList[0].id_STORE);
                }
                this.StoreToReset = responseList[0].id_STORE;
              }


            })


            // this.http.get(Urlbase.tienda + "/products2/inventoryListCompra?id_store=" + this.SelectedStore + "&id_third_prov=" + aux.id_PERSON).subscribe(
            //   response => {
            //     console.log("INVENTORYLIST: ",response)
            //     this.inventoryList = response;
            //   }
            // );


            CPrint("THIS IS THE CLIENT",this.clientData);
            this.http.get(Urlbase.facturacion + "/billing/pedidos?id_store="+this.SelectedStore+"&id_third="+aux.id_PERSON).subscribe(r => {
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

          }
        });


      }


    });

  }else{
    this.showNotification('top', 'center', 3, "<h3>El elemento de busqueda debe ser de longitud mayor a 4.</h3> ", 'danger');
  }
  }

  getStores() {
    this.billingService.getStoresByThird(this.locStorage.getToken().id_third).subscribe(data => {
      CPrint(data);

      this.stores = data;
    })
  }

  storeChange(){



    const dialogRef = this.dialog.open(ModalCambiarTerceroComponent, {
      width: '60vw',
      data: {}
    });


    dialogRef.afterClosed().subscribe(result => {

      console.log("CHANGE SUTFF MODAL:",)

      if(result.response){

        this.http.get(Urlbase.tienda + "/store/getIfIsOnParam?id_store_provider="+this.SelectedProviderStore+"&id_store_client="+this.SelectedStore).subscribe(response => {
          if (response == 0 ){
              const dialogRef = this.dialog.open(ModalCrearComoProveedorComponent, {
                width: '60vw',
                data: {
                  proveedor: this.providerStoreList.find( element => element.id_STORE == this.SelectedProviderStore ).store_NAME
                }
              });

              dialogRef.afterClosed().subscribe(result => {
                if (result.response) {
                  this.http.post(Urlbase.tienda+"/store/createParamPedidos?id_store_provider="+this.SelectedProviderStore+"&id_store_client="+this.SelectedStore+"&id_third_cliente="+this.locStorage.getToken().id_third_father+"&id_third_employee_cliente="+this.locStorage.getToken().id_third+"&id_third_proveedor="+this.id_person,{}).subscribe(response2 => {
                    console.log("Console.log: ",response2)
                  })
                }else{
                  this.cancel();
                }
              });

          }
        });

        this.getInventoryListCompra(this.SelectedStore,this.SelectedProviderStore);
        this.productsObject = [];
        this.dataSourceProductosSeleccionados = new MatTableDataSourceWithCustomSort(this.productsObject);
        this.listaElem = [];
        this.inputForCode = "";
        setTimeout(() => {

          this.elementRef.nativeElement.focus();
          this.elementRef.nativeElement.select();

        }, 100);

      }else{

        this.SelectedProviderStore = this.StoreToReset;

      }

    })
  }


  storeChange2(){
    this.ngOnInit();
    this.cancel();

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



providerStoreList;
SelectedProviderStore;
StoreToReset;
  openDialogClient2(): void {



    const dialogRef = this.dialog.open(GenerateThirdComponent2Component, {
      width: '60vw',
      data: {}
    });


    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // CPrint('CREATE CLIENT SUCCESS');
        // CPrint(result);s
        if(result.isPerson){
          console.log("NES THIRD 2:",result)
          this.id_person = result.idThird;
          this.cliente = result.person.profile.first_name + " " + result.person.profile.first_lastname;
          this.clientData.document_type = result.person.profile.info.id_document_type;
          this.clientData.document_number = result.person.profile.info.document_number;
          this.clientData.address = result.person.profile.directory.address;
          this.clientData.phone = result.person.profile.directory.phones[0].phone;
          console.log(Urlbase.tienda + "/store/crearTiendaCliente?idthirdprop="+(-777)+"&idthirdempresa="+this.id_person+"&storename="+this.cliente+"&estienda="+'S'+"&username="+result.person.profile.info.document_number+"&copiaproductos="+'N'+"&esproveedor="+'S'+"&idstorecliente="+this.SelectedStore+"&idtempcliente="+this.locStorage.getToken().id_third);
          this.http.post(Urlbase.tienda + "/store/crearTiendaCliente?idthirdprop="+(-777)+"&idthirdempresa="+this.id_person+"&storename="+this.cliente+"&estienda="+'S'+"&username="+result.person.profile.info.document_number+"&copiaproductos="+'N'+"&esproveedor="+'S'+"&idstorecliente="+this.SelectedStore+"&idtempcliente="+this.locStorage.getToken().id_third,{}).subscribe(
            response => {
              console.log("RESPONSE IS: "+response);
              this.http.get(Urlbase.tienda + "/store/get/2?id_third="+this.id_person).subscribe(
                responseList => {
                  // if(this.SelectedStore == responseList[0].id_STORE){
                  //   alert("Esta tienda no es Valida, se reiniciara el componente");
                  //   this.cancel();
                  // }else{
                  console.log("RESPONSE LIST: "+JSON.stringify(responseList))
                this.providerStoreList = responseList;
                this.SelectedProviderStore = responseList[0].id_STORE;
                this.http.get(Urlbase.tienda + "/store/getIfIsOnParam?id_store_provider="+responseList[0].id_STORE+"&id_store_client="+this.SelectedStore).subscribe(response => {
                  if (response == 0 ){
                    console.log("in mod")
                      const dialogRef = this.dialog.open(ModalCrearComoProveedorComponent, {
                        width: '60vw',
                        data: {
                          proveedor: responseList[0].store_NAME
                        }
                      });

                      dialogRef.afterClosed().subscribe(result => {
                        if (result.response) {
                          this.http.post(Urlbase.tienda+"/store/createParamPedidos?id_store_provider="+responseList[0].id_STORE+"&id_store_client="+this.SelectedStore+"&id_third_cliente="+this.locStorage.getToken().id_third_father+"&id_third_employee_cliente="+this.locStorage.getToken().id_third+"&id_third_proveedor="+this.id_person,{}).subscribe(response2 => {
                            console.log("Console.log: ",response2)
                          })
                        }else{
                          this.cancel();
                        }
                      });
                  }
                });
                this.StoreToReset = responseList[0].id_STORE;

                  this.getInventoryListCompra(this.SelectedStore, responseList[0].id_STORE);
               //}
              })
            }
          )
        }else{
          console.log("NES THIRD 3:",result)
          this.id_person = result.idThird;
          this.cliente = result.emp.info.fullname;
          this.clientData.document_type = result.emp.info.id_document_type;
          this.clientData.document_number = result.emp.info.document_number;
          this.clientData.address = result.emp.directory.address;
          this.clientData.phone = result.emp.directory.phones[0].phone;
          console.log(Urlbase.tienda + "/store/crearTiendaCliente?idthirdprop="+(-777)+"&idthirdempresa="+this.id_person+"&storename="+this.cliente+"&estienda="+'S'+"&username="+result.emp.info.document_number+"&copiaproductos="+'N'+"&esproveedor="+'S'+"&idstorecliente="+this.SelectedStore+"&idtempcliente="+this.locStorage.getToken().id_third)
          this.http.post(Urlbase.tienda + "/store/crearTiendaCliente?idthirdprop="+(-777)+"&idthirdempresa="+this.id_person+"&storename="+this.cliente+"&estienda="+'S'+"&username="+result.emp.info.document_number+"&copiaproductos="+'N'+"&esproveedor="+'S'+"&idstorecliente="+this.SelectedStore+"&idtempcliente="+this.locStorage.getToken().id_third,{}).subscribe(
            response => {
              console.log("RESPONSE IS: "+response);
              this.http.get(Urlbase.tienda + "/store/get/2?id_third="+this.id_person).subscribe(
                responseList => {
                  console.log("RESPONSE LIST: "+JSON.stringify(responseList))
                this.providerStoreList = responseList;
                this.SelectedProviderStore = responseList[0].id_STORE;
                this.http.get(Urlbase.tienda + "/store/getIfIsOnParam?id_store_provider="+responseList[0].id_STORE+"&id_store_client="+this.SelectedStore).subscribe(response => {
                  if (response == 0 ){
                      const dialogRef = this.dialog.open(ModalCrearComoProveedorComponent, {
                        width: '60vw',
                        data: {
                          proveedor: responseList[0].store_NAME
                        }
                      });

                      dialogRef.afterClosed().subscribe(result => {
                        if (result.response) {
                          this.http.post(Urlbase.tienda+"/store/createParamPedidos?id_store_provider="+responseList[0].id_STORE+"&id_store_client="+this.SelectedStore+"&id_third_cliente="+this.locStorage.getToken().id_third_father+"&id_third_employee_cliente="+this.locStorage.getToken().id_third+"&id_third_proveedor="+this.id_person,{}).subscribe(response2 => {
                            console.log("Console.log: ",response2)
                          })
                        }else{
                          this.cancel();
                        }
                      });

                  }
                });
                this.StoreToReset = responseList[0].id_STORE;
                if(this.SelectedStore == responseList[0].id_STORE){
                  alert("Esta tienda no es Valida, se reiniciara el componente");
                  this.cancel();
                }else{
                  this.getInventoryListCompra(this.SelectedStore, responseList[0].id_STORE);
                }
              })
            }
          )
        }


        setTimeout(() => {

          this.elementRef.nativeElement.focus();
          this.elementRef.nativeElement.select();

        }, 100);
      }
      setTimeout(() => {

        this.elementRef.nativeElement.focus();
        this.elementRef.nativeElement.select();

      }, 100);
    });
  }


  openDialogRegisterStore(name){

  }


  openDialogGenerateStore(aux): void {


 console.log("im mod3")
    const dialogRef = this.dialog.open(ModalCrearComoProveedorComponent, {
      width: '60vw',
      data: {
        proveedor: aux.fullname
      }
    });


    dialogRef.afterClosed().subscribe(result => {
      if (result.response) {
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
        console.log(Urlbase.tienda + "/store/crearTiendaCliente?idthirdprop="+(-777)+"&idthirdempresa="+this.id_person+"&storename="+aux.fullname+"&estienda="+'S'+"&username="+this.clientData.document_number+"&copiaproductos="+'N'+"&esproveedor="+'S'+"&idstorecliente="+this.SelectedStore+"&idtempcliente="+this.locStorage.getToken().id_third)
        this.http.post(Urlbase.tienda + "/store/crearTiendaCliente?idthirdprop="+(-777)+"&idthirdempresa="+this.id_person+"&storename="+aux.fullname+"&estienda="+'S'+"&username="+this.clientData.document_number+"&copiaproductos="+'N'+"&esproveedor="+'S'+"&idstorecliente="+this.SelectedStore+"&idtempcliente="+this.locStorage.getToken().id_third,{}).subscribe(
          response => {
            console.log("RESPONSE IS: "+response);
            this.http.get(Urlbase.tienda + "/store/get/2?id_third="+this.id_person).subscribe(
              responseList => {
                console.log("RESPONSE LIST: "+JSON.stringify(responseList))
              this.providerStoreList = responseList;
              this.SelectedProviderStore = responseList[0].id_STORE;

              CPrint("THIS THE AUX I NEED:", aux);


              this.http.get(Urlbase.tienda + "/store/getIfIsOnParam?id_store_provider="+responseList[0].id_STORE+"&id_store_client="+this.SelectedStore).subscribe(response => {
                if (response == 0 ){
                  console.log("im mod4")
                    const dialogRef = this.dialog.open(ModalCrearComoProveedorComponent, {
                      width: '60vw',
                      data: {
                        proveedor: responseList[0].store_NAME
                      }
                    });

                    dialogRef.afterClosed().subscribe(result => {
                      if (result.response) {
                        this.http.post(Urlbase.tienda+"/store/createParamPedidos?id_store_provider="+responseList[0].id_STORE+"&id_store_client="+this.SelectedStore+"&id_third_cliente="+this.locStorage.getToken().id_third_father+"&id_third_employee_cliente="+this.locStorage.getToken().id_third+"&id_third_proveedor="+this.id_person,{}).subscribe(response2 => {
                          console.log("Console.log: ",response2)
                        })
                      }else{
                        this.cancel();
                      }
                    });

                }
              });

              this.StoreToReset = responseList[0].id_STORE;
              if(this.SelectedStore == responseList[0].id_STORE){
                alert("Esta tienda no es Valida, se reiniciara el componente");
                this.cancel();
              }else{
                this.getInventoryListCompra(this.SelectedStore, responseList[0].id_STORE);
              }
            })
          }
        )
      }
    });
  }

  async getInventoryListCompraTMP(store1, store2,code){
    console.log("PIN: ", store1, "PIN2: ", store2, "URL: ",Urlbase.tienda + "/products2/inventoryListCompra?id_store="+store1+"&id_store_prov="+store2);
    this.http.get(Urlbase.tienda + "/products2/inventoryListCompra?id_store="+store1+"&id_store_prov="+store2).subscribe(response => {
      this.inventoryList = response;
      setTimeout(() => {

        this.addDetail2(code)

      }, 100);
    })
  }

   getInventoryListCompra(store1, store2){
    console.log("PIN: ", store1, "PIN2: ", store2, "URL: ",Urlbase.tienda + "/products2/inventoryListCompra?id_store="+store1+"&id_store_prov="+store2);
    this.http.get(Urlbase.tienda + "/products2/inventoryListCompra?id_store="+store1+"&id_store_prov="+store2).subscribe(response => {
      console.log("PON: ",response);
      this.inventoryList = response;
    })
  }

  searchClient(event){
    const identificacionCliente = String(event.target.value);
    let aux;
    if(identificacionCliente.length>2){
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

            this.productsObject = [];
            this.dataSourceProductosSeleccionados = new MatTableDataSourceWithCustomSort(this.productsObject);
            this.inputForCode = "";

            this.listaElem = [];
            aux = this.locStorage.getPersonClient();
            CPrint("THIS THE AUX I NEED:", aux);
            CPrint("THIS IS THE CLIENT",this.clientData);
            CPrint("THIS IS THE CLIENT",this.clientData);
            this.http.get(Urlbase.tienda + "/store/get/2?id_third="+aux.id_PERSON).subscribe(
              responseList => {
                // if(this.SelectedStore == responseList[0].id_STORE){
                //   alert("Esta tienda no es Valida, se reiniciara el componente");
                //   this.cancel();
                // }else{
                console.log("RESPONSE LIST: "+JSON.stringify(responseList))
                //@ts-ignore
                if(responseList.length <= 0){
                  this.openDialogGenerateStore(aux);
                }else{


                  this.providerStoreList = responseList;
                  this.SelectedProviderStore = responseList[0].id_STORE;
                  this.http.get(Urlbase.tienda + "/store/getIfIsOnParam?id_store_provider="+responseList[0].id_STORE+"&id_store_client="+this.SelectedStore).subscribe(response => {
                if (response == 0 ){
                  console.log("in mod2")
                    const dialogRef = this.dialog.open(ModalCrearComoProveedorComponent, {
                      width: '60vw',
                      data: {
                        proveedor: responseList[0].store_NAME
                      }
                    });

                    dialogRef.afterClosed().subscribe(result => {
                      if (result.response) {
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
                        this.http.post(Urlbase.tienda+"/store/createParamPedidos?id_store_provider="+responseList[0].id_STORE+"&id_store_client="+this.SelectedStore+"&id_third_cliente="+this.locStorage.getToken().id_third_father+"&id_third_employee_cliente="+this.locStorage.getToken().id_third+"&id_third_proveedor="+this.id_person,{}).subscribe(response2 => {
                          console.log("Console.log: ",response2)
                        })
                      }else{
                        this.cancel();
                      }
                    });

                }else{
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
                }
              });
                  this.StoreToReset = responseList[0].id_STORE;

                    this.getInventoryListCompra(this.SelectedStore, responseList[0].id_STORE);
                  }
               // }


            })
            // this.http.get(Urlbase.tienda + "/products2/inventoryListCompra?id_store=" + this.SelectedStore + "&id_third_prov=" + aux.id_PERSON).subscribe(
            //   response => {
            //     console.log("INVENTORYLIST: ",response)
            //     this.inventoryList = response;
            //   }
            // );
            this.http.get(Urlbase.facturacion + "/billing/pedidos?id_store="+this.SelectedStore+"&id_third="+aux.id_PERSON).subscribe(r => {
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

          }
          setTimeout(() => {

            this.elementRef.nativeElement.focus();
            this.elementRef.nativeElement.select();

          }, 100);
        });
      }
    });
  }else{
    this.showNotification('top', 'center', 3, "<h3>El elemento de busqueda debe ser de longitud mayor a 4.</h3> ", 'danger');
  }
  }

  quickConfirm(){
    this.sendData({clientData:this.clientData,
      cambio:0,
      wayToPay: "contado",
      cash: this.roundnum(this.calculateTotal()),
      creditBank: "",
      debitBank: "",
      observations: this.obs,
      paymentMethod: "efectivo",
      transactionCode: " ",});
  }

  roundnum(num){
    return Math.round(num / 50)*50;
  }


  sendData(data){

    let detailList = '';
    //GENERO LA LISTA DE DTOs DE DETALLES
    this.productsObject.forEach(item => {
      CPrint(item);
      detailList = detailList+ "{"+item.id_product_third+","+(item.standarBuyPrice-(item.standarBuyPrice*item.disccount/100))+","+item.tax_product+","+item.quantity+"},"
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
      this.billDTO.id_store = this.SelectedStore;
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
          idstore:this.SelectedStore,
          idthirddomiciliario:-1,
          idpaymentmethod:this.paymentDetailFinal.id_payment_method,
          idwaytopay:this.paymentDetailFinal.id_way_to_pay,
          approvalcode:this.paymentDetailFinal.aprobation_code,
          idbankentity:1,
          idbillstate:1,
          details: detailList.substring(0, detailList.length - 1),
          disccount: 0,
          num_documento_factura: this.datos}));

        this.httpClient.post(Urlbase.facturacion+"/billing/v2",{idthirdemployee:this.billDTO.id_third,
          idthird:this.billDTO.id_third_employee,
          idbilltype:this.billDTO.id_bill_type,
          notes:this.billDTO.documentDTO.body,
          idthirddestinity:this.billDTO.id_third_destiny,
          idcaja:this.locStorage.getIdCaja(),
          idstore:this.SelectedStore,
          idthirddomiciliario:-1,
          idpaymentmethod:this.paymentDetailFinal.id_payment_method,
          idwaytopay:this.paymentDetailFinal.id_way_to_pay,
          approvalcode:this.paymentDetailFinal.aprobation_code,
          idbankentity:1,
          idbillstate:1,
          details: detailList.substring(0, detailList.length - 1),
          disccount: 0,
          num_documento_factura: this.datos,
          idthirdvendedor: -1}).subscribe(idBill => {
            if(idBill != 0){
            this.showNotification('top', 'center', 3, "<h3>Se ha realizado el movimento <b>CORRECTAMENTE</b></h3> ", 'info');

            try{
              this.item = this.pedidosList.filter(ele => ele.id_BILL == this.SelectedPedido )[0].numdocumento;
            }catch(e){
              this.item = 1;
            }
            this.httpClient.put(Urlbase.facturacion+"/billing/billCompra?id_bill="+idBill+"&dato="+ this.item +"&fecha="+this.transformDate(this.date3),this.options,{responseType: 'text'}).subscribe(
              () =>{
                this.http.get(Urlbase.facturacion+"/billing/validatePdfDrawing?idbill="+idBill).subscribe(element => {
                this.httpClient.get(Urlbase.facturacion+"/billing/UniversalPDF?id_bill="+idBill+"&pdf=-1&cash=0&size="+false,{responseType: 'text'}).subscribe(response =>{
                  //-----------------------------------------------------------------------------------------------------------------
                  window.open(Urlbase.facturas+"/"+response, "_blank");
                  setTimeout(() => {
                    this.cancel();
                    this.elementRef.nativeElement.focus();
                    this.elementRef.nativeElement.select();

                  }, 100);
                  //-----------------------------------------------------------------------------------------------------------------
                }
                );
              }
            );

          });

        }else{
          this.showNotification('top', 'center', 3, "<h3>Se presento un problema al generar la factura.</h3> ", 'danger');
        } })
      }
    }else{
      this.billDTO.id_store = this.SelectedStore;
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
          idstore:this.SelectedStore,
          idthirddomiciliario:-1,
          idpaymentmethod:this.paymentDetailFinal.id_payment_method,
          idwaytopay:this.paymentDetailFinal.id_way_to_pay,
          approvalcode:this.paymentDetailFinal.aprobation_code,
          idbankentity:1,
          idbillstate:1,
          details: detailList.substring(0, detailList.length - 1),
          disccount: 0,
          num_documento_factura: this.datos}));

        this.httpClient.post(Urlbase.facturacion+"/billing/v2",{idthirdemployee:this.billDTO.id_third,
          idthird:this.billDTO.id_third_employee,
          idbilltype:this.billDTO.id_bill_type,
          notes:this.billDTO.documentDTO.body,
          idthirddestinity:this.billDTO.id_third_destiny,
          idcaja:this.locStorage.getIdCaja(),
          idstore:this.SelectedStore,
          idthirddomiciliario:-1,
          idpaymentmethod:this.paymentDetailFinal.id_payment_method,
          idwaytopay:this.paymentDetailFinal.id_way_to_pay,
          approvalcode:this.paymentDetailFinal.aprobation_code,
          idbankentity:1,
          idbillstate:1,
          details: detailList.substring(0, detailList.length - 1),
          disccount: 0,
          num_documento_factura: this.datos,
          idthirdvendedor: -1}).subscribe(idBill => {
            if(idBill!=0){
              try{
                this.item = this.pedidosList.filter(ele => ele.id_BILL == this.SelectedPedido )[0].numdocumento;
              }catch(e){
                this.item = 1;
              }
            this.httpClient.put(Urlbase.facturacion+"/billing/billCompra?id_bill="+idBill+"&dato="+this.item+"&fecha="+this.transformDate(this.date3),this.options,{responseType: 'text'}).subscribe(
              () =>{
                this.http.get(Urlbase.facturacion+"/billing/validatePdfDrawing?idbill="+idBill).subscribe(element => {
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
                }
                );
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
      this.billDTO.id_store = this.SelectedStore;
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
                          this.http.get(Urlbase.facturacion+"/billing/validatePdfDrawing?idbill="+result).subscribe(element => {
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
      this.billDTO.id_store = this.SelectedStore;
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
                      this.http.get(Urlbase.facturacion+"/billing/validatePdfDrawing?idbill="+result).subscribe(element => {
                      this.httpClient.get(Urlbase.facturacion+"/billing/UniversalPDF?id_bill="+result+"&pdf=-1&cash=0&size="+false,{responseType: 'text'}).subscribe(response => {
                        CPrint(response);
                        window.open(Urlbase.facturas+"/"+response, "_blank");
                        this.showNotification('top', 'center', 3, "<h3>Se ha realizado el movimento <b>CORRECTAMENTE</b></h3> ", 'info');
                        setTimeout(() => {

                          this.elementRef.nativeElement.focus();
                          this.elementRef.nativeElement.select();

                        }, 100);
                        });
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
      this.getElemsIfProvCode().then(() => {
        this.getElemsIfOwn().then(() => {
          this.getElemsIfcode().then(() => {

            //inserto elementos si name
            this.inventoryList.forEach(element => {
              if(element.product_STORE_NAME.toLowerCase( ).includes(this.inputForCode.toLowerCase()) && !(this.listaElem.includes(element)) && !this.listaElem.some(item => item.code === element.code)){
                this.listaElem.push(element);

              }
            });
            this.EstadoBusquedaProducto = 2;
          })
        })
      });
    })

  }

  async getElemsIfOwn(){
    this.inventoryList.forEach(element => {
      if(element.ownbarcode==this.inputForCode && !(this.listaElem.includes(element))&& !this.listaElem.some(item => item.code === element.code)){
        this.listaElem.push(element);
      }
    })
  }

  async getElemsIfProvCode(){
    this.inventoryList.forEach(element => {
      try{
        if(element.codigo_PROVEEDOR.toLowerCase().includes(this.inputForCode.toLowerCase()) && !(this.listaElem.includes(element))&& !this.listaElem.some(item => item.code === element.code)){
          this.listaElem.push(element);
        }
      }catch(e){
      }
    })
  }

  async getElemsIfcode(){
    this.inventoryList.forEach(ele => {
      //@ts-ignore
      if(ele.product_STORE_CODE==this.inputForCode && !(this.listaElem.includes(ele))&& !this.listaElem.some(item => item.code === ele.code)){
        this.listaElem.push(ele);
      }
    })
  }

  id_menu = 144;
  pedidosList=[];
  SelectedPedido="-1";

  ngOnInit() {
    //this.getInventoryList(this.locStorage.getIdStore());
    this.getStores();
    //PROTECCION URL INICIA
    CPrint(JSON.stringify(this.locStorage.getMenu()));
    const elem = this.locStorage.getMenu().find(item => item.id_menu == this.id_menu);

    if(!elem){
      // noinspection JSIgnoredPromiseFromCall
      this.router.navigateByUrl("/dashboard/business/movement/nopermision");
    }
    //PROTECCION URL TERMINA
    setTimeout(() => {

      this.elementClientInput.nativeElement.focus();
      this.elementClientInput.nativeElement.select();

    }, 100);
    let idPerson = this.locStorage.getPerson().id_person;
    CPrint("ID CAJA: ", this.locStorage.getIdCaja());
    CPrint("ID STORE: ", this.SelectedStore);
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
    this.getCodes();
    localStorage.getItem('currentUser');
    this.options = { headers: this.headers };
    this.getStorages();
  }

  loadDetails(){
    this.productsObject = []
    this.http.get(Urlbase.facturacion + "/billing/detail?id_bill="+this.SelectedPedido).subscribe(r => {
      //@ts-ignore
      r.forEach(element => {
          CPrint(element)
          this.addDetail3(element[3],Number(element[0]),Number(element[6]),Number(element[7]));
      });
    })
  }


  addDetail3(code,quantity,priceCompra,idTax) {
    let key: any = null;
    this.productsObject.forEach(item => {
      if(item.code == code || item.ownbarcode == code || String(item.product_store_code) == code ){
        key = item;
      }
    });
    if (key != null) {
      this.productsObject[this.productsObject.indexOf(key)].quantity = quantity;
    } else {
      const product = this.inventoryList.find(item => (item.code == code || item.ownbarcode == code || String(item.product_STORE_CODE) == code || item.codigo_PROVEEDOR == code || item.codigo_PROVEEDOR_hidden == code));
      CPrint("this is price product: ", this.priceList);
      CPrint("this is my product: ", product);

      if(product){
        if(product.codigo_PROVEEDOR != null){

          const newProduct = this.inventoryList.find(item => (item.code == product.code || item.ownbarcode == product.code || String(item.product_STORE_CODE) == product.code || item.codigo_PROVEEDOR == product.code || item.codigo_PROVEEDOR_hidden == product.code) && item.id_PRODUCT_STORE != product.id_PRODUCT_STORE);
          console.log("THIS IS MY PRODUCT 2: ", newProduct)
          newProduct.codigo_PROVEEDOR = product.codigo_PROVEEDOR;
          console.log("THIS IS MY PRODUCT 2 with new ProvCode: ", newProduct)
          //@ts-ignore
          if(newProduct){
            this.getPriceList2(newProduct,code,newProduct.id_PRODUCT_STORE,quantity,priceCompra,idTax);

          }else{
            this.getPriceList2(newProduct,code,-1,quantity,priceCompra,idTax);

          }
        }else{

          //@ts-ignore
          if(product){
            this.getPriceList2(product,code,product.id_PRODUCT_STORE,quantity,priceCompra,idTax);

          }else{
            this.getPriceList2(product,code,-1,quantity,priceCompra,idTax);

          }

        }
      }else{

        alert('Ese codigo no esta asociado a un producto.');
        setTimeout(() => {

          this.elementRef.nativeElement.focus();
          this.elementRef.nativeElement.select();

          this.elementRef.nativeElement.disabled = false;

        }, 150);

      }



    }
    // else {
    //   const product = this.inventoryList.find(item => (item.code == code || item.ownbarcode == code || String(item.product_STORE_CODE) == code));
    //   //@ts-ignore
    //   if(product){
    //     this.getPriceList2(product,code,product.id_PRODUCT_STORE,quantity,priceCompra,idTax);
    //     setTimeout(() => {

    //       this.elementRef2.nativeElement.focus();
    //       this.elementRef2.nativeElement.select();

    //     }, 100);
    //   }else{
    //     alert('Ese codigo no esta asociado a un producto.');
    //     this.openDialogCreateProduct(true)
    //   }
    // }
  }

  disableDoubleClickSearch = false;
  addDetail2(code) {

    this.elementRef.nativeElement.disabled = true;
    CPrint("THIS IS DATA: ",this.productsObject);
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
      if(item.code == code || item.ownbarcode == code || String(item.product_store_code) == code || item.codigo_PROVEEDOR == code || item.codigo_PROVEEDOR_hidden == code){
        key = item;
      }
      // else{
      // }
    });
    // CPrint("this is array papu: ",this.productsObject)
    // CPrint("this is key", key)
    console.log("THIS IS KEY: ", key)
    if (key != null) {
      // CPrint("entro")
      this.productsObject[this.productsObject.indexOf(key)].quantity += 1;

      //OBTENGO POSICION O INDEX DEL ELEMENTO
      let index = this.tableValue.toArray().indexOf(this.tableValue.toArray().find(element => element.nativeElement.value == this.productsObject[this.productsObject.indexOf(key)].code));
      setTimeout(() => {

        this.inputQuantity.toArray()[index].nativeElement.focus();
        this.inputQuantity.toArray()[index].nativeElement.select();
        this.elementRef.nativeElement.disabled = false;

      }, 50);
    } else {
      const product = this.inventoryList.find(item => (item.code == code || item.ownbarcode == code || String(item.product_STORE_CODE) == code || item.codigo_PROVEEDOR == code || item.codigo_PROVEEDOR_hidden == code));
      CPrint("this is price product: ", this.priceList);
      CPrint("this is my product: ", product);

      if(product){
        if(product.codigo_PROVEEDOR != null){

          const newProduct = this.inventoryList.find(item => (item.code == product.code || item.ownbarcode == product.code || String(item.product_STORE_CODE) == product.code || item.codigo_PROVEEDOR == product.code || item.codigo_PROVEEDOR_hidden == product.code) && item.id_PRODUCT_STORE != product.id_PRODUCT_STORE);
          console.log("THIS IS MY PRODUCT 2: ", newProduct)
          newProduct.codigo_PROVEEDOR = product.codigo_PROVEEDOR;
          console.log("THIS IS MY PRODUCT 2 with new ProvCode: ", newProduct)
          //@ts-ignore
          if(newProduct){
            this.getPriceList(newProduct,code,newProduct.id_PRODUCT_STORE);

          }else{
            this.getPriceList(newProduct,code,-1);

          }
        }else{

          //@ts-ignore
          if(product){
            this.getPriceList(product,code,product.id_PRODUCT_STORE);

          }else{
            this.getPriceList(product,code,-1);

          }

        }
      }else{

        this.openDialogCreateProduct(true);
        setTimeout(() => {

          this.elementRef.nativeElement.focus();
          this.elementRef.nativeElement.select();

          this.elementRef.nativeElement.disabled = false;

        }, 150);

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
    this.httpClient.get(Urlbase.tienda+"/store/s?id_store="+this.SelectedStore).subscribe((res)=>{
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
    console.log("RECEIVED PRODUCT: ",product);
    CPrint("id is: ",id);
    this.httpClient.get(Urlbase.tienda+"/store/pricelist?id_product_store="+id).subscribe(response => {
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
          tax_product: String(product.id_TAX),
          state: this.commonStateDTO,
          description: product.product_STORE_NAME,
          code: product.code,
          id_inventory_detail: product.id_INVENTORY_DETAIL,
          ownbarcode: product.ownbarcode,
          product_store_code: String(product.product_STORE_CODE),
          pricelist: response,
          priceGen: response[0].price,
          standarPrice: product.standard_PRICE,
          standarBuyPrice: product.standard_PRICE,
          productStoreId: id,
          disccount: 0,
          codigo_PROVEEDOR: product.codigo_PROVEEDOR,
          codigo_PROVEEDOR_hidden: product.codigo_PROVEEDOR

        };
        new_product.price = product.standard_PRICE;

        //this.detailBillDTOList.push(new_product);

        let key: any = null;

        this.productsObject.forEach(item => {
          if(item.code == code || item.ownbarcode == code || String(item.product_store_code) == code ){
            key = item;
          }
        });
        if (key != null) {
          this.productsObject[this.productsObject.indexOf(key)].quantity += 1;
          setTimeout(() => {

            this.inputQuantity.toArray()[this.inputQuantity.toArray().length-1].nativeElement.focus();
            this.inputQuantity.toArray()[this.inputQuantity.toArray().length-1].nativeElement.select();
            this.elementRef.nativeElement.disabled = false;
          }, 1);
        } else {
          this.productsObject.unshift(new_product);
          this.dataSourceProductosSeleccionados = new MatTableDataSourceWithCustomSort(this.productsObject);
          this.dataSourceProductosSeleccionados.sort = this.sort;
          setTimeout(() => {

            this.inputQuantity.toArray()[this.inputQuantity.toArray().length-1].nativeElement.focus();
            this.inputQuantity.toArray()[this.inputQuantity.toArray().length-1].nativeElement.select();
            this.elementRef.nativeElement.disabled = false;
          }, 1);
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
            this.openDialogCreateProduct(true);
            this.elementRef.nativeElement.disabled = false;
          }else{
            this.openDialogCreateProduct(true);
            // let dialogRef;
            // dialogRef = this.dialog.open(NewProductStoreComponent, {
            //   width: '30vw',
            //   data: {codeList: codeList[0]}
            // });
            // dialogRef.afterClosed().subscribe(()=>{
            //   this.elementRef.nativeElement.disabled = false;
            //   this.ngOnInit()
            // })

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


  reload(){
    CPrint("RELOAD");
    this.ngOnInit();
  }



  getPriceList2(product,code,id,quantity,priceCompra,idTax){
    CPrint("id is: ",id);
    this.httpClient.get(Urlbase.tienda+"/store/pricelist?id_product_store="+id).subscribe(response => {
      CPrint("This is picked price list: ",response);
      const datos = response;
      CPrint("this is datos: ",datos);
      if (product) {
        let new_product = {
          quantity: quantity,
          id_storage: this.storageList[0].id_storage,
          price: product.standard_PRICE,
          tax: this.getPercentTax(idTax),
          id_product_third: product.id_PRODUCT_STORE,
          tax_product: String(idTax),
          state: this.commonStateDTO,
          description: product.product_STORE_NAME,
          code: product.code,
          id_inventory_detail: product.id_INVENTORY_DETAIL,
          ownbarcode: product.ownbarcode,
          product_store_code: String(product.product_STORE_CODE),
          pricelist: response,
          priceGen: response[0].price,
          standarPrice: product.standard_PRICE,
          standarBuyPrice: priceCompra,
          productStoreId: id,
          disccount: 0,
          codigo_PROVEEDOR : product.codigo_PROVEEDOR,
          codigo_PROVEEDOR_hidden: product.codigo_PROVEEDOR
        };
        new_product.price = product.standard_PRICE;

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
            alert('Product not exist');
            this.openDialogCreateProduct(true);
          }else{
            this.openDialogCreateProduct(true);
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
    this.elementRef.nativeElement.disabled = true;
    CPrint("THIS IS DATA: ",this.productsObject);
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
      if(item.code == code || item.ownbarcode == code || String(item.product_store_code) == code || item.codigo_PROVEEDOR == code || item.codigo_PROVEEDOR_hidden == code){
        key = item;
      }
      // else{
      // }
    });
    // CPrint("this is array papu: ",this.productsObject)
    // CPrint("this is key", key)
    console.log("THIS IS KEY: ", key)
    if (key != null) {
      // CPrint("entro")
      this.productsObject[this.productsObject.indexOf(key)].quantity += 1;
      event.target.value = '';

      //OBTENGO POSICION O INDEX DEL ELEMENTO
      let index = this.tableValue.toArray().indexOf(this.tableValue.toArray().find(element => element.nativeElement.value == this.productsObject[this.productsObject.indexOf(key)].code));
      setTimeout(() => {

        this.inputQuantity.toArray()[index].nativeElement.focus();
        this.inputQuantity.toArray()[index].nativeElement.select();
        this.elementRef.nativeElement.disabled = false;

      }, 50);
    } else {
      const product = this.inventoryList.find(item => (item.code == code || item.ownbarcode == code || String(item.product_STORE_CODE) == code || item.codigo_PROVEEDOR == code || item.codigo_PROVEEDOR_hidden == code));
      CPrint("this is price product: ", this.priceList);
      CPrint("this is my product: ", product);

      if(product){
        if(product.codigo_PROVEEDOR != null){

          const newProduct = this.inventoryList.find(item => (item.code == product.code || item.ownbarcode == product.code || String(item.product_STORE_CODE) == product.code || item.codigo_PROVEEDOR == product.code || item.codigo_PROVEEDOR_hidden == product.code) && item.id_PRODUCT_STORE != product.id_PRODUCT_STORE);
          console.log("THIS IS MY PRODUCT 2: ", newProduct)
          newProduct.codigo_PROVEEDOR = product.codigo_PROVEEDOR;
          console.log("THIS IS MY PRODUCT 2 with new ProvCode: ", newProduct)
          //@ts-ignore
          if(newProduct){
            this.getPriceList(newProduct,code,newProduct.id_PRODUCT_STORE);

          }else{
            this.getPriceList(newProduct,code,-1);

          }
        }else{

          //@ts-ignore
          if(product){
            this.getPriceList(product,code,product.id_PRODUCT_STORE);

          }else{
            this.getPriceList(product,code,-1);

          }

        }
      }else{

        this.openDialogCreateProduct(true);
        setTimeout(() => {

          this.elementRef.nativeElement.focus();
          this.elementRef.nativeElement.select();

          this.elementRef.nativeElement.disabled = false;

        }, 150);

      }



    }
  }

  quantityUp(element2){


    let index = this.tableValue.toArray().indexOf(this.tableValue.toArray().find(element => element.nativeElement.value == element2.code));


    this.inputQuantity.toArray()[index].nativeElement.disabled = true;

    setTimeout(() => {

      this.inputValorCompra.toArray()[index].nativeElement.focus();
      this.inputValorCompra.toArray()[index].nativeElement.select();

      this.inputQuantity.toArray()[index].nativeElement.disabled = false;

    }, 150);

  }


  compraUp(element2){

    let index = this.tableValue.toArray().indexOf(this.tableValue.toArray().find(element => element.nativeElement.value == element2.code));

    this.inputValorCompra.toArray()[index].nativeElement.disabled = true;

    setTimeout(() => {

      this.inputDescuento.toArray()[index].nativeElement.focus();
      this.inputDescuento.toArray()[index].nativeElement.select();

      this.inputValorCompra.toArray()[index].nativeElement.disabled = false;

    }, 150);

  }

  descuentoUp(element2){

    let index = this.tableValue.toArray().indexOf(this.tableValue.toArray().find(element => element.nativeElement.value == element2.code));

    this.inputDescuento.toArray()[this.inputDescuento.toArray().length-1].nativeElement.disabled = true;

    setTimeout(() => {

      this.elementRef.nativeElement.focus();
      this.elementRef.nativeElement.select();

      this.inputDescuento.toArray()[this.inputDescuento.toArray().length-1].nativeElement.disabled = false;

    }, 150);

  }

  calculateSubtotal() {
    let subtotal = 0;
    const attr = this.flagVenta ? 'standarBuyPrice' : 'purchaseValue';

    for (let code in this.productsObject) {
      subtotal += (this.productsObject[code][attr] - (this.productsObject[code][attr]*(this.productsObject[code]['disccount']/100))) * Math.floor(this.productsObject[code]['quantity']);
    }
    return subtotal;
  }

  calculateTax() {
    let tax = 0;
    // if (!this.form.value['isRemission']) {
    for (let code in this.productsObject) {
      if(this.flagVenta){
        tax += (this.productsObject[code]['standarBuyPrice']-(this.productsObject[code]['standarBuyPrice']*this.productsObject[code]['disccount']/100)) * this.productsObject[code]['quantity'] * this.productsObject[code]['tax'];
      }else{
        tax += (this.productsObject[code]['purchaseValue']-(this.productsObject[code]['pripurchaseValuece']*this.productsObject[code]['disccount']/100)) * this.productsObject[code]['quantity'] * this.productsObject[code]['tax'];
      }
    }
    // }
    return tax;
  }

  calculateTotalPrice(element){
    return ((element.standarBuyPrice-(element.standarBuyPrice*(element.disccount/100)))+(element.tax*(element.standarBuyPrice-(element.standarBuyPrice*(element.disccount/100))))) * Math.floor(element.quantity)
  }

  calculateTotalPrice2(element){
    return ((element.standarBuyPrice-(element.standarBuyPrice*(element.disccount/100)))* Math.floor(element.quantity));
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

      this.elementClientInput.nativeElement.focus();
      this.elementClientInput.nativeElement.select();

    }, 100);
    this.listaElem = [];
    this.inputForCode = "";
    this.providerStoreList = [];
    this.inventoryList = [];
    this.pedidosList=[];
    this.SelectedPedido="-1";
    this.obs="";
    this.inputForCode="";
    this.ccClient="";
    this.EstadoBusquedaProducto = -1;
    this.datos="";
    this.date3="";
    this.listaElem = [];
    this.cliente="";
    this.form.reset();
    this.clientData = new ClientData(true, 'Cliente Ocacional', '--', '000', 'N/A', '000', 'N/A',null);
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
    this.inventoriesService.getInventory(store).subscribe((data: InventoryName[]) => {
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
          this.inventoriesService.putQuantity(this.SelectedStore,(-1)*Math.floor(element.quantity),element.code,inventoryQuantityDTOList,isDisc,element.id_storage).subscribe(() =>{
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
          this.inventoriesService.putQuantity(this.SelectedStore,((-1)*Math.floor(element.quantity)),element.code,inventoryQuantityDTOList,isDisc,element.id_storage).subscribe(() =>{
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
