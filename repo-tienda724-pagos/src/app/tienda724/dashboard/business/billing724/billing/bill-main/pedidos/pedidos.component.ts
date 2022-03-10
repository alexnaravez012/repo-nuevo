import {Component, OnInit, ViewChild} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import {LocalStorage} from '../../../../../../../services/localStorage';
import {DatePipe} from '@angular/common';
import {BillingService} from '../../../../../../../services/billing.service';
import {MatDatepicker, MatDialog, MatSortable, MatTableDataSource, ThemePalette} from '@angular/material';
import {PedidosDetailComponent} from '../pedidos-detail/pedidos-detail.component';
import {PedidosDetail2Component} from '../pedidos-detail2/pedidos-detail2.component';
import {StatechangeComponent} from '../statechange/statechange.component';
import {NotesOnOrderComponent} from '../notes-on-order/notes-on-order.component';
import {Urlbase} from '../../../../../../../shared/urls';
import {HttpClient} from '@angular/common/http';
import {MatSort} from '@angular/material/sort';
import * as jQuery from 'jquery';
import 'bootstrap-notify';
import {Router} from '@angular/router';
import {DetallePlanillasComponent} from '../detalle-planillas/detalle-planillas.component';
import {CreatePlanillaComponent} from '../create-planilla/create-planilla.component';
import { OpenorcloseboxComponent } from 'src/app/components/openorclosebox/openorclosebox.component';
import { CloseBoxComponent } from '../close-box/close-box.component';
import { SelectboxComponent } from 'src/app/components/selectbox/selectbox.component';
import { OpenBoxComponent } from 'src/app/components/open-box/open-box.component';
import { StoreSelectorService } from 'src/app/components/store-selector.service';
import { Token } from 'src/app/shared/token';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { InventoryName } from '../bill-main.component';
import { InventoriesService } from 'src/app/services/inventories.service';
import { CommonStateDTO } from '../../../commons/commonStateDTO';
import { NewProductStoreComponent } from '../new-product-store/new-product-store.component';
import { NotesModal2Component } from '../notes-modal2/notes-modal2.component';
import { PedidosModificarComponent } from '../pedidos-modificar/pedidos-modificar.component';

let $: any = jQuery;

@Component({
  selector: 'app-pedidos',
  templateUrl: './pedidos.component.html',
  styleUrls: ['./pedidos.component.scss']
})
export class PedidosComponent implements OnInit {
  id_store;

  date1='';
  date2='';

  type2 = "1";
  SelectedStore2;
  isListProdFull2=false;
  ListReportProd2;
  dateP12;
  dateP22;
  hours2=24;

  Stores = [];
  SelectedStore = this.locStorage.getIdStore();//global selector
  SelectedBillType = '87';
  SelectedBillState = '61';
  isListProdFull = false;
  ListReportProd;

  SelectedVehicle = "";
  ListVehicles;
  isPlanillaFull = false;
  ListPlanilla=[];

  CampoSorteando = -1;
  Invertido = false;

  public mostrandoCargando = false;
  //expandedElement = null;
  public estadoCargando = "Procesando - Iniciando";

  ColorSelectorPedidosGlobal:ThemePalette;

  //variables tabla
  DiccionarioColumnas = {};
  AnchosColumnas = {};
  dataSource = new MatTableDataSourceWithCustomSort(this.ListReportProd);
  DictSelection = {};
  expandedElement: any | null;
  @ViewChild('picker2') SelectorFechaFinal_Facturacion: MatDatepicker<Date>;
  topProds: any[];
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  round(value, precision) {
    const multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }

  GetKeysSeleccionados(){
    return Object.keys(this.DictSelection);
  }

  CustomSelect(row){
    if(this.DictSelection[row.id_BILL] != null){
      delete this.DictSelection[row.id_BILL];
    }else{
      this.DictSelection[row.id_BILL] = row;
    }
  }


  constructor(public inventoriesService: InventoriesService, private authService:AuthenticationService,private billingService: BillingService,private service: StoreSelectorService, public router: Router,private datePipe: DatePipe, public dialog: MatDialog, public locStorage: LocalStorage,private categoriesService: BillingService,private http2: HttpClient) { }

  id_menu = 221;



  currentBox;
  idThird;
  myBox;
  Stores2;
  listElem = "";
  domiList;




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


  getTopProds(idstore){
    this.topProds = [];
    this.http2.get(Urlbase.facturacion+"/billing/top20?idstore="+idstore).subscribe(res=> {
      for(let i=0;i<20;i++){
        this.topProds.push(res[i]);
      }

      CPrint("THIS IS LIST, ",this.topProds)
    })
  }



  quickconfirm = false;



