import {Component, OnInit, ViewChild, Input} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import {LocalStorage} from '../../../../../../../services/localStorage';
import {DatePipe} from '@angular/common';
import {BillingService} from '../../../../../../../services/billing.service';
import {MatDatepicker, MatDialog, MatSortable, MatTableDataSource, ThemePalette} from '@angular/material';
import {PedidosDetailComponent} from '../pedidos-detail/pedidos-detail.component';
import {PedidosDetail2Component} from '../pedidos-detail2/pedidos-detail2.component';
import {StatechangeComponent} from '../statechange/statechange.component';
import {NotesModalComponent} from '../notes-modal/notes-modal.component';
import {NotesOnOrderComponent} from '../notes-on-order/notes-on-order.component';
import {Urlbase} from '../../../../../../../shared/urls';
import {HttpClient} from '@angular/common/http';
import {MatSort} from '@angular/material/sort';
import * as jQuery from 'jquery';
import 'bootstrap-notify';
import {Router} from '@angular/router';
import {DetallePlanillasComponent} from '../detalle-planillas/detalle-planillas.component';
import {CreatePlanillaComponent} from '../create-planilla/create-planilla.component';
import { DomiciliosComponent } from '../domicilios/domicilios.component';
import { PedidosDomiciliosCerrarPlanillasComponent } from '../pedidos-domicilios-cerrar-planillas/pedidos-domicilios-cerrar-planillas.component';
import { LogPedidosComponent } from '../log-pedidos/log-pedidos.component';
import { ObservationsNotesComponent } from '../observations-notes/observations-notes.component';

let $: any = jQuery;

@Component({
  selector: 'app-pedidos-domicilios-finalizados-n',
  templateUrl: './pedidos-domicilios-finalizados-n.component.html',
  styleUrls: ['./pedidos-domicilios-finalizados-n.component.css']
})
export class PedidosDomiciliosFinalizadosNComponent implements OnInit {
  id_store;

  date1='';
  date2='';

  burnedDate = new Date();
  burnedDate2 = new Date();

  type2 = "1";
  SelectedStore2;
  isListProdFull2=false;
  ListReportProd2;
  dateP12;
  dateP22;
  hours2=24;

  Stores = [];
  SelectedStore = this.locStorage.getIdStore();//global selector
  SelectedBillType = '86';
  SelectedBillState = '809';
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
  @ViewChild(MatSort, {static: true}) sort: MatSort;
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


  constructor(public router: Router,private datePipe: DatePipe, public dialog: MatDialog, public locStorage: LocalStorage,private categoriesService: BillingService,private http2: HttpClient) { }

  id_menu = 221;

  ngOnInit() {
    this.updateData();
  }
  @Input()
  mainclassref_input: DomiciliosComponent;
  mainclassref: DomiciliosComponent;
  updateData(){
    this.mainclassref = this.mainclassref_input;
    this.http2.get(Urlbase.facturacion+ "/pedidos/getDatosDomiciliario?id_store="+this.locStorage.getIdStore()+"&status=N").subscribe(item => {
      CPrint("domi: ")
      CPrint(item);
      this.listDomici = item;
      this.selectedDomi = item[0].id_PLANILLA;
      this.http2.get(Urlbase.facturacion+ "/pedidos/getIdBillPlanilla?id_store="+this.locStorage.getIdStore()+"&id_planilla="+item[0].id_PLANILLA).subscribe(result => {
        this.filterList=result;
        this.dataSource.filter = this.filterList.join(",");
      })
      this.http2.get(Urlbase.facturacion+"/pedidos/getPlanillasData/cierreCaja?id_cierre_caja="+item[0].id_CIERRE_CAJA+"&status=C").subscribe(resp => {
        CPrint("resp is this")
        CPrint(resp)
        //@ts-ignore
        let answer = resp.filter( object=> item[0].id_PLANILLA === object.id_PLANILLA )
      })
    })
    this.getRepProdListBurnedDate();

    this.getVehicles();
    this.getStores();
    this.id_store = this.locStorage.getIdStore();
    CPrint("THIS IS MY ID STORE: ",this.id_store)
  }

  SelectedPlanillaState="C,O";
  SelectedVehiclePlanilla="-1";
  planillaDate1;
  planillaDate2;

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

  filterList;

  updateButtonStatus(){
    this.http2.get(Urlbase.facturacion+ "/pedidos/getIdBillPlanilla?id_store="+this.locStorage.getIdStore()+"&id_planilla="+this.selectedDomi).subscribe(result => {
      this.filterList=result;
      console.log(this.filterList);
      this.dataSource.filter = this.filterList.join(",");
    })


  }

