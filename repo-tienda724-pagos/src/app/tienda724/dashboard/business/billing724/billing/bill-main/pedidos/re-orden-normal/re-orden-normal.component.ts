import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import {MatDatepicker, MatDialog, MatPaginator} from '@angular/material';
import {MatSort} from '@angular/material/sort';
import {MatTableDataSourceWithCustomSort, PedidosComponent} from '../pedidos.component';
import {Urlbase} from '../../../../../../../../shared/urls';
import {SolicitarPedidoReOrdenComponent} from '../solicitar-pedido-re-orden/solicitar-pedido-re-orden.component';
import {LocalStorage} from '../../../../../../../../services/localStorage';
import {HttpClient} from '@angular/common/http';
import { BillingService } from 'src/app/services/billing.service';

@Component({
  selector: 'app-re-orden-normal',
  templateUrl: './re-orden-normal.component.html',
  styleUrls: ['./re-orden-normal.component.css']
})
export class ReOrdenNormalComponent implements OnInit {

  @Input()
  Pedidos_Input:PedidosComponent;
  Pedidos_MainClassRef:PedidosComponent;

  Date1: Date;
  Date2: Date; 

  daysForPedido = 10;
  daysInBetweenDates=0;

  reportReorderTable = [];
  storesToSend = [];

  EstadoBusqueda_Reorden = -1;
  SubTotalReorden = 0;
  TotalIVA = 0;
  TotalReorden = 0;
  ListadoProviders = {};//Esto es por IDS
  ListadoNombresProviders = {};//Acá relaciono el ID con el nombre
  ListadoMarcasTotal = {};
  ListadoMarcasFiltrado = [];
  ListadoProvidersSeleccionados = "";
  ListadoMarcasSeleccionadas = [];
  DataSourceReporte_Reorden = new MatTableDataSourceWithCustomSort();
  @ViewChild('pickerthirds2') SelectorFechaFinal_Reorden: MatDatepicker<Date>;
  @ViewChild('SorterTablaReorden') SorterTablaReorden: MatSort;
  @ViewChild('PaginatorReorden', {static: true}) paginatorReorden: MatPaginator;
  DictColumnas_Reorden = {};

  constructor(
    public dialog: MatDialog,
    public locStorage: LocalStorage,
    private http2: HttpClient,
    private billingService : BillingService,
  ) {
  }

  SelectedStore4item = "-1"
  ClientStores;
  ngOnInit(): void {
    this.Pedidos_MainClassRef = this.Pedidos_Input;
    if(this.locStorage.getIdStore()!=301){
      this.http2.get(Urlbase.tienda+"/store/store2?idstore="+this.locStorage.getIdStore()).subscribe(response => {
        this.ClientStores = response
      })
    }
    this.getStores();
  }

  getClients(){
    if(this.locStorage.getIdStore()!=301){
      this.http2.get(Urlbase.tienda+"/store/store2?idstore="+this.locStorage.getIdStore()).subscribe(response => {
        this.ClientStores = response
      })
    }
  }


  Stores;
  SelectedStore = this.locStorage.getIdStore();

  getStores() {
    this.billingService.getStoresByThird(this.locStorage.getToken().id_third).subscribe(data => {
      CPrint(data);
      this.Stores = data;
    })
  }
 

  generatePedidosExcel(){
    CPrint(Urlbase.tienda + "/resource/pedidos/Excel?days_ask="+this.daysForPedido+"&days_between="+this.daysInBetweenDates);
    this.http2.post(Urlbase.tienda + "/resource/pedidos/Excel?days_ask="+this.daysForPedido+"&days_between="+this.daysInBetweenDates,this.DataSourceReporte_Reorden.filteredData, {
      responseType: 'text'
    }).subscribe(response =>{
      CPrint(response);
      window.open(Urlbase.reportes+"/"+response, "_blank");
    })
  }

  generate(){
    this.storesToSend = [];
    this.EstadoBusqueda_Reorden = 1;
    if(this.SelectedStore4item == "-1"){
      this.generate2().then(response => {this.sendPost()})
    }else{
      this.storesToSend.push(this.SelectedStore4item);
      this.sendPost();
    }
    
  }

