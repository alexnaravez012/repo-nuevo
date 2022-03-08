import {Component, Input, OnInit, ViewChild} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import {MatTableDataSourceWithCustomSort, PedidosComponent} from '../pedidos.component';
import {MatDatepicker, MatDialog, MatPaginator} from '@angular/material';
import {MatSort} from '@angular/material/sort';
import {LocalStorage} from '../../../../../../../../services/localStorage';
import {HttpClient} from '@angular/common/http';
import {Urlbase} from '../../../../../../../../shared/urls';
import * as jQuery from 'jquery';
import { BillingService } from 'src/app/services/billing.service';
let $: any = jQuery;
 

@Component({ 
  selector: 'app-re-orden-por-provider',
  templateUrl: './re-orden-por-provider.component.html',
  styleUrls: ['./re-orden-por-provider.component.css']
})
export class ReOrdenPorProviderComponent implements OnInit {
  @Input()
  Pedidos_Input:PedidosComponent;
  Pedidos_MainClassRef:PedidosComponent;
 
  Date1: Date; 
  Date2: Date;
  
  daysForPedido = 10;
  daysInBetweenDates=0;

  reportReorderTable = [];
  storesToSend = [];

  ListadoProveedores = [];
  ProveedorSeleccionado = -1;

  detalles="";
  EstadoBusqueda_Reorden = -1;
  SubTotalReorden = 0;
  TotalIVA = 0;
  TotalReorden = 0;
  ListadoFabricantes = {};//Esto es por IDS
  ListadoNombresFabricantes = {};//Acá relaciono el ID con el nombre
  ListadoFabricantesPorProvider = [];
  ListadoMarcasTotal = {};
  ListadoMarcasFiltrado = [];
  ListadoFabricantesSeleccionados = [];
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
    this.getStores();
    this.Pedidos_MainClassRef = this.Pedidos_Input;
    this.http2.get(Urlbase.facturacion+"/pedidos/providers?id_store="+this.locStorage.getIdStore()).subscribe(response =>{
      CPrint("LISTADOP PROVEEDORES: ",response);
      // @ts-ignore
      this.ListadoProveedores = response;
    })
    if(this.locStorage.getIdStore()!=301){
      this.http2.get(Urlbase.tienda+"/store/store2?idstore="+this.locStorage.getIdStore()).subscribe(response => {
        this.ClientStores = response
      })
    }
  }

  getClients(){
    if(this.locStorage.getIdStore()!=301){
      this.http2.get(Urlbase.tienda+"/store/store2?idstore="+this.SelectedStore).subscribe(response => {
        console.log("LISTADO CLIENTES: ",response)
        this.ClientStores = response
      })
    }
    this.http2.get(Urlbase.facturacion+"/pedidos/providers?id_store="+this.SelectedStore).subscribe(response =>{
      CPrint("LISTADOP PROVEEDORES: ",response);
      // @ts-ignore
      this.ListadoProveedores = response;
    })
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
    this.http2.get(Urlbase.facturacion+"/pedidos/providers?id_store="+this.SelectedStore).subscribe(response =>{
      CPrint("LISTADOP PROVEEDORES: ",response);
      // @ts-ignore
      this.ListadoProveedores = response;
    })
    this.ProveedorSeleccionado = -1;
    this.ActualizarFiltradoProviders();
    this.DataSourceReporte_Reorden = new MatTableDataSourceWithCustomSort(this.reportReorderTable);
    this.DataSourceReporte_Reorden.paginator = this.paginatorReorden;
    this.DataSourceReporte_Reorden.sort = this.SorterTablaReorden;
    this.DataSourceReporte_Reorden.filterPredicate = this.FuncionFiltro;
    this.storesToSend = [];
    this.EstadoBusqueda_Reorden = 1;
    this.makeClientList().then(response => {
      this.makeProviderList().then(response => {
        this.sendPost()
      })
    })
  }

  

  // sendPost(){
  //   this.Pedidos_MainClassRef.mostrandoCargando = true;
  //   this.Pedidos_MainClassRef.estadoCargando = "Consultando...";
  //   this.http2.get(Urlbase.facturacion + "/pedidos/reorderv2?id_store="+this.Pedidos_MainClassRef.SelectedStore+"&date1="+this.Date1+"&date2="+this.Date2+"&list="+this.storesToSend.toString()).subscribe(response =>  {
  //     this.Pedidos_MainClassRef.mostrandoCargando = false;
  //     CPrint(Urlbase.facturacion + "/pedidos/reorderv2?id_store="+this.Pedidos_MainClassRef.SelectedStore+"&date1="+this.Date1+"&date2="+this.Date2+"&list="+this.storesToSend.toString());
  //     //@ts-ignore
  //     this.reportReorderTable=response;
  //     this.EstadoBusqueda_Reorden = 2;
  //     this.DataSourceReporte_Reorden = new MatTableDataSourceWithCustomSort(this.reportReorderTable);
  //     this.DataSourceReporte_Reorden.paginator = this.paginatorReorden;
  //     this.DataSourceReporte_Reorden.sort = this.SorterTablaReorden;
  //     this.DataSourceReporte_Reorden.filterPredicate = this.FuncionFiltro;
  //     //Saco providers y marcas
  //     this.ListadoFabricantesSeleccionados = [];
  //     this.ListadoMarcasSeleccionadas = [];
  //     this.ListadoFabricantes = {};
  //     this.ListadoNombresFabricantes = {};
  //     this.ListadoMarcasTotal = {};
  //     for(let n = 0; n < this.reportReorderTable.length; n++){
  //       if(this.ListadoFabricantes[this.reportReorderTable[n]["id_PROVIDER"]] == null){
  //         console.log("IN CICLE #1")
  //         this.ListadoFabricantes[this.reportReorderTable[n]["id_PROVIDER"]] = {[this.reportReorderTable[n]["marca"]] : 1};
  //       }else{
  //         console.log("IN CICLE #2")
  //         this.ListadoFabricantes[this.reportReorderTable[n]["id_PROVIDER"]][this.reportReorderTable[n]["marca"]] = 1;
  //       }
  //       this.ListadoMarcasTotal[this.reportReorderTable[n]["marca"]] = 1;
  //       this.ListadoNombresFabricantes[this.reportReorderTable[n]["id_PROVIDER"]] = this.reportReorderTable[n]["fabricante"];
  //     }
  //     this.ListadoMarcasFiltrado = Object.keys(this.ListadoMarcasTotal);
  //     //
  //     this.daysInBetweenDates =Math.ceil(Math.abs(this.Date1.getTime() - this.Date2.getTime()) / (1000 * 3600 * 24));
  //     this.CalcularTotales();
  //   })
  // }

  cancel(){
    this.ngOnInit();
    this.ClientListToPost = [];
    this.ProviderListToPost = [];
    this.DataSourceReporte_Reorden = new MatTableDataSourceWithCustomSort();
    this.SubTotalReorden = 0;
    this.TotalIVA = 0;
    this.TotalReorden = 0;
  }

  sendPost(){
    this.Pedidos_MainClassRef.mostrandoCargando = true;
    this.Pedidos_MainClassRef.estadoCargando = "Consultando...";
    this.http2.get(Urlbase.facturacion + "/pedidos/reorderv2new?id_store="+this.Pedidos_MainClassRef.SelectedStore+"&date1="+this.Date1+"&date2="+this.Date2+"&list="+this.ClientListToPost.toString()+"&listProv="+this.ProviderListToPost.toString()).subscribe(response =>  {
      this.Pedidos_MainClassRef.mostrandoCargando = false;
      CPrint(Urlbase.facturacion + "/pedidos/reorderv2new?id_store="+this.Pedidos_MainClassRef.SelectedStore+"&date1="+this.Date1+"&date2="+this.Date2+"&list="+this.ClientListToPost.toString()+"&listProv="+this.ProviderListToPost.toString());
      this.ClientListToPost = [];
      this.ProviderListToPost = [];
       this.ListadoProveedores = [];
       
      //@ts-ignore
      this.reportReorderTable=response;
      for(let a = 0; a<this.reportReorderTable.length; a++){
        let element = this.reportReorderTable[a];
        let insertElement = {cbi_FULLNAME: element.proveedor,
                             id_STORE_PROVIDER: element.id_STORE,
                             id_THIRD_DESTINITY: element.id_THIRD}
       
        if(!(this.ListadoProveedores.filter( i => insertElement.id_STORE_PROVIDER == i.id_STORE_PROVIDER && insertElement.cbi_FULLNAME == i.cbi_FULLNAME && insertElement.id_THIRD_DESTINITY == i.id_THIRD_DESTINITY ).length>0 )){         
            this.ListadoProveedores.push(insertElement);
        }
      }
      
      this.ListadoProveedores.forEach((i,index) =>{
        if(i.cbi_FULLNAME==" "){
          this.ListadoProveedores[index].cbi_FULLNAME = "Sin Proveedor";
        }
      })

      
      
      this.EstadoBusqueda_Reorden = 2;
      this.DataSourceReporte_Reorden = new MatTableDataSourceWithCustomSort(this.reportReorderTable);
      this.DataSourceReporte_Reorden.paginator = this.paginatorReorden;
      this.DataSourceReporte_Reorden.sort = this.SorterTablaReorden;
      this.DataSourceReporte_Reorden.filterPredicate = this.FuncionFiltro;
      //Saco providers y marcas
      this.ListadoFabricantesSeleccionados = [];
      this.ListadoMarcasSeleccionadas = [];
      this.ListadoFabricantes = {};
      this.ListadoNombresFabricantes = {};
      this.ListadoMarcasTotal = {};
      for(let n = 0; n < this.reportReorderTable.length; n++){
        if(this.ListadoFabricantes[this.reportReorderTable[n]["id_PROVIDER"]] == null){
          console.log("IN CICLE #1")
          this.ListadoFabricantes[this.reportReorderTable[n]["id_PROVIDER"]] = {[this.reportReorderTable[n]["marca"]] : 1};
        }else{
          console.log("IN CICLE #2")
          this.ListadoFabricantes[this.reportReorderTable[n]["id_PROVIDER"]][this.reportReorderTable[n]["marca"]] = 1;
        }
        this.ListadoMarcasTotal[this.reportReorderTable[n]["marca"]] = 1;
        this.ListadoNombresFabricantes[this.reportReorderTable[n]["id_PROVIDER"]] = this.reportReorderTable[n]["fabricante"];
      }
      this.ListadoMarcasFiltrado = Object.keys(this.ListadoMarcasTotal);
      //
      this.daysInBetweenDates =Math.ceil(Math.abs(this.Date1.getTime() - this.Date2.getTime()) / (1000 * 3600 * 24));
      this.CalcularTotales();
    })
  }



  GetListadoMarcas(){
    return this.ListadoMarcasFiltrado.sort();
  }

  GetKeysReporteReorden(){
    this.DictColumnas_Reorden = {};
    this.DictColumnas_Reorden["proveedor"] = ["Proveedor",0]
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
  
    console.log("EVENTO",evento)
     console.log("LISTADO",this.ListadoFabricantes)
     if(tipo == 1){
       this.ListadoFabricantesSeleccionados = evento;
       this.ListadoMarcasSeleccionadas = [];
       this.ListadoMarcasFiltrado = [];  
       let ListadoAUsar = this.ListadoFabricantesSeleccionados;
       for(let n = 0;n<ListadoAUsar.length;n++){
         let MarcasFabricante = Object.keys(this.ListadoFabricantes[ListadoAUsar[n]]);
         for(let m = 0;m<MarcasFabricante.length;m++){
           this.ListadoMarcasFiltrado.push(MarcasFabricante[m]);
         }
       }
       if(this.ProveedorSeleccionado != -1 && this.ListadoFabricantesSeleccionados.length == 0){
         this.ListadoFabricantesSeleccionados = [-1];
       }
     }
     else if(tipo == 2){
       this.ListadoMarcasSeleccionadas = evento;
     }else{//tipo 3
       this.ProveedorSeleccionado = evento;
       this.Pedidos_MainClassRef.mostrandoCargando = true;
       this.Pedidos_MainClassRef.estadoCargando = "Consultando fabricantes y marcas";
       this.ListadoFabricantesSeleccionados = [];
       this.ListadoMarcasSeleccionadas = [];
       if(evento == -1){
         this.Pedidos_MainClassRef.mostrandoCargando = false;
         this.ListadoFabricantesPorProvider = [];
         this.ActualizarFiltrado([],1);
         return;
       }
       this.http2.get(Urlbase.facturacion+"/pedidos/fabricantes?id_third="+evento).subscribe(response =>{
         CPrint("145.000: ",response);
         // @ts-ignore
         this.ListadoFabricantesPorProvider = response;
         this.Pedidos_MainClassRef.mostrandoCargando = false;
         let ListadoAUsar = [];
         for(let n = 0;n<this.ListadoFabricantesPorProvider.length;n++){
           ListadoAUsar.push(this.ListadoFabricantesPorProvider[n]["id_PROVIDER"])
         }
         this.ActualizarFiltrado(ListadoAUsar,1);
       })
     }
     let Filtro = this.ListadoFabricantesSeleccionados+"|"+this.ListadoMarcasSeleccionadas.join(",");
     CPrint("Filtro es "+Filtro);
     this.DataSourceReporte_Reorden.filter = Filtro;
     this.CalcularTotales();
   }


    ActualizarFiltradoPorMarca(){
    if(this.ListadoMarcasSeleccionadas.includes(-1)){
      if(this.ListadoMarcasSeleccionadas.length>1){
        this.ListadoMarcasSeleccionadas = [];
      }else{
        this.ListadoMarcasSeleccionadas = this.ListadoMarcasFiltrado;
      }
    }
    console.log("LISTADO SELECTED: ",this.ListadoFabricantesSeleccionados)
    let myList = this.reportReorderTable.filter( i => i.id_THIRD == this.ProveedorSeleccionado);
    let myList2 = myList.filter(obj => {
      //@ts-ignore
      return this.ListadoFabricantesSeleccionados.includes(obj.fabricante);
    })
    let newDataSource = myList2.filter(obj => {
      //@ts-ignore
      return this.ListadoMarcasSeleccionadas.includes(obj.marca);
    })
    console.log("New Data Source: ", newDataSource);
    this.DataSourceReporte_Reorden = new MatTableDataSourceWithCustomSort(newDataSource);
    this.DataSourceReporte_Reorden.paginator = this.paginatorReorden;
    this.DataSourceReporte_Reorden.sort = this.SorterTablaReorden;
    this.DataSourceReporte_Reorden.filterPredicate = this.FuncionFiltro;
    
    this.Pedidos_MainClassRef.estadoCargando = "Consultando fabricantes y marcas";
    
    this.CalcularTotales();  
  }

  ActualizarFiltradoFabricante(){
    if(this.ListadoFabricantesSeleccionados.includes(-1)){
      if(this.ListadoFabricantesSeleccionados.length>1){
        this.ListadoFabricantesSeleccionados = [];
      }else{
        this.ListadoFabricantesSeleccionados = this.ListadoFabricantesPorProvider;
      }
    }
    console.log("LISTADO SELECTED: ",this.ListadoFabricantesSeleccionados)
    let myList = this.reportReorderTable.filter( i => i.id_THIRD == this.ProveedorSeleccionado);
    let newDataSource = myList.filter(obj => {
      //@ts-ignore
      return this.ListadoFabricantesSeleccionados.includes(obj.fabricante);
    })
    console.log("New Data Source: ", newDataSource);
    this.DataSourceReporte_Reorden = new MatTableDataSourceWithCustomSort(newDataSource);
    this.DataSourceReporte_Reorden.paginator = this.paginatorReorden;
    this.DataSourceReporte_Reorden.sort = this.SorterTablaReorden;
    this.DataSourceReporte_Reorden.filterPredicate = this.FuncionFiltro;
    
    this.Pedidos_MainClassRef.estadoCargando = "Consultando fabricantes y marcas";
    
    this.CalcularTotales();
    this.ListadoMarcasFiltrado = [];
    this.ListadoMarcasSeleccionadas = [];
    for(let a = 0; a<newDataSource.length; a++){
      let element = newDataSource[a];
      //@ts-ignore
      let insertElement = element.marca;
      
      if(!(this.ListadoMarcasFiltrado.filter( i => insertElement == i).length>0 )){         
          this.ListadoMarcasFiltrado.push(insertElement);
      }
    }

    this.ListadoMarcasFiltrado.sort();
  
  
    }

  ActualizarFiltradoProviders(){

    if(this.ProveedorSeleccionado == -1){
      this.DataSourceReporte_Reorden = new MatTableDataSourceWithCustomSort(this.reportReorderTable);
      this.DataSourceReporte_Reorden.paginator = this.paginatorReorden;
      this.DataSourceReporte_Reorden.sort = this.SorterTablaReorden;
      this.DataSourceReporte_Reorden.filterPredicate = this.FuncionFiltro;
      
      this.Pedidos_MainClassRef.estadoCargando = "Consultando fabricantes y marcas";
      this.ListadoFabricantesSeleccionados = [];
      this.ListadoMarcasSeleccionadas = [];
      this.ListadoMarcasFiltrado = [];
        
      let Filtro = this.ListadoFabricantesSeleccionados+"|"+this.ListadoMarcasSeleccionadas.join(",");
      CPrint("Filtro es "+Filtro);
      this.DataSourceReporte_Reorden.filter = Filtro;
      this.CalcularTotales();

    }else{
    
      let newDataSource = this.reportReorderTable.filter( i => i.id_THIRD == this.ProveedorSeleccionado)
      console.log("NEW DATA SOURCE: ",newDataSource)
      this.DataSourceReporte_Reorden = new MatTableDataSourceWithCustomSort(newDataSource);
      this.DataSourceReporte_Reorden.paginator = this.paginatorReorden;
      this.DataSourceReporte_Reorden.sort = this.SorterTablaReorden;
      this.DataSourceReporte_Reorden.filterPredicate = this.FuncionFiltro;
      
      this.Pedidos_MainClassRef.estadoCargando = "Consultando fabricantes y marcas";
      this.ListadoFabricantesSeleccionados = [];
      this.ListadoMarcasSeleccionadas = [];
      this.ListadoMarcasFiltrado = [];

      let Filtro = this.ListadoFabricantesSeleccionados+"|"+this.ListadoMarcasSeleccionadas.join(",");
      CPrint("Filtro es "+Filtro);
      this.DataSourceReporte_Reorden.filter = Filtro;
      this.CalcularTotales();
      
      this.ListadoFabricantesPorProvider = [];
      for(let a = 0; a<newDataSource.length; a++){
        let element = newDataSource[a];
        let insertElement = element.fabricante
       
        if(!(this.ListadoFabricantesPorProvider.filter( i => insertElement == i).length>0 )){         
            this.ListadoFabricantesPorProvider.push(insertElement);
        }
      }
        
    
    }
  }


  async getDetalles(){
    this.DataSourceReporte_Reorden.data.forEach(element => {

      //@ts-ignore
      if(this.round((this.daysForPedido * element.cantidad_VENDIDA / this.daysInBetweenDates)-element.cantidad_EN_INVENTARIO,0)>0 && this.round((this.daysForPedido * element.cantidad_VENDIDA / this.daysInBetweenDates)-element.cantidad_EN_INVENTARIO,0)!= Infinity){
        //@ts-ignore
        this.detalles+="{"+element.idps+","+this.round(element.costo,0)+","+element.idt+","+this.round((this.daysForPedido * element.cantidad_VENDIDA / this.daysInBetweenDates)-element.cantidad_EN_INVENTARIO,0)+"},"
      }
    });
  }

  sendData(){
    this.getDetalles().then(elem => {
      this.makeClientList().then(elem => {
        this.makeProviderList().then(elem => {
          CPrint("DETAILS TO SEND: ",this.detalles);
          this.SolicitarPedido();
        })  
      })
    })
  }

  ClientListToPost = [];
  async makeClientList(){
    if(String(this.SelectedStore4item)=="-1"){
      for(let a = 0; a < this.ClientStores.length; a++){
        await this.ClientListToPost.push(this.ClientStores[a].id_STORE);
      }
      await console.log(this.ClientListToPost);
    }else{
      await this.ClientListToPost.push(this.SelectedStore4item);
      await console.log(this.ClientListToPost);

    }
  }

  ProviderListToPost = [];
  async makeProviderList(){
    if(String(this.ProveedorSeleccionado)=="-1"){
      for(let a = 0; a < this.ListadoProveedores.length; a++){
        await this.ProviderListToPost.push(this.ListadoProveedores[a].id_STORE_PROVIDER);
      }
      await console.log(this.ProviderListToPost);
    }else{
      await this.ProviderListToPost.push(this.ProveedorSeleccionado);
      await console.log(this.ProviderListToPost);

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

  async SolicitarPedido(){
    this.Pedidos_MainClassRef.mostrandoCargando = true;
    this.Pedidos_MainClassRef.estadoCargando = "Consultando...";
     this.http2.post(Urlbase.facturacion + "/pedidos/crearPedidoV2/costo?idthirdclient="+this.locStorage.getThird().id_third+"&idstoreclient="+this.Pedidos_MainClassRef.SelectedStore+"&idthirdempclient="+this.locStorage.getToken().id_third+"&idthirdprov="+this.ListadoProveedores.filter(element => element.id_THIRD_DESTINITY == this.ProveedorSeleccionado )[0].id_THIRD_DESTINITY+"&idstoreprov="+this.ListadoProveedores.filter(element => element.id_THIRD_DESTINITY == this.ProveedorSeleccionado )[0].id_STORE_PROVIDER,{detalles: this.detalles}).subscribe(
       response=> { 
         this.ProviderListToPost = [];
         this.ClientListToPost = [];
         this.detalles="";
         this.showNotification('top', 'center', 3, "<h3>Pedido creado con exito.</h3>", 'info',20000);
         this.Pedidos_MainClassRef.mostrandoCargando = false;
        //  this.http2.get(Urlbase.facturacion+"/billing/UniversalPDF?id_bill="+response+"&pdf=-1",{responseType: 'text'}).subscribe(responses =>{
        //    window.open(Urlbase.remisiones+"/"+responses, "_blank");
        //    this.Pedidos_MainClassRef.mostrandoCargando = false;
        //  })
       })
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
      let divididoFabricante = dividido[0].split(',');
      let encontrado = false;
      for(let n = 0;n<divididoFabricante.length;n++){
        if(parseInt(divididoFabricante[n]) == data.id_PROVIDER){
          encontrado = true;
          break;
        }
      }
      return encontrado;
    }
    else{
      let divididoFabricante = dividido[0].split(',');
      let encontrado = false;
      for(let n = 0;n<divididoFabricante.length;n++){
        if((parseInt(divididoFabricante[n]) == data.id_PROVIDER) && dividido[1].includes(data.marca)){
          encontrado = true;
          break;
        }
      }
      return encontrado;
    }
  }

  round(value, precision) {
    const multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }
}