  listDomici;
  selectedDomi;
  cerrarPlanilla(){

    const dialogRef = this.dialog.open(PedidosDomiciliosCerrarPlanillasComponent, {
      width: '120vw',
      height: '80vh',
      data: {idPlanilla: this.selectedDomi,
            blockedObs: true,
            myStateId: this.SelectedBillState}
    });

    dialogRef.afterClosed().subscribe(result => {

      if(result.type==1){
        this.mainclassref.compUpdate5.updateData();
        this.mainclassref.compUpdate6.updateData();
        this.mainclassref.compUpdate7.updateData();
        this.mainclassref.compUpdate8.updateDataRecibidos()
        this.mainclassref.compUpdate9.updateData();
        this.mainclassref.compUpdate10.updateData();
        this.mainclassref.setTabIndexGlobal(6);
        this.mainclassref.setTabIndexFinalizados(1);
        this.ngOnInit();
      }

      if(result.type==2){
        this.mainclassref.compUpdate5.updateData();
        this.mainclassref.compUpdate6.updateData();
        this.mainclassref.compUpdate7.updateData();
        this.mainclassref.compUpdate8.updateDataRecibidos()
        this.mainclassref.compUpdate9.updateData();
        this.mainclassref.compUpdate10.updateData();
        this.mainclassref.setTabIndexGlobal(6);
        this.mainclassref.setTabIndexFinalizados(0);
        this.ngOnInit();
      }

    });

  }

  details(element){
    let dialogRef;
    dialogRef = this.dialog.open(LogPedidosComponent,{
      height: '800px',
      width: '1000px',
      data: {
        element
      }
    });
    dialogRef.afterClosed().subscribe(result => {

    });

  }