  async generate2(){
    console.log("tiendas",this.storesToSend)
    if(this.SelectedStore4item  == "-1"){
      this.ClientStores.forEach(store => {
        this.storesToSend.push(store.id_STORE);
      })
    }else{
      this.storesToSend.push(Number(this.Pedidos_MainClassRef.SelectedStore));
    }
  }

  sendPost(){
    this.Pedidos_MainClassRef.mostrandoCargando = true;
    this.Pedidos_MainClassRef.estadoCargando = "Consultando...";
    this.http2.get(Urlbase.facturacion + "/pedidos/reorderv2?id_store="+this.Pedidos_MainClassRef.SelectedStore+"&date1="+this.Date1+"&date2="+this.Date2+"&list="+this.storesToSend.toString()).subscribe(response =>  {
      this.Pedidos_MainClassRef.mostrandoCargando = false;
      CPrint(Urlbase.facturacion + "/pedidos/reorderv2?id_store="+this.Pedidos_MainClassRef.SelectedStore+"&date1="+this.Date1+"&date2="+this.Date2+"&list="+this.storesToSend.toString());
      //@ts-ignore
      this.reportReorderTable=response;
      this.EstadoBusqueda_Reorden = 2;
      this.DataSourceReporte_Reorden = new MatTableDataSourceWithCustomSort(this.reportReorderTable);
      this.DataSourceReporte_Reorden.paginator = this.paginatorReorden;
      this.DataSourceReporte_Reorden.sort = this.SorterTablaReorden;
      this.DataSourceReporte_Reorden.filterPredicate = this.FuncionFiltro;
      //Saco providers y marcas
      this.ListadoProvidersSeleccionados = "";
      this.ListadoMarcasSeleccionadas = [];
      this.ListadoProviders = {};
      this.ListadoNombresProviders = {};
      this.ListadoMarcasTotal = {};
      for(let n = 0; n < this.reportReorderTable.length; n++){
        if(this.ListadoProviders[this.reportReorderTable[n]["id_PROVIDER"]] == null){
          this.ListadoProviders[this.reportReorderTable[n]["id_PROVIDER"]] = {[this.reportReorderTable[n]["marca"]] : 1};
        }else{
          this.ListadoProviders[this.reportReorderTable[n]["id_PROVIDER"]][this.reportReorderTable[n]["marca"]] = 1;
        }
        this.ListadoMarcasTotal[this.reportReorderTable[n]["marca"]] = 1;
        this.ListadoNombresProviders[this.reportReorderTable[n]["id_PROVIDER"]] = this.reportReorderTable[n]["fabricante"];
      }
      this.ListadoMarcasFiltrado = Object.keys(this.ListadoMarcasTotal);
      //
      this.daysInBetweenDates =Math.ceil(Math.abs(this.Date1.getTime() - this.Date2.getTime()) / (1000 * 3600 * 24));
      this.CalcularTotales();
    })
  }

  GetListadoProviders(){
    return Object.keys(this.ListadoProviders).sort((a,b) => {return PedidosComponent.SortFunction(this.ListadoNombresProviders[a],this.ListadoNombresProviders[b],'asc')});
  }

  GetListadoMarcas(){
    return this.ListadoMarcasFiltrado.sort();
  }

  GetKeysReporteReorden(){
    this.DictColumnas_Reorden = {};
    this.DictColumnas_Reorden["barcode"] = ["Codigo de Barras",0];
    this.DictColumnas_Reorden["producto"] = ["Producto",0];
    this.DictColumnas_Reorden["presentacion"] = ["Presentacion",0];
    this.DictColumnas_Reorden["fabricante"] = ["Fabricante",0];
    this.DictColumnas_Reorden["marca"] = ["Marca",0];
    this.DictColumnas_Reorden["linea"] = ["Linea",0];
    this.DictColumnas_Reorden["categoria"] = ["Categoria",0];
    this.DictColumnas_Reorden["costo"] = ["Costo",1];
    this.DictColumnas_Reorden["iva"] = ["IVA",0];
    this.DictColumnas_Reorden["cantidad_VENDIDA"] = ["Cantidad Vendida",0];
    this.DictColumnas_Reorden["cantidad_EN_INVENTARIO"] = ["Cantidad en Inventario",0];
    this.DictColumnas_Reorden["especial1"] = ["Promedio Diario",0];
    this.DictColumnas_Reorden["especial2"] = ["Cantidad a Pedir",0];
    this.DictColumnas_Reorden["especial3"] = ["Cantidad Contra Inventario",0];
    return Object.keys(this.DictColumnas_Reorden);
  }