  ngOnInit() {


    if(!this.locStorage.getBoxStatus()){

      const idPerson = this.locStorage.getPerson().id_person;

      localStorage.setItem("id_employee",String(this.locStorage.getToken().id_third));
      let rolesCajeros = this.locStorage.getRol().filter(element => this.locStorage.getListRolesCajeros().includes(element.id_rol) )
      let itemMenu = this.locStorage.getMenu().sort(this.dynamicSort("id_menu")).filter(item => item.id_menu == 143 || (rolesCajeros.length>0) )
      if( itemMenu.length>0 ){
         this.http2.get(Urlbase.cierreCaja + "/close/openBoxes/v2?id_third=" + this.locStorage.getToken().id_third).subscribe(answering=>{
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
                CPrint(response);
                if(response){
                  this.locStorage.setBoxStatus(true);
                  this.locStorage.setIdCaja(Number(answering[0].id_CAJA));
                  this.locStorage.setCajaOld(Number(answering[0].id_CAJA));

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
                          this.http2.post(Urlbase.facturacion+"/pedidos/abrirCajaPlanilla?IDCIERRECAJA="+this.locStorage.getIdCaja(),{}).subscribe(e=> {
                            this.locStorage.setBoxStatus(true);
                            this.SelectedStore=this.locStorage.getIdStore();
                            this.getTopProds(this.locStorage.getIdStore());
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
                      this.http2.post(Urlbase.facturacion+"/pedidos/abrirCajaPlanilla?IDCIERRECAJA="+this.locStorage.getIdCaja(),{}).subscribe(e=> {
                        this.service.onMainEvent.emit(this.locStorage.getIdStore());
                        this.locStorage.setBoxStatus(true);
                        CPrint("ID CAJA: ",this.locStorage.getIdCaja());
                        CPrint("ID STORE: ",this.locStorage.getIdStore());
                        CPrint("STORE TYPE: ",this.locStorage.getTipo());
                        CPrint("BOX TYPE: ",this.locStorage.getBoxStatus());
                        CPrint("OR AM I?");

                        this.SelectedStore=this.locStorage.getIdStore();
                        this.getTopProds(this.locStorage.getIdStore());
                        this.getStores2();
                        this.DelayedgetInventoryList();
                      });
                    });
                  }else{
                    this.locStorage.setIdCaja(response2.idcaja);
                    this.locStorage.setCajaOld(response2.idcaja);
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


    this.getPlanillas();
    //PROTECCION URL INICIA
    CPrint(JSON.stringify(this.locStorage.getMenu()));
    const elem = this.locStorage.getMenu().find(item => item.id_menu == this.id_menu);

    // if(!elem){
    //   // noinspection JSIgnoredPromiseFromCall
    //   this.router.navigateByUrl("/dashboard/business/movement/nopermision");
    // }
    //PROTECCION URL TERMINA
    this.getVehicles();
    this.getStores();
    this.id_store = this.locStorage.getIdStore();
    CPrint("THIS IS MY ID STORE: ",this.id_store)
  }
  inventoryList: InventoryName[];
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
  SelectedPlanillaState="C,O";
  SelectedVehiclePlanilla="-1";
  planillaDate1;
  planillaDate2;
  public token:Token;

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

  goIndex() {
    let link = ['/'];
    // noinspection JSIgnoredPromiseFromCall
    this.router.navigate(link);
  }

  public productsObject = [];
  dataSourceBuscadoProductos = new MatTableDataSource<InventoryName>();
  PrimeraCarga = true;
  dataSourceProductosSeleccionados = new MatTableDataSourceWithCustomSort(this.productsObject);
  @ViewChild(MatSort, {static: true}) sort: MatSort;


  addDetail3(code,quantity) {
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
        if(localStorage.getItem("SesionExpirada") != "true"){ alert('Ese codigo no esta asociado a un producto.');}
      }
    }
  }

  taxesList: any;

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

  commonStateDTO: CommonStateDTO;

  storageList;
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



  findCode(code,item){

    if(item.ownbarcode == code){
      return item;
    }else{
      if(String(item.product_STORE_CODE) == code){
        return item;
      }
    }

  }



  async getInventoryList(store){
    this.http2.get(Urlbase.facturacion + "/billing/domiciliarios?id_store="+this.locStorage.getIdStore()).subscribe(data => {
      this.domiList = data;
      CPrint("DOMI DOMI, "+data)
    });
    await this.inventoriesService.getInventory(store).subscribe((data: InventoryName[]) => {
          //CPrint("This is InventoryList: ",data);
          this.PrimeraCarga = false;
          this.inventoryList = data;
          this.dataSourceBuscadoProductos = new MatTableDataSource<InventoryName>(this.inventoryList);
          //  this.getPriceList();
          if(this.locStorage.getDoIMakeRefund()){
            CPrint("ENTRE A LA LISTA REFUND");
            this.http2.get(Urlbase.facturacion+"/billing/detail?id_bill="+this.locStorage.getIdRefund()).subscribe(response => {
              this.locStorage.setDoIMakeRefund(false);
              this.locStorage.setIdRefund(0);
              //@ts-ignore
              response.forEach(element => {
                this.addDetail3(Number(element[3]),Number(element[0]))
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
        (error) =>{
          CPrint(error);
        },
        () => {
          if (this.inventoryList.length > 0) {

          }
        });

  }



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


  getStores2() {
    this.billingService.getStoresByThird(this.locStorage.getToken().id_third).subscribe(data => {
      CPrint("DATO: ", this.Stores);
      this.Stores = data;
      this.SelectedStore = this.locStorage.getIdStore();
      this.service.onMainEvent.emit(this.locStorage.getIdStore());
    }      )
  }

  verDetalles(idPlanilla){

    let dialogRef = this.dialog.open(DetallePlanillasComponent,{
      height: '90vh',
      width: '90vw',
      maxWidth: '90vw',
      data: {
        idPlanilla: idPlanilla
      }
    })


  }


  openEditOrder(elem){

    console.log(elem);

    const dialogRef = this.dialog.open(PedidosModificarComponent, {
      width: '120vw',
      height: '80vh',
      data: { element: elem, myStateId: this.SelectedBillState },
      disableClose: true
    });

    dialogRef.afterClosed().subscribe(result => {
      CPrint(result)
      if(result.response){
        this.getRepProdList();
      }else{
        CPrint("I FAILED")
      }
    });

  }


  cancelarPedido(element){

    this.http2.post(Urlbase.facturacion+ "/pedidos/cancelarPedidoTrad?IDBILL="+element.id_BILL,{}).subscribe(result => {
      if(result==1){
        this.showNotification('top', 'center', 3, "<h3>Se cancelo su pedido con exito.</h3>", 'info',20000);
        this.getRepProdList();
      }else{
        this.showNotification('top', 'center', 3, "<h3>Algo fallo al cancelar el pedido.</h3>", 'danger',20000);

      }
    })

  }

  getPlanillaList(){
    this.ListPlanilla = [];
    CPrint(Urlbase.tienda+"/pedidos/planillas?idvehiculo="+this.allVehicles.toString()+"&status="+this.SelectedPlanillaState+"&idstore="+this.SelectedStore+"&date1="+this.planillaDate1+"&date2="+this.planillaDate2);
    if(this.SelectedVehiclePlanilla=="-1"){
      this.http2.get(Urlbase.tienda+"/pedidos/planillas?idvehiculo="+this.allVehicles.toString()+"&status="+this.SelectedPlanillaState+"&idstore="+this.SelectedStore+"&date1="+this.planillaDate1+"&date2="+this.planillaDate2).subscribe(response => {
        console.log(response)
        //@ts-ignore
        response.forEach(element => {
          this.isPlanillaFull= true;
          this.ListPlanilla.push(element);
        });

    });
    }else{
      this.http2.get(Urlbase.tienda+"/pedidos/planillas?idvehiculo="+this.SelectedVehiclePlanilla.toString()+"&status="+this.SelectedPlanillaState+"&idstore="+this.SelectedStore+"&date1="+this.planillaDate1+"&date2="+this.planillaDate2).subscribe(response => {
        console.log(response)
        //@ts-ignore
        response.forEach(element => {
          this.isPlanillaFull= true;
          this.ListPlanilla.push(element);
        });

    });

    }


  }

  // getPlanillaList(){
  //   this.ListPlanilla = [];
  //   this.ListVehicles.forEach(element => {

  //     this.http2.get(Urlbase.tienda+"/pedidos/planillas?idvehiculo="+element.id_VEHICULO+"&idstore="+this.locStorage.getIdStore()).subscribe(response => {

  //       //@ts-ignore
  //       response.forEach(element => {
  //         this.isPlanillaFull= true;
  //         this.ListPlanilla.push(element);
  //       });
  //     })
  //   });
  // }

  allVehicles = [];
  planillasSelector;
  selectedPlanilla;

  getPlanillas(){
    this.http2.get(Urlbase.tienda + "/pedidos/vehiculos/ids").subscribe(responses => {

            this.http2.get(Urlbase.tienda+"/pedidos/planillas?idvehiculo="+responses+"&status=O&idstore="+this.SelectedStore+"&date1=01/01/2020&date2="+new Date()).subscribe(response => {
                this.planillasSelector = response;





              this.planillasSelector = this.planillasSelector.sort((a, b) => {
                  if (a.id_PLANILLA < b.id_PLANILLA)
                    return 1;
                  if (a.id_PLANILLA > b.id_PLANILLA)
                    return -1;
                  return 0;
                });

                this.selectedPlanilla = this.planillasSelector[0].id_PLANILLA;
                console.log("PLANILLAS: ", this.planillasSelector )
              });


    })
}

  getVehicles(){
    this.http2.get(Urlbase.tienda+"/pedidos/vehiculos").subscribe(response => {
      this.ListVehicles = response;
      this.SelectedVehicle = response[0].id_VEHICULO;
      //@ts-ignore
      response.forEach(element => {
        this.allVehicles.push(element.id_VEHICULO)

      });
    })
  }

  openPostPlanilla(){
    let dialogRef = this.dialog.open(CreatePlanillaComponent,{
      height: '40vh',
      width: '40vw',
      maxWidth: '40vw'
    }).afterClosed().subscribe(res=>{
      this.getPlanillas();
      this.getRepProdList();
    })

  }

  pdf(element){

  console.log(element)
  this.http2.get(Urlbase.facturacion+"/billing/UniversalPDF?id_bill="+element.id_BILL+"&pdf=-1&cash=0&size="+false,{responseType: 'text'}).subscribe(response =>{
    //-----------------------------------------------------------------------------------------------------------------
    window.open(Urlbase.remisiones+"/"+response, "_blank");

  });
  }

  exportarPdf(elem){

    this.http2.get(Urlbase.tienda+"/pedidos/planillaDetail?idplanilla="+elem.id_PLANILLA).subscribe(response => {
      CPrint("BODY: ",{
        logo: this.locStorage.getThird().info.type_document+" "+this.locStorage.getThird().info.document_number,
        master: elem,
        detalles: response
      });
      this.http2.post(Urlbase.tienda+"/pedidos/pdf",{
        logo: this.locStorage.getThird().info.type_document+" "+this.locStorage.getThird().info.document_number,
        master: elem,
        detalles: response
      },{responseType: 'text'}).subscribe(answer => {
        CPrint("THIS IS RESPONSE: ",answer);
        CPrint("EL BODY ES: ",JSON.stringify({
          logo: this.locStorage.getThird().info.type_document+" "+this.locStorage.getThird().info.document_number,
          master: elem,
          detalles: response
        }));
        window.open(Urlbase.root+"planillas/"+answer, "_blank");
      })
    })
  }

  openClosePanilla(idplanilla){
    let dialogRef;
    dialogRef = this.dialog.open(NotesModal2Component,{
      height: '300px',
      width: '850px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {

      if(result.resp){
        this.http2.post(Urlbase.facturacion+"/pedidos/CerrarPlanillaPedidos?NOTAS="+result.notes+"&IDPLANILLA="+idplanilla+"&valorbilletes="+result.billetes+"&valormonedas="+result.monedas+"&valorotros="+result.total,{}).subscribe(answer => {
          CPrint("THIS IS ANSWER: ",answer);
          this.getPlanillaList()
        })
      }
    });

  }

  confirmarEnv(elem) {
    CPrint("this is element dude, ", elem);
    const dialogRef = this.dialog.open(NotesOnOrderComponent, {
      height: '38vh',
      width: '80vw',
      data: {
        elem: elem
      },
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(response => {

      //  this.http2.put(Urlbase.facturacion + "/pedidos/billstate?billstate=81&billid="+elem.id_BILL,null).subscribe(a=> {
      this.getRepProdList();
    });
    //  })
  }

  getStores() {
    this.categoriesService.getStoresByThird(this.locStorage.getToken().id_third).subscribe(data => {
      CPrint(data);this.Stores = data;
      this.SelectedStore =  this.locStorage.getIdStore();})
  }

  //VARIABLES PARA LA TABLA
  GetKeys(){
    return Object.keys(this.DiccionarioColumnas);
  }
  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected() {
    return Object.keys(this.DictSelection).length === this.dataSource.data.length;
  }

  checkboxLabel(row?: any): string {
    if (!row) {
      return `${this.isAllSelected() ? 'select' : 'deselect'} all`;
    }
    return `${this.DictSelection[row.id_BILL] ? 'deselect' : 'select'} row ${row.position + 1}`;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle() {
    this.isAllSelected() ?
      this.DictSelection = {} :
      this.dataSource.data.forEach(row => {
        this.DictSelection[row["id_BILL"]] = row;
      });
  }

  ///////////////

  getRepProdList(){
    //DEFINO LAS COLUMNAS SEGUN LA SELECCIÓN
    this.DiccionarioColumnas = {};
    this.AnchosColumnas = {};
    if((this.SelectedBillType == '86' && this.SelectedBillState == '82') || (this.SelectedBillType == '86' && this.SelectedBillState == '62')){this.DiccionarioColumnas["select"] = "";}
    this.DiccionarioColumnas["fecha"] = "Fecha";this.AnchosColumnas["fecha"] = "6vw";
    this.DiccionarioColumnas["numdocumento"] = "Documento";this.AnchosColumnas["numdocumento"] = "5vw";
    if(this.SelectedBillType == '86'){this.DiccionarioColumnas["numpedido"] = "Pedido Cliente";this.AnchosColumnas["numpedido"] = "4vw";}
    this.DiccionarioColumnas["cliente"] = "Cliente";this.AnchosColumnas["cliente"] = "7vw";
    this.DiccionarioColumnas["tiendacliente"] = "Tienda";this.AnchosColumnas["tiendacliente"] = "7vw";
    this.DiccionarioColumnas["dirtiendacliente"] = "Dirección";this.AnchosColumnas["dirtiendacliente"] = "6vw";
    this.DiccionarioColumnas["ciudadtiendacliente"] = "Ciudad";this.AnchosColumnas["ciudadtiendacliente"] = "6vw";
    this.DiccionarioColumnas["mail"] = "E-Mail";this.AnchosColumnas["mail"] = "7vw";
    this.DiccionarioColumnas["phone"] = "Teléfono";this.AnchosColumnas["phone"] = "4vw";
    this.DiccionarioColumnas["body"] = "Observaciones";this.AnchosColumnas["body"] = "5vw";
    /////////////////////////////////////////////
    this.mostrandoCargando = true;
    this.estadoCargando = "Consultando Pedidos";
       if((this.date1==''||this.date1==null) && (this.date2==''||this.date2==null)){
      let tmpDate = new Date();
      tmpDate.setDate(tmpDate.getDate()-15);
      CPrint(Urlbase.facturacion+"/pedidos/master?id_store="+this.SelectedStore+"&id_bill_state="+this.SelectedBillState+"&id_bill_type="+this.SelectedBillType+"&date1="+tmpDate+"&date2="+ new Date());
      this.http2.get(Urlbase.facturacion+"/pedidos/master?id_store="+this.SelectedStore+"&id_bill_state="+this.SelectedBillState+"&id_bill_type="+this.SelectedBillType+"&date1="+tmpDate+"&date2="+new Date()).subscribe(
        data => {
            CPrint("THIS IS DATA: ",data);
            this.ListReportProd = data;
            this.isListProdFull = true;
            this.mostrandoCargando = false;
            this.estadoCargando = "";
            this.DictSelection = {};
            this.dataSource = new MatTableDataSourceWithCustomSort(this.ListReportProd);
            this.sort.sort(({ id: 'numdocumento', start: 'asc'}) as MatSortable);
            this.dataSource.sort = this.sort;
          }
      )

    }else{
      if(this.date1==''||this.date1==null){
        let tmpDate = new Date(this.date2);
        tmpDate.setDate(tmpDate.getDate()-1);
        CPrint(Urlbase.facturacion+"/pedidos/master?id_store="+this.SelectedStore+"&id_bill_state="+this.SelectedBillState+"&id_bill_type="+this.SelectedBillType+"&date1="+tmpDate+"&date2="+ this.date2);
        this.http2.get(Urlbase.facturacion+"/pedidos/master?id_store="+this.SelectedStore+"&id_bill_state="+this.SelectedBillState+"&id_bill_type="+this.SelectedBillType+"&date1="+tmpDate+"&date2="+this.date2).subscribe(
          data => {
              CPrint("THIS IS DATA: ",data);
              this.ListReportProd = data;
              this.isListProdFull = true;
              this.mostrandoCargando = false;
              this.estadoCargando = "";
              this.DictSelection = {};
              this.dataSource = new MatTableDataSourceWithCustomSort(this.ListReportProd);
              this.sort.sort(({ id: 'numdocumento', start: 'asc'}) as MatSortable);
              this.dataSource.sort = this.sort;
            }
        )

      }else{
        if(this.date2==''||this.date2==null){
          let tmpDate = new Date(this.date1);
          tmpDate.setDate(tmpDate.getDate()-1);
          CPrint(Urlbase.facturacion+"/pedidos/master?id_store="+this.SelectedStore+"&id_bill_state="+this.SelectedBillState+"&id_bill_type="+this.SelectedBillType+"&date1="+tmpDate+"&date2="+ this.date1);
          this.http2.get(Urlbase.facturacion+"/pedidos/master?id_store="+this.SelectedStore+"&id_bill_state="+this.SelectedBillState+"&id_bill_type="+this.SelectedBillType+"&date1="+tmpDate+"&date2="+this.date1).subscribe(
            data => {
                CPrint("THIS IS DATA: ",data);
                this.ListReportProd = data;
                this.isListProdFull = true;
                this.mostrandoCargando = false;
                this.estadoCargando = "";
                this.DictSelection = {};
                this.dataSource = new MatTableDataSourceWithCustomSort(this.ListReportProd);
                this.sort.sort(({ id: 'numdocumento', start: 'asc'}) as MatSortable);
                this.dataSource.sort = this.sort;
              }
          )

        }else{
      CPrint(Urlbase.facturacion+"/pedidos/master?id_store="+this.SelectedStore+"&id_bill_state="+this.SelectedBillState+"&id_bill_type="+this.SelectedBillType+"&date1="+this.date1+"&date2="+this.date2);
      this.http2.get(Urlbase.facturacion+"/pedidos/master?id_store="+this.SelectedStore+"&id_bill_state="+this.SelectedBillState+"&id_bill_type="+this.SelectedBillType+"&date1="+this.date1+"&date2="+this.date2).subscribe(
        data => {
            CPrint("THIS IS DATA: ",data);
            this.ListReportProd = data;
            this.isListProdFull = true;
            this.mostrandoCargando = false;
            this.estadoCargando = "";
            this.DictSelection = {};
            this.dataSource = new MatTableDataSourceWithCustomSort(this.ListReportProd);
            this.sort.sort(({ id: 'numdocumento', start: 'asc'}) as MatSortable);
            this.dataSource.sort = this.sort;
          }
        )
      }
      }
    }
  }
  ListChecked = [];

  async NewSendItems(){
    let Selection = Object.keys(this.DictSelection);
    this.mostrandoCargando = true;
    this.estadoCargando = "Enviando pedidos...";
    let FacturasCorrectas = [];
    let FacturasErroneas = [];
    for(let n = 0;n<Selection.length;n++){
      let item = Selection[n];
      let elemToPost = this.ListReportProd.find(elem => elem.id_BILL == item);
      //
      let respuesta = await new Promise(resolve => {
        this.http2.post(Urlbase.facturacion + "/pedidos/sendPedidosV2?idbpedido="+elemToPost.id_BILL+"&idstoreprov="+elemToPost.id_STORE+"&idstoreclient="+elemToPost.id_STORE_CLIENT+"&idplanilla="+this.selectedPlanilla,{}).subscribe(idBillVent => {
          if(idBillVent!=0){
            this.http2.get(Urlbase.facturacion+"/billing/UniversalPDF?id_bill="+idBillVent+"&pdf=-1&cash=0&size="+false,{responseType: 'text'}).subscribe(response =>{
              //-----------------------------------------------------------------------------------------------------------------
              this.http2.put(Urlbase.facturacion +"/billing/domiciliario?id_bill=" + idBillVent + "&id_third=-1", {}).subscribe(responseItem => {
                CPrint("THIS IS ITEM, " + responseItem);
                resolve([1,Urlbase.facturas+"/"+response]);
              },error => resolve([-1]));
              //-----------------------------------------------------------------------------------------------------------------
            });
          }else{
            this.http2.put(Urlbase.facturacion +"/billing/domiciliario?id_bill=" + idBillVent + "&id_third=-1", {}).subscribe(responseItem => {
              CPrint("THIS IS ITEM, " + responseItem);
              resolve([2,elemToPost.numdocumento]);
            },error => resolve([-1]));
          }
        });
      });
      if(respuesta[0] == 1){FacturasCorrectas.push(respuesta[1]);}
      else if(respuesta[0] == 2){FacturasErroneas.push(respuesta[1]);}
    }
    this.mostrandoCargando = false;
    for(let n = 0;n<FacturasCorrectas.length;n++){
      await new Promise(resolve => setTimeout(resolve, 250));
      CPrint(FacturasCorrectas[n]);
      window.open(FacturasCorrectas[n], "_blank");
    }
    if(FacturasErroneas.length > 0){
      this.showNotification('top', 'center', 3, "<h3>Las facturas con documento '"+FacturasErroneas.join(",")+"' tenian detalles vacios por falta de inventario.</h3>", 'danger',20000);
    }
    this.getRepProdList()
  }

  // async sendItems(){
  //
  //   let Selection = Object.keys(this.DictSelection);
  //   CPrint("Selection es");
  //   CPrint(Selection);
  //   CPrint("Datasource es");
  //   CPrint(this.ListReportProd);
  //   Selection.forEach(async (item, index)=> {
  //     let elemToPost = this.ListReportProd.find(elem => elem.id_BILL == item);
  //
  //     let PromesaFiltrado = -1;
  //
  //     let dialogRef = this.dialog.open(StatechangeComponent,{
  //       height: '90vh',
  //       width: '90vw',
  //       maxWidth: '90vw',
  //       data: {
  //         elem: elemToPost,
  //         autoPilot: true,
  //         idVehicle: this.selectedPlanilla,
  //         timer: index
  //       }
  //     }).afterClosed().subscribe(res=>{
  //       PromesaFiltrado = 1;
  //       this.getRepProdList()
  //     });
  //     while(1==1){
  //       await new Promise(resolve => setTimeout(resolve, 250));
  //       if(PromesaFiltrado == 1){break;}
  //       else{PromesaFiltrado = 1; }
  //     }
  //   })
  //
  // }

  cleanList(){
    this.isListProdFull = false;
    this.ListReportProd = [];
    this.DictSelection = {};
    this.dataSource = new MatTableDataSourceWithCustomSort(this.ListReportProd);
    this.sort.sort(({ id: 'numdocumento', start: 'asc'}) as MatSortable);
    this.dataSource.sort = this.sort;
  }

  cleanList2(){
    this.cleanList();
    if(this.SelectedBillType=='1' || this.SelectedBillType=='2' || this.SelectedBillType=='3' || this.SelectedBillType=='4' )
    { this.SelectedBillState = '1' }
    if(this.SelectedBillType=='86')
    { this.SelectedBillState = '62' }
    if(this.SelectedBillType=='87')
    { this.SelectedBillState = '61' }
    if(this.SelectedBillType=='88')
    { this.SelectedBillState = '1' }
    if(this.SelectedBillType=='89')
    { this.SelectedBillState = '65' }
    if(this.SelectedBillType=='90')
    { this.SelectedBillState = '67' }
  }

  goToSubMenu(element){
    let dialogRef = this.dialog.open(PedidosDetailComponent,{
      height: '90vh',
      width: '90vw',
      maxWidth:'90vw',
      data: {
        elem: element
      }
    })
  }

  getPicking(){
    let Selection = Object.keys(this.DictSelection);
    CPrint("Selection es");
    CPrint(Selection);
    let dialogRef;
    dialogRef = this.dialog.open(PedidosDetail2Component,{
      height: '90vh',
      width: '90vw',
      maxWidth:'90vw',
      data: {
        elem: Selection
      }
    })
    // for(let i = 0; i < Selection.length; i++){
    //   if(Selection[i]){
    //     billList.push(this.ListReportProd[i].id_BILL);
    //   }
    //   if(i+1==Selection.length){
    //     CPrint(billList);
    //     let dialogRef;
    //     dialogRef = this.dialog.open(PedidosDetail2Component,{
    //       height: '90vh',
    //       width: '90vw',
    //       maxWidth:'90vw',
    //       data: {
    //         elem: billList
    //       }
    //     })
    //   }
    // }
  }

  pedidoInterno(){
    CPrint("is null");
    return false;
  }

  changeState(data){
    let dialogRef = this.dialog.open(StatechangeComponent,{
      height: '90vh',
      width: '90vw',
      maxWidth: '90vw',
      data: {
        elem: data
      }
    }).afterClosed().subscribe(res=>{
      this.getRepProdList()
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

  getRepProdList2(){
    CPrint(Urlbase.facturacion + "/reorder2?id_third="+this.locStorage.getThird().id_third+"&id_store="+this.id_store);
    this.http2.get(Urlbase.facturacion + "/reorder/reorder2?id_third="+this.locStorage.getThird().id_third+"&id_store="+this.id_store+"&hours="+this.hours2).subscribe(
        data => {
          CPrint("THIS IS DATA: ",data);
          if(this.type2=="1"){
            //@ts-ignore
            this.ListReportProd2 = data.sort(this.dynamicSort("linea"));
          }
          if(this.type2=="2"){
            //@ts-ignore
            this.ListReportProd2 = data.sort(this.dynamicSort("categoria"));
          }
          if(this.type2=="3"){
            //@ts-ignore
            this.ListReportProd2 = data.sort(this.dynamicSort("marca"));
          }
          this.isListProdFull2 = true;
        }
    )
  }

  transformDate(date){
    return this.datePipe.transform(date, 'yyyy/MM/dd');
  }

  genPedido(){
    this.showNotification('top', 'center', 3, "<h3>El pedido se esta generando, por favor espera a la notificacion de <b>EXITO</b></h3> ", 'info');
    try{
      CPrint("THIS IS JSON, ", JSON.stringify({reorder: this.ListReportProd2,idstore: this.id_store}));
      this.http2.post(Urlbase.facturacion + "/pedidos/detailing",{reorder: this.ListReportProd2,idstore: this.id_store},{responseType: 'text'}).subscribe(
          response => {
            this.showNotification('top', 'center', 3, "<h3>El pedido se realizo con <b>EXITO</b></h3> ", 'success')
          })

    }catch(e){
      this.showNotification('top', 'center', 3, "<h3>El pedido presento <b>PROBLEMAS</b></h3> ", 'danger')
    }
  }

  showNotification(from, align, id_type?, msn?, typeStr?,time = 200) {
    const type = ['', 'info', 'success', 'warning', 'danger'];

    const color = Math.floor((Math.random() * 4) + 1);

    $.notify({
      icon: "notifications",
      message: msn ? msn : "<b>Noficación automatica </b>"

    }, {
      type: typeStr ? typeStr : type[id_type ? id_type : 2],
      timer: time,
      placement: {
        from: from,
        align: align
      }
    });
  }

  static SortFunction(a, b, direction) {
    const valueA = a + "";
    const valueB = b + "";

    let Terminado = false;
    let i = 0;
    // CPrint("valueA es "+valueA);
    // CPrint("valueB es "+valueB);
    let Arreglo1 = valueA.trim().toLowerCase().split(' ').join(',').split('.').join(',').split('-').join(',').split(':').join(',').split(',');
    let Arreglo2 = valueB.trim().toLowerCase().split(' ').join(',').split('.').join(',').split('-').join(',').split(':').join(',').split(',');
    // for(let n = 0;n<Arreglo1.length;n++){
    //   CPrint("Arreglo1["+n+"] es "+Arreglo1[n]);
    // }
    // for(let n = 0;n<Arreglo2.length;n++){
    //   CPrint("Arreglo2["+n+"] es "+Arreglo1[n]);
    // }
    let retorno = 0;
    while(!Terminado){
      if(Arreglo1.length <= i && Arreglo2.length > i){
        Terminado = true;
        retorno = -1;
        break;
      }else if(Arreglo2.length <= i && Arreglo1.length > i){
        Terminado = true;
        retorno = 1;
        break;
      }else if(Arreglo1.length <= i && Arreglo2.length <= i){
        Terminado = true;
        retorno = 0;
        break;
      }
      let Parte1 = Arreglo1[i];
      let Parte2 = Arreglo2[i];
      // CPrint("Parte1 es "+Parte1);
      // CPrint("Parte2 es "+Parte2);
      let A : any = parseInt(Parte1);
      let B : any = parseInt(Parte2);
      if(isNaN(A)){/*CPrint("se ejecuta isNaN(A)");*/ A = Parte1;}
      if(isNaN(B)){/*CPrint("se ejecuta isNaN(B)");*/ B = Parte2;}
      i++;
      if (A < B){
        retorno = -1;
        Terminado = true;
        break;
      }else if (A > B){
        retorno = 1;
        Terminado = true;
        break;
      }
    }
    return retorno * (direction == 'asc' ? 1 : -1);
  }
}

export class MatTableDataSourceWithCustomSort<T> extends MatTableDataSource<T> {

  sortData: ((data: T[], sort: MatSort) => T[]) = (data: T[], sort: MatSort): T[] => {
    const active = sort.active;
    const direction = sort.direction;
    if (!active || direction == '') { return data; }
    return data.sort((a, b) => {
      const valueA = this.sortingDataAccessor(a, active) + "";
      const valueB = this.sortingDataAccessor(b, active) + "";

      let Terminado = false;
      let i = 0;
       // CPrint("valueA es "+valueA);
       // CPrint("valueB es "+valueB);
      let Arreglo1 = valueA.trim().toLowerCase().split(' ').join(',').split('.').join(',').split('-').join(',').split(':').join(',').split(',');
      let Arreglo2 = valueB.trim().toLowerCase().split(' ').join(',').split('.').join(',').split('-').join(',').split(':').join(',').split(',');
      // for(let n = 0;n<Arreglo1.length;n++){
      //   CPrint("Arreglo1["+n+"] es "+Arreglo1[n]);
      // }
      // for(let n = 0;n<Arreglo2.length;n++){
      //   CPrint("Arreglo2["+n+"] es "+Arreglo1[n]);
      // }
      let retorno = 0;
      while(!Terminado){
        if(Arreglo1.length <= i && Arreglo2.length > i){
          Terminado = true;
          retorno = -1;
          break;
        }else if(Arreglo2.length <= i && Arreglo1.length > i){
          Terminado = true;
          retorno = 1;
          break;
        }else if(Arreglo1.length <= i && Arreglo2.length <= i){
          Terminado = true;
          retorno = 0;
          break;
        }
        let Parte1 = Arreglo1[i];
        let Parte2 = Arreglo2[i];
        // CPrint("Parte1 es "+Parte1);
        // CPrint("Parte2 es "+Parte2);
        let A : any = parseInt(Parte1);
        let B : any = parseInt(Parte2);
        if(isNaN(A)){/*CPrint("se ejecuta isNaN(A)");*/ A = Parte1;}
        if(isNaN(B)){/*CPrint("se ejecuta isNaN(B)");*/ B = Parte2;}
        i++;
        if (A < B){
          retorno = -1;
          Terminado = true;
          break;
        }else if (A > B){
          retorno = 1;
          Terminado = true;
          break;
        }
      }
      return retorno * (direction == 'asc' ? 1 : -1);
    });
  }
}

export class ClientData {
  is_natural_person: boolean;
  fullname: string;
  document_type: string;
  document_number: string;
  address: string;
  phone: string;
  email: string;
  id_third: number;

  constructor(
      is_natural_person, fullname, document_type, document_number, address, phone, email, id_third
  ) {
      this.is_natural_person = is_natural_person;
      this.fullname = fullname;
      this.document_type = document_type;
      this.document_number = document_number;
      this.address = address;
      this.phone = phone;
      this.email = email;
      this.id_third = id_third;
  }
}


export interface DialogData {
  elem: any
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
  clientData: any;
  constructor(
      clientData: any,
      nit: String,
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
      this.clientData = clientData;
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