  getPlanillaList(){
    this.ListPlanilla = [];
    CPrint(Urlbase.tienda+"/pedidos/planillas?idvehiculo="+this.allVehicles.toString()+"&status="+this.SelectedPlanillaState+"&idstore="+this.SelectedStore+"&date1="+this.planillaDate1+"&date2="+this.planillaDate2);
    if(this.SelectedVehiclePlanilla=="-1"){
      this.http2.get(Urlbase.tienda+"/pedidos/planillas?idvehiculo="+this.allVehicles.toString()+"&status="+this.SelectedPlanillaState+"&idstore="+this.SelectedStore+"&date1="+this.planillaDate1+"&date2="+this.planillaDate2).subscribe(response => {

        //@ts-ignore
        response.forEach(element => {
          this.isPlanillaFull= true;
          this.ListPlanilla.push(element);
        });

    });
    }else{
      this.http2.get(Urlbase.tienda+"/pedidos/planillas?idvehiculo="+this.SelectedVehiclePlanilla.toString()+"&status="+this.SelectedPlanillaState+"&idstore="+this.SelectedStore+"&date1="+this.planillaDate1+"&date2="+this.planillaDate2).subscribe(response => {

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
    dialogRef = this.dialog.open(NotesModalComponent,{
      height: '275px',
      width: '850px',
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(result => {

      if(result.resp){
        this.http2.put(Urlbase.tienda+"/pedidos/closeplanilla?observaciones="+result.notes+"&idplanilla="+idplanilla,{}).subscribe(answer => {
          CPrint("THIS IS ANSWER: ",answer);
          this.getPlanillaList()
        })
      }
    });

  }

  confirmarEnv(elem) {
    CPrint("this is element dude, ", elem);
    this.http2.post(Urlbase.tienda+"/store/confirmarPC?numpedido="+elem.numdocumento+"&idbilltype=46&idstore="+this.SelectedStore,{}).subscribe(
        response => {
          this.http2.post(Urlbase.tienda+"/store/confirmarPC?numpedido="+elem.numdocumento+"&idbilltype=47&idstore="+this.SelectedStore,{}).subscribe(
              response2 => {
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
              })
        })
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
  ReturnColorStoreClient(caso){
    switch(caso){
      case 10: return "#ADD7B0";
      case 11: return "#C7E0F9";
      default: return "#A991C3";
    }
  }


  getRepProdList(){
    //DEFINO LAS COLUMNAS SEGUN LA SELECCIÓN
    this.DiccionarioColumnas = {};
    this.AnchosColumnas = {};
    if((this.SelectedBillType == '86' && this.SelectedBillState == '82') || (this.SelectedBillType == '86' && this.SelectedBillState == '62')){this.DiccionarioColumnas["select"] = "";}
    this.DiccionarioColumnas["fecha"] = "Fecha";this.AnchosColumnas["fecha"] = "6vw";
    this.DiccionarioColumnas["numdocumento"] = "Documento";this.AnchosColumnas["numdocumento"] = "5vw";
    this.DiccionarioColumnas["totalprice"] = "Valor";this.AnchosColumnas["totalprice"] = "5vw";
    this.DiccionarioColumnas["cliente"] = "Cliente";this.AnchosColumnas["cliente"] = "7vw";
    this.DiccionarioColumnas["address"] = "Dirección";this.AnchosColumnas["address"] = "6vw";
    this.DiccionarioColumnas["phone"] = "Teléfono";this.AnchosColumnas["phone"] = "4vw";
    this.DiccionarioColumnas["body"] = "Observaciones";this.AnchosColumnas["body"] = "4vw";
    this.DiccionarioColumnas["id_STORE_CLIENT"] = " ";this.AnchosColumnas["id_STORE_CLIENT"] = "2vw";
    /////////////////////////////////////////////
    this.mostrandoCargando = true;
    this.estadoCargando = "Consultando Pedidos";
    if(this.date1=='' || this.date2==''){
      let tmpDate = new Date();
      CPrint(Urlbase.facturacion+"/pedidos/master?id_store="+this.SelectedStore+"&id_bill_state="+this.SelectedBillState+"&id_bill_type="+this.SelectedBillType+"&date1="+new Date(tmpDate.getDate()-7)+"&date2="+ new Date());
      this.http2.get(Urlbase.facturacion+"/pedidos/master?id_store="+this.SelectedStore+"&id_bill_state="+this.SelectedBillState+"&id_bill_type="+this.SelectedBillType+"&date1="+new Date(tmpDate.getDate()-7)+"&date2="+new Date()).subscribe(
        data => {
            CPrint("THIS IS DATA: ",data);
            this.ListReportProd = data;
            this.isListProdFull = true;
            this.mostrandoCargando = false;
            this.estadoCargando = "";
            this.DictSelection = {};
            this.dataSource = new MatTableDataSourceWithCustomSort(this.ListReportProd);
            this.dataSource.filterPredicate = this.Filtro;
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
            this.dataSource.filterPredicate = this.Filtro;
            this.sort.sort(({ id: 'numdocumento', start: 'asc'}) as MatSortable);
            this.dataSource.sort = this.sort;
          }
      )

    }

  }

  getObs(element){

    if(element.body.length<30){
      return element.body
    }else{
      return element.body.substring(0,29)+"..."
    }

  }
  openObs(obs){

    let dialogRef = this.dialog.open(ObservationsNotesComponent,{
      height: '25vh',
      width: '90vw',
      maxWidth: '90vw',
      data: {
        obs: obs
      }
    })


  }
  getRepProdListBurnedDate(){
    this.burnedDate2.setDate(this.burnedDate2.getDate()-7);
    //DEFINO LAS COLUMNAS SEGUN LA SELECCIÓN
    this.DiccionarioColumnas = {};
    this.AnchosColumnas = {};
    if((this.SelectedBillType == '86' && this.SelectedBillState == '82') || (this.SelectedBillType == '86' && this.SelectedBillState == '62')){this.DiccionarioColumnas["select"] = "";}
    this.DiccionarioColumnas["fecha"] = "Fecha";this.AnchosColumnas["fecha"] = "6vw";
    this.DiccionarioColumnas["numdocumento"] = "Documento";this.AnchosColumnas["numdocumento"] = "5vw";
    this.DiccionarioColumnas["totalprice"] = "Valor";this.AnchosColumnas["totalprice"] = "5vw";
    this.DiccionarioColumnas["cliente"] = "Cliente";this.AnchosColumnas["cliente"] = "7vw";
    this.DiccionarioColumnas["address"] = "Dirección";this.AnchosColumnas["address"] = "6vw";
    this.DiccionarioColumnas["phone"] = "Teléfono";this.AnchosColumnas["phone"] = "4vw";
    this.DiccionarioColumnas["body"] = "Observaciones";this.AnchosColumnas["body"] = "4vw";
    this.DiccionarioColumnas["id_STORE_CLIENT"] = " ";this.AnchosColumnas["id_STORE_CLIENT"] = "2vw";
    /////////////////////////////////////////////
    this.mostrandoCargando = true;
    this.estadoCargando = "Consultando Pedidos";
    CPrint(Urlbase.facturacion+"/pedidos/master?id_store="+this.SelectedStore+"&id_bill_state="+this.SelectedBillState+"&id_bill_type="+this.SelectedBillType+"&date1="+this.burnedDate2+"&date2="+this.burnedDate);
    this.http2.get(Urlbase.facturacion+"/pedidos/master?id_store="+this.SelectedStore+"&id_bill_state="+this.SelectedBillState+"&id_bill_type="+this.SelectedBillType+"&date1="+this.burnedDate2+"&date2="+this.burnedDate).subscribe(
      data => {
          CPrint("THIS IS DATA: ",data);
          this.ListReportProd = data;
          this.isListProdFull = true;
          this.mostrandoCargando = false;
          this.estadoCargando = "";
          this.DictSelection = {};
          this.dataSource = new MatTableDataSourceWithCustomSort(this.ListReportProd);
          this.dataSource.filterPredicate = this.Filtro;
          this.sort.sort(({ id: 'numdocumento', start: 'asc'}) as MatSortable);
          this.dataSource.sort = this.sort;
        }
    )
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

  Filtro(data:any, filter:string){
    return !filter|| filter.split(",").includes(data.id_BILL+"")
  }

  cleanList(){
    this.isListProdFull = false;
    this.ListReportProd = [];
    this.DictSelection = {};
    this.dataSource = new MatTableDataSourceWithCustomSort(this.ListReportProd);
    this.dataSource.filterPredicate = this.Filtro;
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