  CalcularTotales(){
    this.SubTotalReorden = 0;
    this.TotalIVA = 0;
    this.TotalReorden = 0;
    let data = this.DataSourceReporte_Reorden.filteredData;
    for(let n = 0; n < data.length; n++){
      let Cantidad = this.round((this.daysForPedido * parseInt(data[n]["cantidad_VENDIDA"]) / this.daysInBetweenDates)-parseInt(data[n]["cantidad_EN_INVENTARIO"]),0);
      Cantidad = Cantidad < 0 ? 0 : Cantidad;
      let SubTotal = data[n]["costo"] * Cantidad;
      this.SubTotalReorden += SubTotal;
      this.TotalIVA += SubTotal*(data[n]["iva"]/100);
      this.TotalReorden += SubTotal + (SubTotal*(data[n]["iva"]/100));
    }
  }

  ActualizarFiltrado(evento,tipo){
    if(tipo == 1){
      this.ListadoProvidersSeleccionados = evento;
      this.ListadoMarcasSeleccionadas = [];
      if(this.ListadoProvidersSeleccionados.length == 0){this.ListadoMarcasFiltrado = Object.keys(this.ListadoMarcasTotal);}
      else{
        // @ts-ignore
        let listaRetorno = Object.keys(this.ListadoProviders[this.ListadoProvidersSeleccionados]);
        this.ListadoMarcasFiltrado = listaRetorno;
      }
    }
    else{this.ListadoMarcasSeleccionadas = evento;}
    let Filtro =this.ListadoProvidersSeleccionados+"|"+this.ListadoMarcasSeleccionadas.join(",");
    CPrint(Filtro);
    this.DataSourceReporte_Reorden.filter = Filtro;
    this.CalcularTotales();
  }

  async SolicitarPedido(){
    this.Pedidos_MainClassRef.mostrandoCargando = true;
    this.Pedidos_MainClassRef.estadoCargando = "Consultando...";
    let Respuesta = await new Promise(resolve => {
      this.http2.get(Urlbase.facturacion+"/pedidos/detalles/v2?id_store="+this.Pedidos_MainClassRef.SelectedStore+"&id_prov="+this.ListadoProvidersSeleccionados).subscribe(value => {resolve([true,value])},error => {resolve([false,error])})
    });
    if(Respuesta[0]){
      this.Pedidos_MainClassRef.mostrandoCargando = false;
      const dialogRef = this.dialog.open(SolicitarPedidoReOrdenComponent, {
        width: '50vw',
        data: {
          data:Respuesta[1],
          details:this.DataSourceReporte_Reorden.filteredData,
          days_ask: this.daysForPedido,
          days_between: this.daysInBetweenDates,
          id_store: this.Pedidos_MainClassRef.SelectedStore
        }
      });
      dialogRef.afterClosed().subscribe(result => {
        CPrint('The dialog was closed');
      });
    }else{
      this.Pedidos_MainClassRef.mostrandoCargando = false;
      //manejo del error
    }
  }

  FuncionFiltro(data:{id_PROVIDER: number,marca:string}, filterValue: string){
    if(filterValue.length == 0 || filterValue.length == 1){
      return true;
    }
    let dividido = filterValue.split('|');
    if(dividido[0].length == 0 && dividido[1].length == 0){
      return true;
    }
    else if(dividido[0].length == 0 && dividido[1].length != 0){
      return dividido[1].includes(data.marca);
    }
    else if(dividido[0].length != 0 && dividido[1].length == 0){
      return (parseInt(dividido[0]) == data.id_PROVIDER);
    }
    else{
      return (parseInt(dividido[0]) == data.id_PROVIDER) && dividido[1].includes(data.marca);
    }
  }

  round(value, precision) {
    const multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }
}
