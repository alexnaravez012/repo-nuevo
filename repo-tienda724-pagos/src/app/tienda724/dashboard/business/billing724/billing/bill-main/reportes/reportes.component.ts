import {Component, OnInit, ViewChild} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import {Chart} from 'chart.js/dist/Chart.js';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {LocalStorage} from '../../../../../../../services/localStorage';
import {DatePipe} from '@angular/common';
import {BillingService} from '../../../../../../../services/billing.service';
import {Urlbase} from '../../../../../../../shared/urls';
import {Router} from '@angular/router';
import {MatTableDataSourceWithCustomSort} from '../pedidos/pedidos.component';
import {MatDatepicker, MatDialog, MatSort, MatPaginator} from '@angular/material';
import {BillsWithProductComponent} from '../bills-with-product/bills-with-product.component';
import { KardexComponent } from '../kardex/kardex.component';

@Component({
  selector: 'app-reportes',
  templateUrl: './reportes.component.html',
  styleUrls: ['./reportes.component.scss']
})
export class ReportesComponent implements OnInit {
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });


  mostrandoCargando = false;
  picker;
  picker2;
  LineChart=null;
  PieChart=[];
  datos = [];
  title = "This is Title";
  labels = ["Tax", "Subtotal", "Total"];
  chartHtml = "<div></div>";
  date1: Date;
  date2: Date;
  date3: Date;
  date4: Date;
  dateP1: Date;
  dateP2: Date;
  dateC1: Date;
  dateC2: Date;
  dateF1: Date;
  dateF2: Date;
  dateCC1: Date;
  dateCC2: Date;
  ThirdsDate1: Date;
  ThirdsDate2: Date;
  LineChartTotal = null;
  LineChartSubtotal = [];
  LineChartTax = [];
  Labels = [];
  Labels2 = [];
  datosTotal = [];
  datosReport = [];
  datosSubtotal = [];
  datosTax = [];
  tipoFactura = 1;
  tipoFactura2 = 1;
  tipoIntervalo = 1;
  colorLabels = [];
  chartLabel = "";
  BarChart = null;
  CategoryFirstLvlList;
  Stores;
  SubCategoryList;
  ProductList;
  SelectedLine = -1;
  SelectedSubCategory = -1;
  SelectedBrand = -1;
  SelectedProduct = -1;
  dataTablaThirds = [];
  //
  ListReportProd = [];
  //
  ListReportCat = [];
  //
  ListReportBill = [];
  //
  ListReportCC;
  //
  StoreNameForConsec: String;
  //
  devolucionesVentas = 0;
  ventasTotales = 0;
  costosTotales = 0;
  utilidadesTotales = 0;
  margenPromedio = 0;
  margenPromedio2 = 0;
  //
  storeId;
  //
  CampoSorteando = ["","","","",""];
  Invertido = [false,false,false,false,false];

  //Todo Tabla CAJA
  DictTablaConsecutivos_caja = {};
  EstadoBusqueda_Caja = -1;
  @ViewChild('pickerCC2') SelectorFechaFinal: MatDatepicker<Date>;

  //Todo Tabla Terceros
  EstadoBusqueda_Terceros = -1;
  DataSourceTerceros = new MatTableDataSourceWithCustomSort();
  @ViewChild('pickerthirds2') SelectorFechaFinal_Terceros: MatDatepicker<Date>;
  @ViewChild('SorterTablaTerceros') SorterTablaTerceros: MatSort;

  //Todo Tabla Productos
  EstadoBusqueda_Productos = -1;
  DataSourceProductos = new MatTableDataSourceWithCustomSort();
  @ViewChild('pickerP2') SelectorFechaFinal_Productos: MatDatepicker<Date>;
  @ViewChild('SorterTablaProductos') SorterTablaProductos: MatSort;

  //Todo Tabla Categorias
  EstadoBusqueda_Categorias = -1;
  DataSourceCategorias = new MatTableDataSourceWithCustomSort();
  @ViewChild('pickerC2') SelectorFechaFinal_Categorias: MatDatepicker<Date>;
  @ViewChild('SorterTablaCategorias') SorterTablaCategorias: MatSort;

  //Todo Tabla Facturación
  EstadoBusqueda_Facturacion = -1;
  DataSourceFacturacion = new MatTableDataSourceWithCustomSort();
  @ViewChild('pickerF2') SelectorFechaFinal_Facturacion: MatDatepicker<Date>;
  ListadoColumnasParaFacturacion = [];
  @ViewChild('SorterTablaFacturacion') SorterTablaFacturacion: MatSort;

  //Todo Reportes
  EstadoBusqueda_Reportes = -1;
  @ViewChild('picker2') SelectorFechaFinal_Reportes: MatDatepicker<Date>;

  //Todo Grafico por Productos
  EstadoBusqueda_GPProductos = -1;
  @ViewChild('picker4') SelectorFechaFinal_GPProductos: MatDatepicker<Date>;

  constructor(private router: Router,private categoriesService: BillingService,
              private datePipe: DatePipe,
              private http2: HttpClient,
              public locStorage: LocalStorage,
              private httpClient: HttpClient,
              public dialog: MatDialog,) {
    this.headers = new HttpHeaders({
      'Content-Type': 'application/json',
      'Authorization': this.locStorage.getTokenValue(),
    });
    //GENERO LAS COLUMNAS CORRESPONDIENTES PARA FACTURACIÓN
    this.ListadoColumnasParaFacturacion.push('fullname');
    this.ListadoColumnasParaFacturacion.push('purchase_DATE');
    this.ListadoColumnasParaFacturacion.push('venta');
    if(this.locStorage.getRol()[0].id_rol!=8888){this.ListadoColumnasParaFacturacion.push('costo');}
    if(this.locStorage.getRol()[0].id_rol!=8888){this.ListadoColumnasParaFacturacion.push('tax');}
    if(this.locStorage.getRol()[0].id_rol!=8888){this.ListadoColumnasParaFacturacion.push('utilidad');}
    if(this.locStorage.getRol()[0].id_rol!=8888){this.ListadoColumnasParaFacturacion.push('pct_MARGEN_VENTA');}
    if(this.locStorage.getRol()[0].id_rol!=8888){this.ListadoColumnasParaFacturacion.push('pct_MARGEN_COSTO');}
    this.ListadoColumnasParaFacturacion.push('caja');
    this.ListadoColumnasParaFacturacion.push('cajero');
    if(this.locStorage.getRol()[0].id_rol!=8888){this.ListadoColumnasParaFacturacion.push('id_BILL_STATE');}
    if(this.locStorage.getRol()[0].id_rol!=8888){this.ListadoColumnasParaFacturacion.push('domiciliario');}
  }
  Stores2;
  id_menu=151;
  Brands;
  SelectedStore4item = "-1"
  ClientStores;

  ngOnInit() {

    if(this.locStorage.getIdStore()!=301){
      this.http2.get(Urlbase.tienda+"/store/store2?idstore="+this.locStorage.getIdStore()).subscribe(response => {
        this.ClientStores = response
      })
    }
    this.getBrands();

    //PROTECCION URL INICIA
    CPrint(JSON.stringify(this.locStorage.getMenu()))
    const elem = this.locStorage.getMenu().find(item => item.id_menu == this.id_menu);

    if(!elem){
      this.router.navigateByUrl("/dashboard/business/movement/nopermision");
    }
    //PROTECCION URL TERMINA
    //@ts-ignore
    this.storeId = this.locStorage.getIdStore();
    this.StoreNameForConsec = (this.locStorage.getThird().info.fullname.replace(" ","_"))+"_cc_";
    this.getFirstLvlCategory();
    this.getStores();
    this.http2.get(Urlbase.tienda + "/resource/pendingStores?id_store="+this.locStorage.getIdStore()).subscribe(
      element => {
        this.Stores2 = element;
      }
    )
  }
  SelectedStore = [this.locStorage.getIdStore()];
  totalDomicilios = 0;
  ventasDomicilios = 0;

  async generateMeans(){

    let cont = 0;

    this.ListReportBill.forEach(element => {
      if(element.domiciliario != "Sin Domicilio"){
        this.totalDomicilios++;
        this.ventasDomicilios+=element.venta;
      }
      if(element.id_BILL_STATE == 1){
        this.ventasTotales+=element.venta;
        this.costosTotales+=element.costo;
        this.utilidadesTotales+=element.utilidad;
        this.margenPromedio+=element.pct_MARGEN_VENTA;
        this.margenPromedio+=element.pct_MARGEN_COSTO;
      }else{
        if(element.id_BILL_STATE == 41){
          CPrint("WEBBB: ",this.devolucionesVentas);
          this.devolucionesVentas+=element.venta;
        }
      }

      cont++;
    });


    this.margenPromedio = this.utilidadesTotales*100/this.ventasTotales;
    this.margenPromedio2 = this.utilidadesTotales*100/this.costosTotales;

  }

  generatePdfRoute(elem){
    let flag = 0;
    if(elem.id_MESA != 0){
      flag = 1;
    }
    //let name = fullname.split(" ").join("_");
    this.http2.get(Urlbase.facturacion+"/billing/UniversalPDF?id_bill="+elem.id_BILL+"&pdf=-1&cash=0&restflag="+flag+"&size="+false,{responseType: 'text'}).subscribe(response =>{

      //return Urlbase.root+"facturas/"+name+"_"+num_DOCUMENTO+".pdf";
      window.open(Urlbase.facturas+"/"+response, "_blank");
    });
  }

  resetCategories(){
    this.SubCategoryList=[];
    this.SelectedSubCategory2 = -1;
    this.SelectedLine2 = -1;
  }




  generatePdfRoute2(id_caja,consecutive){
    this.http2.get(Urlbase.cierreCaja+"/close/id_cierre_caja?idcaja="+id_caja+"&consecutive="+consecutive).subscribe(res => {
      this.http2.get(Urlbase.cierreCaja+"/close/docurl?iddoc="+res+"&idtype=2",{responseType: "text"}).subscribe(responc => {
        //@ts-ignore
        window.open(responc, "_blank");
      })
    })
  }


  updateBox(elem){
  this.http2.put(Urlbase.cierreCaja+"/close/notes?notes="+elem.notes+"&id_caja="+elem.RawData[0].idcaja+"&consecutive="+elem.RawData[0].consecutive,{}).subscribe(r => {
  alert("Actualizacion hecha correctamente")
  })
  }


  generateReportBillTable(){

    this.getRepBillList1().then( r => {
      this.getRepTable();
    } )

  }

  generateReportBill(){

    this.getRepBillList1().then( r => {
      this.getRepBillList();
    } )

  }

  ListToPush = [];

  async getRepBillList1(){
    this.ListToPush = this.SelectedStore;
  }

 @ViewChild('paginatorBilling', { static: true }) paginator: MatPaginator;
 getRepBillList(){
    this.mostrandoCargando = true;
    this.totalDomicilios = 0;
    this.ventasDomicilios = 0;
    this.devolucionesVentas  = 0;
    this.ventasTotales = 0;
    this.costosTotales = 0;
    this.utilidadesTotales = 0;
    this.margenPromedio = 0;
    this.margenPromedio2 = 0;
    this.EstadoBusqueda_Facturacion = 1;
    CPrint(Urlbase.tienda+"/resource/reportbill?id_third="+this.locStorage.getThird().id_third+"&id_store="+this.ListToPush+"&date1="+this.transformDate(this.dateF1)+"&date2="+this.transformDate(this.dateF2)+"&typemove="+this.tipoFactura2);
    this.http2.get(Urlbase.tienda+"/resource/reportbill?id_third="+this.locStorage.getThird().id_third+"&id_store="+this.ListToPush+"&date1="+this.transformDate(this.dateF1)+"&date2="+this.transformDate(this.dateF2)+"&typemove="+this.tipoFactura2).subscribe(
      data => {
        CPrint("I NEED THIS DATA DUDE: ",data);
        this.SelectedStore = [this.locStorage.getIdStore()];
        this.ListToPush = [];
        // @ts-ignore
        this.ListReportBill = data;
        this.EstadoBusqueda_Facturacion = 2;

        this.DataSourceFacturacion = new MatTableDataSourceWithCustomSort(this.ListReportBill);
        this.DataSourceFacturacion.paginator = this.paginator;
        this.DataSourceFacturacion.sortingDataAccessor = (item, property) => {
          switch(property) {
            case 'fullname': return item['fullname']+'-'+item['num_DOCUMENTO'];
            default: return item[property];
          }
        };
        this.generateMeans().then(data => {

          this.mostrandoCargando=false;
          this.DataSourceFacturacion.sort = this.SorterTablaFacturacion;
        });
      }
    )
  }



  getRepTable(){
    this.mostrandoCargando = true;
    this.totalDomicilios = 0;
    this.ventasDomicilios = 0;
    this.devolucionesVentas  = 0;
    this.ventasTotales = 0;
    this.costosTotales = 0;
    this.utilidadesTotales = 0;
    this.margenPromedio = 0;
    this.margenPromedio2 = 0;
    this.EstadoBusqueda_Facturacion = 1;
    CPrint(Urlbase.tienda+"/resource/reportbill?id_third="+this.locStorage.getThird().id_third+"&id_store="+this.ListToPush+"&date1="+this.transformDate(this.dateF1)+"&date2="+this.transformDate(this.dateF2)+"&typemove="+this.tipoFactura2);
    this.http2.get(Urlbase.tienda+"/resource/reportbill?id_third="+this.locStorage.getThird().id_third+"&id_store="+this.ListToPush+"&date1="+this.transformDate(this.dateF1)+"&date2="+this.transformDate(this.dateF2)+"&typemove="+this.tipoFactura2).subscribe(
      data => {
        CPrint("I NEED THIS DATA DUDE: ",data);
        this.SelectedStore = [this.locStorage.getIdStore()];
        this.ListToPush = [];
        // @ts-ignore
        this.ListReportBill = data;
        this.EstadoBusqueda_Facturacion = 2;
        this.mostrandoCargando=false;
        this.generateMeans().then(data => {

        });
      }
    )
  }

  getSecondLvlCategory2(){
    this.SelectedBrand2 = -1;
    if(this.SelectedLine2 != -1){
      this.http2.get(Urlbase.tienda+"/categories2/children?id_category_father="+this.SelectedLine2).subscribe(data => {
        this.SubCategoryList = data
        this.SelectedSubCategory2=-1;
      })
    }

  }


  showStuf(){
    console.log(this.SelectedStore)
    if(this.SelectedStore.includes(-1)){
      this.SelectedStore = [this.locStorage.getIdStore()]
      this.Stores.forEach(element => {
        this.SelectedStore.push(element.id_STORE);
      });
    }
  }



  getRepCCList(){
    this.totalDomicilios = 0;
    this.ventasDomicilios = 0;
    this.devolucionesVentas  = 0;
    this.ventasTotales = 0;
    this.costosTotales = 0;
    this.utilidadesTotales = 0;
    this.margenPromedio = 0;
    this.margenPromedio2 = 0;
    this.EstadoBusqueda_Caja = 1;
    CPrint(Urlbase.cierreCaja+"/close/report?id_store="+this.locStorage.getIdStore()+"&date1="+this.transformDate(this.dateCC1)+"&date2="+this.transformDate(this.dateCC2));
    this.http2.get(Urlbase.cierreCaja+"/close/report?id_store="+this.locStorage.getIdStore()+"&date1="+this.transformDate(this.dateCC1)+"&date2="+this.transformDate(this.dateCC2)).subscribe(
      data => {
        CPrint("THIS IS THE CC LIST: ",data);
        this.ListReportCC = data;
        //ORGANIZO TODO PARA UNA ESTRUCTURA DE DATOS PARA LA TABLA NUEVA, SE MANTIENE LA DATA RAW PARA OPERACIONES
        this.GenerateNewTableFromRawData_Caja();
      }
    )
  }

  GetKeysFromNewData_Caja(){
    return Object.keys(this.DictTablaConsecutivos_caja).sort().reverse();
  }

  GenerateNewTableFromRawData_Caja(){
    this.EstadoBusqueda_Caja = 2;
    this.DictTablaConsecutivos_caja = {};
    //
    for(let n = 0;n<this.ListReportCC.length;n++){
      let Consecutivo = this.ListReportCC[n].consecutive;
      if(this.DictTablaConsecutivos_caja[Consecutivo] == null){//Primer registro
        this.DictTablaConsecutivos_caja[Consecutivo] = {
          FOpen:this.ListReportCC[n].starting_DATE,
          FClose:this.ListReportCC[n].closing_DATE,
          Cajero:this.ListReportCC[n].fullname,
          balance:this.ListReportCC[n].balance,
          caja_NUMBER:this.ListReportCC[n].caja_NUMBER,
          notes:this.ListReportCC[n].notes,
          DataSource: null,
          RawData: []
        };
      }
      this.DictTablaConsecutivos_caja[Consecutivo].RawData.push(this.ListReportCC[n]);
    }
    //
    this.GetKeysFromNewData_Caja().forEach(llave => {
      let Data = new MatTableDataSourceWithCustomSort(this.DictTablaConsecutivos_caja[llave].RawData);
      this.DictTablaConsecutivos_caja[llave].DataSource = Data;
    });
  }

  enter(element){
    CPrint("ENTRE", element );
      const dialogRef = this.dialog.open(BillsWithProductComponent, {
        width: '60vw',
        height: '80vh',
        data: { element: element, id_store: this.locStorage.getIdStore(), date1: this.dateP1, date2: this.dateP2}
      });

  }

  openKardex(elem){

    const dialogRef = this.dialog.open(KardexComponent, {
      width: '120vw',
      height: '80vh',
      data: { element: elem, origin: false,  date1: this.dateP1, date2: this.dateP2  }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.response){
      }else{
      }
    });

  }
  // getRepProdList(){
  //   this.ListReportProd = [];
  //   this.EstadoBusqueda_Productos = 1;
  //   CPrint(Urlbase.tienda+"/resource/reportproduct?id_third="+this.locStorage.getThird().id_third+"&id_store="+this.SelectedStoreProd+"&date1="+this.transformDate(this.dateP1)+"&date2="+this.transformDate(this.dateP2));
  //   this.http2.get(Urlbase.tienda+"/resource/reportproduct?id_third="+this.locStorage.getThird().id_third+"&id_store="+this.SelectedStoreProd+"&date1="+this.transformDate(this.dateP1)+"&date2="+this.transformDate(this.dateP2)).subscribe(
  //     data => {
  //       CPrint("THIS I WILL USE HEE HEE: ",data);
  //       //@ts-ignore
  //       this.ListReportProd = data;
  //       this.EstadoBusqueda_Productos = 2;
  //       this.DataSourceProductos = new MatTableDataSourceWithCustomSort(this.ListReportProd);
  //       this.DataSourceProductos.sort = this.SorterTablaProductos;
  //     }
  //   )
  // }

  SelectedLine2=-1;
  SelectedSubCategory2=-1;
  SelectedBrand2=-1;


  FuncionFiltro2(data:{categoria: string,ownbarcode: string,product: string,linea: string, marca: string}, filterValue: string){
    let list = filterValue.split(" ");
    let response = true;
    for(let i = 0; i<list.length;i++){
      let element = list[i];
      if(data.categoria.toLowerCase().includes(element.toLowerCase()) || data.ownbarcode.toLowerCase().includes(element.toLowerCase()) || data.product.toLowerCase().includes(element.toLowerCase()) || data.linea.toLowerCase().includes(element.toLowerCase()) || data.marca.toLowerCase().includes(element.toLowerCase())){

       } else{
        response = false;
        break;
       }
    }
    return response;
  }

  SortByFilter(){
    this.DataSourceProductos.filterPredicate = this.FuncionFiltro2;
    if(this.filterBox == null) { this.DataSourceProductos.filter = "0"; }
    else{this.DataSourceProductos.filter = this.filterBox;}
  }

  filterBox = "";

  getRepProdList(){
    if(this.SelectedBrand2!=-1){
       this.ListReportProd = [];
        this.DataSourceProductos = new MatTableDataSourceWithCustomSort(this.ListReportProd);
       this.EstadoBusqueda_Productos = 1;
       CPrint(Urlbase.tienda+"/resource/reportproduct/brand?id_brand="+this.SelectedBrand2+"&id_store="+this.locStorage.getIdStore()+"&date1="+this.transformDate(this.dateP1)+"&date2="+this.transformDate(this.dateP2));
       this.http2.get(Urlbase.tienda+"/resource/reportproduct/brand?id_brand="+this.SelectedBrand2+"&id_store="+this.locStorage.getIdStore()+"&date1="+this.transformDate(this.dateP1)+"&date2="+this.transformDate(this.dateP2)).subscribe(
         data => {
           CPrint("THIS I WILL USE HEE HEE: ",data);
           //@ts-ignore
           this.ListReportProd = data;
           this.EstadoBusqueda_Productos = 2;
           this.DataSourceProductos = new MatTableDataSourceWithCustomSort(this.ListReportProd);
           this.DataSourceProductos.sort = this.SorterTablaProductos;
         }
       )
    }else{
      if(this.SelectedSubCategory2!=-1){
        this.ListReportProd = [];
       this.EstadoBusqueda_Productos = 1;
       CPrint(Urlbase.tienda+"/resource/reportproduct/cat?id_cat="+this.SelectedSubCategory2+"&id_store="+this.locStorage.getIdStore()+"&date1="+this.transformDate(this.dateP1)+"&date2="+this.transformDate(this.dateP2));
       this.http2.get(Urlbase.tienda+"/resource/reportproduct/cat?id_cat="+this.SelectedSubCategory2+"&id_store="+this.locStorage.getIdStore()+"&date1="+this.transformDate(this.dateP1)+"&date2="+this.transformDate(this.dateP2)).subscribe(
         data => {
           CPrint("THIS I WILL USE HEE HEE: ",data);
           //@ts-ignore
           this.ListReportProd = data;
           this.EstadoBusqueda_Productos = 2;
           this.DataSourceProductos = new MatTableDataSourceWithCustomSort(this.ListReportProd);
           this.DataSourceProductos.sort = this.SorterTablaProductos;
         }
       )
      }else{
        if(this.SelectedLine2!=-1){
          this.ListReportProd = [];
          this.EstadoBusqueda_Productos = 1;
          CPrint(Urlbase.tienda+"/resource/reportproduct/line?id_cat="+this.SelectedLine2+"&id_store="+this.locStorage.getIdStore()+"&date1="+this.transformDate(this.dateP1)+"&date2="+this.transformDate(this.dateP2));
          this.http2.get(Urlbase.tienda+"/resource/reportproduct/line?id_cat="+this.SelectedLine2+"&id_store="+this.locStorage.getIdStore()+"&date1="+this.transformDate(this.dateP1)+"&date2="+this.transformDate(this.dateP2)).subscribe(
            data => {
              CPrint("THIS I WILL USE HEE HEE: ",data);
              //@ts-ignore
              this.ListReportProd = data;
              this.EstadoBusqueda_Productos = 2;
              this.DataSourceProductos = new MatTableDataSourceWithCustomSort(this.ListReportProd);
              this.DataSourceProductos.sort = this.SorterTablaProductos;
            }
          )

        }else{
          this.ListReportProd = [];
          this.EstadoBusqueda_Productos = 1;
          CPrint(Urlbase.tienda+"/resource/reportproduct?id_third="+this.locStorage.getThird().id_third+"&id_store="+this.locStorage.getIdStore()+"&date1="+this.transformDate(this.dateP1)+"&date2="+this.transformDate(this.dateP2));
          this.http2.get(Urlbase.tienda+"/resource/reportproduct?id_third="+this.locStorage.getThird().id_third+"&id_store="+this.locStorage.getIdStore()+"&date1="+this.transformDate(this.dateP1)+"&date2="+this.transformDate(this.dateP2)).subscribe(
            data => {
              CPrint("THIS I WILL USE HEE HEE: ",data);
              //@ts-ignore
              this.ListReportProd = data;
              this.EstadoBusqueda_Productos = 2;
              this.DataSourceProductos = new MatTableDataSourceWithCustomSort(this.ListReportProd);
              this.DataSourceProductos.sort = this.SorterTablaProductos;
            }
          )

        }
      }
    }


  }

  getBrands(){
    this.http2.get(Urlbase.tienda + "/resource/brands").subscribe(data => {
      this.Brands = data })

  }

  getRepCatList(){
    this.EstadoBusqueda_Categorias = 1;
    CPrint(Urlbase.tienda+"/resource/reportcategory?id_third="+this.locStorage.getThird().id_third+"&id_store="+this.locStorage.getIdStore()+"&date1="+this.transformDate(this.dateC1)+"&date2="+this.transformDate(this.dateC2));
    this.http2.get(Urlbase.tienda+"/resource/reportcategory?id_third="+this.locStorage.getThird().id_third+"&id_store="+this.locStorage.getIdStore()+"&date1="+this.transformDate(this.dateC1)+"&date2="+this.transformDate(this.dateC2)).subscribe(
      data => {
        this.EstadoBusqueda_Categorias = 2;
        // @ts-ignore
        this.ListReportCat = data;
        this.DataSourceCategorias = new MatTableDataSourceWithCustomSort(this.ListReportCat);
        this.DataSourceCategorias.sort = this.SorterTablaCategorias;
      }
    )
  }

  generateReport(){
    this.EstadoBusqueda_Reportes = 1;
    if(this.BarChart != null){
      //@ts-ignore
      this.BarChart.destroy();
      this.BarChart = null;
    }
    if(this.SelectedLine == -1) {
      CPrint("Is all");
      this.getChartData3()
    }else{
      if(this.SelectedSubCategory == -1 && this.SelectedLine != -1) {
        CPrint("Is a Line");
        this.getChartData(0)
      }else{
        if(this.SelectedSubCategory != -1 && this.SelectedProduct == -1 && this.SelectedLine != -1){
          CPrint("Is a SubCategory");
          this.getChartData(1)
        }else {
          if(this.SelectedSubCategory !=-1 && this.SelectedLine !=-1 && this.SelectedProduct!= -1){
            CPrint("Is a Product");
            this.getChartData4();
          }
        }
      }
    }
  }

  getChartData4(){
    CPrint(Urlbase.tienda+"/resource/byproduct?id_bill_type="+this.tipoFactura+"&id_product_store="+this.SelectedProduct+"&id_period="+this.tipoIntervalo+"&date1="+this.transformDate(this.date1)+"&date2="+this.transformDate(this.date2));
    this.http2.get(Urlbase.tienda+"/resource/byproduct?id_bill_type="+this.tipoFactura+"&id_product_store="+this.SelectedProduct+"&id_period="+this.tipoIntervalo+"&date1="+this.transformDate(this.date1)+"&date2="+this.transformDate(this.date2)+"&id_store="+[this.locStorage.getIdStore()]).subscribe(data => {
      this.EstadoBusqueda_Reportes = 2;
      if(this.BarChart == null){
      }else{
        //@ts-ignore
        this.BarChart.destroy();
      }

      this.loadData(data).then(a => {
        this.loadChart3().then(a =>{
          this.datosReport = [];
          this.Labels = [];
          this.colorLabels = [];}
        );
      })

    });
  }

  getSecondLvlCategory(){
    if(this.SelectedLine != -1){
      this.http2.get(Urlbase.tienda+"/categories2/children?id_category_father="+this.SelectedLine).subscribe(data => { this.SubCategoryList = data })
    }
  }

  getFirstLvlCategory(){
    this.categoriesService.getGeneralCategories().subscribe(data => { this.CategoryFirstLvlList = data })
  }

  getProductList(){
    this.http2.get(Urlbase.tienda+"/categories2/productStore?id_ps="+this.SelectedSubCategory+"&id_store="+this.locStorage.getIdStore()).subscribe(data => { this.ProductList = data })
  }

  async loadData(data){
    data.forEach(element => {
      this.Labels.push(element.label);
      this.datosReport.push(element.total);
      this.colorLabels.push('rgba(132, 255, 132, 0.6)')
    });
    if(this.tipoFactura == 1){
      this.chartLabel = "Venta"
    }else{
      this.chartLabel = "Compra"
    }

  }

  getChartData(iscat){
    let storeList = [];
    storeList.push(this.locStorage.getIdStore());
    if(iscat == 0){

      CPrint(Urlbase.tienda+"/resource/bycategory?id_third="+this.locStorage.getThird().id_third+"&id_bill_type="+this.tipoFactura+"&id_category="+this.SelectedLine+"&id_period="+this.tipoIntervalo+"&date1="+this.transformDate(this.date1)+"&date2="+this.transformDate(this.date2)+"&id_store="+storeList);
      this.http2.post(Urlbase.tienda+"/resource/byline?id_third="+this.locStorage.getThird().id_third+"&id_bill_type="+this.tipoFactura+"&id_category="+this.SelectedLine+"&id_period="+this.tipoIntervalo+"&date1="+this.transformDate(this.date1)+"&date2="+this.transformDate(this.date2)+"&id_store="+storeList,{}).subscribe(data => {
        this.EstadoBusqueda_Reportes = 2;
        if(this.BarChart == null){
        }else{
          //@ts-ignore
          this.BarChart.destroy();
        }

        this.loadData(data).then(a => {
          this.loadChart3().then(a =>{
            this.datosReport = [];
            this.Labels = [];
            this.colorLabels = [];}
          );
        })

      });}
    if(iscat == 1){
      CPrint(Urlbase.tienda+"/resource/bycategory?id_bill_type="+this.tipoFactura+"&id_category="+this.SelectedSubCategory+"&id_period="+this.tipoIntervalo+"&date1="+this.transformDate(this.date1)+"&date2="+this.transformDate(this.date2)+"&id_third="+this.locStorage.getThird().id_third);
      this.http2.post(Urlbase.tienda+"/resource/bycategory?id_bill_type="+this.tipoFactura+"&id_category="+this.SelectedSubCategory+"&id_period="+this.tipoIntervalo+"&date1="+this.transformDate(this.date1)+"&date2="+this.transformDate(this.date2)+"&id_third="+this.locStorage.getThird().id_third+"&id_store="+storeList,{}).subscribe(data => {
        this.EstadoBusqueda_Reportes = 2;
        if(this.BarChart == null){
        }else{
          //@ts-ignore
          this.BarChart.destroy();
        }

        this.loadData(data).then(a => {
          this.loadChart3().then(a =>{
            this.datosReport = [];
            this.Labels = [];
            this.colorLabels = [];}
          );
        })

      });}
  }

  getChartData3(){
    CPrint(Urlbase.tienda+"/resource?id_store="+[this.locStorage.getIdStore()]+"&id_bill_type="+this.tipoFactura+"&id_period="+this.tipoIntervalo+"&date1="+this.transformDate(this.date1)+"&date2="+this.transformDate(this.date2)+"&id_third="+this.locStorage.getThird().id_third);
    this.http2.get(Urlbase.tienda+"/resource?id_store="+[this.locStorage.getIdStore()]+"&id_bill_type="+this.tipoFactura+"&id_period="+this.tipoIntervalo+"&date1="+this.transformDate(this.date1)+"&date2="+this.transformDate(this.date2)+"&id_third="+this.locStorage.getThird().id_third).subscribe(data => {
      this.EstadoBusqueda_Reportes = 2;
      if(this.BarChart == null){
      }else{
        //@ts-ignore
        this.BarChart.destroy();
      }

      this.loadData3(data).then(a => {
        this.loadChart3().then(a =>{
          this.datosReport = [];
          this.Labels = [];
          this.colorLabels = [];}
        );
      })

    });
  }

  async loadData3(data){
    data.forEach(element => {
      this.Labels.push(element.labelDate + "/" + element.counter);
      this.datosReport.push(element.total);
      this.colorLabels.push('rgba(132, 255, 132, 0.6)')
    });
    if(this.tipoFactura == 1){
      this.chartLabel = "Venta"
    }else{
      this.chartLabel = "Compra"
    }
  }

  transformDate(date){
    return this.datePipe.transform(date, 'yyyy/MM/dd');
  }

  async loadChart3(){
    // Bar chart:
    this.BarChart = new Chart('barChart', {
      type: 'bar',
      data: {
        labels: this.Labels,
        datasets: [{
          label: this.chartLabel,
          data: this.datosReport,
          backgroundColor: this.colorLabels,
          borderColor: this.colorLabels,
          borderWidth: 1
        }]
      },
      options: {
        title:{
          text: this.chartLabel,
          display:true
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero:true
            }
          }]
        }
      }
    });
  }

  async loadChart(){
    CPrint("this is datos",this.datos);
    this.LineChart = new Chart('lineChart', {
      type: 'line',
      data: {
        labels: ["Subtotal", "Tax", "Total"],
        datasets: [{
          label: 'Ventas',
          data: this.datos,
          fill:false,
          lineTension:0.2,
          borderColor:"Green",
          borderWidth: 2
        }]
      },
      options: {
        title:{
          text:"Ventas",
          display:true
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero:true
            }
          }]
        }
      }
    });


    // Bar chart:
    this.BarChart = new Chart('barChart', {
      type: 'bar',
      data: {
        labels: ["Subtotal", "Tax", "Total"],
        datasets: [{
          label: 'Ventas',
          data: this.datos,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        title:{
          text:"Ventas",
          display:true
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero:true
            }
          }]
        }
      }
    });




    // pie chart:
    this.PieChart = new Chart('pieChart', {
      type: 'pie',
      data: {
        labels: ["Subtotal", "Tax", "Total"],
        datasets: [{
          label: 'Ventas',
          data: this.datos,
          backgroundColor: [
            'rgba(255, 99, 132, 0.2)',
            'rgba(54, 162, 235, 0.2)',
            'rgba(255, 206, 86, 0.2)'
          ],
          borderColor: [
            'rgba(255,99,132,1)',
            'rgba(54, 162, 235, 1)',
            'rgba(255, 206, 86, 1)'
          ],
          borderWidth: 1
        }]
      },
      options: {
        title:{
          text:"Ventas",
          display:true
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero:true
            }
          }]
        }
      }
    });



  }

  getStores() {
    this.categoriesService.getStoresByThird(this.locStorage.getToken().id_third).subscribe(data => {
      CPrint("This is data; ",data);
      this.Stores = data;})
  }

  pendings;
  ListToPost=[];
  getPendientes() {
    this.ListToPost=[];
    if(this.SelectedStore4item=="-1"){
      this.getPends2().then(response => {this.sendPost()});
    }else{
      this.ListToPost.push(this.SelectedStore4item);
      this.sendPost();
    }

  }

  async getPends2(){
      this.ClientStores.forEach(store => {
        this.ListToPost.push(store.id_STORE);
      })
  }

  sendPost(){
    this.http2.get(Urlbase.tienda + "/resource/pendingReport?id_store="+this.locStorage.getIdStore()+"&id_storec="+this.ListToPost).subscribe(data => {
      this.pendings = data
      console.log(Urlbase.tienda + "/resource/pendingReport?id_store="+this.locStorage.getIdStore()+"&id_storec="+this.ListToPost)
      console.log(JSON.stringify(this.pendings))
    })
  }

  getPendExcel(){
    this.http2.post(Urlbase.tienda + "/resource/pendientes/excel",this.pendings,{ responseType: 'text'}).subscribe(response => {
      CPrint(response);
      window.open(Urlbase.root+"reportes/"+response);
    })
  }

  getChartData2(){
    this.EstadoBusqueda_GPProductos = 1;
    if(this.LineChartTotal != null){
      //@ts-ignore
      this.LineChartTotal.destroy();
      this.LineChartTotal = null;
    }
    CPrint("THIS IS URL: ",Urlbase.tienda+"/resource/product?id_bill_type=1&date1="+this.transformDate(this.date3)+"&date2="+this.transformDate(this.date4)+"&id_store="+this.locStorage.getIdStore());
    this.http2.get(Urlbase.tienda+"/resource/product?id_bill_type=1&date1="+this.transformDate(this.date3)+"&date2="+this.transformDate(this.date4)+"&id_store="+this.locStorage.getIdStore()).subscribe(data => {
      CPrint(data);
      this.loadData2(data).then(a => {
        CPrint("this is labels", this.Labels2);
        CPrint("this is subtotal", this.datosSubtotal);
        CPrint("this is total", this.datosTotal);
        CPrint("this is tax", this.datosTax);
        this.loadChart2().then(a =>{
          this.datos = null;
          this.Labels2 = [];
          this.datosSubtotal = [];
          this.datosTax = [];
          this.datosTotal = [];}
        );
      })

    });
  }

  async loadData2(data){
    data.forEach(elem =>{
      this.Labels2.push(elem.field);
      this.datosSubtotal.push(elem.subtotal);
      this.datosTotal.push(elem.total);
      this.datosTax.push(elem.tax);
    });
  }

  async loadChart2(){
    this.EstadoBusqueda_GPProductos = 2;
    this.LineChartTotal = new Chart('lineChartTotal', {
      type: 'line',
      data: {
        labels: this.Labels2,
        datasets: [{
          label: 'Total',
          data: this.datosTotal,
          fill:false,
          lineTension:0.2,
          borderColor:"Green",
          borderWidth: 2
        },
          {
            label: 'Subtotal',
            data: this.datosSubtotal,
            fill:false,
            lineTension:0.2,
            borderColor:"Blue",
            borderWidth: 2
          },
          {
            label: 'Tax',
            data: this.datosTax,
            fill:false,
            lineTension:0.2,
            borderColor:"Red",
            borderWidth: 2
          }]
      },
      options: {
        title:{
          text:"Ventas",
          display:true
        },
        scales: {
          yAxes: [{
            ticks: {
              beginAtZero:true
            }
          }]
        }
      }
    });
  }

  excelPersona(){
    CPrint("THIS IS ROWS: ",this.dataTablaThirds);
    this.http2.post(Urlbase.tienda+"/resource/personas/Excel",this.dataTablaThirds,{ responseType: 'text'}).subscribe(response => {
      CPrint(response);
      window.open(Urlbase.root+"reportes/"+response);
    })
  }

  genReport() {
    this.EstadoBusqueda_Terceros = 1;
    CPrint("this is url", Urlbase.tercero+"/thirds/listThird?id_third="+this.locStorage.getThird().id_third+"&date1="+this.transformDate(this.ThirdsDate1)+"&date2="+this.transformDate(this.ThirdsDate2)+"&bill_type="+this.tipoFactura2);
    this.httpClient.get<any[]>(Urlbase.tercero+"/thirds/listThird?id_third="+this.locStorage.getThird().id_third+"&date1="+this.transformDate(this.ThirdsDate1)+"&date2="+this.transformDate(this.ThirdsDate2)+"&bill_type="+this.tipoFactura2,{ headers: this.headers }).subscribe(elem =>{
      this.dataTablaThirds = elem;
      this.DataSourceTerceros = new MatTableDataSourceWithCustomSort(this.dataTablaThirds);
      this.DataSourceTerceros.sortingDataAccessor = (item, property) => {
        switch(property) {
          case 'document_TYPE': return item['document_TYPE']+'-'+item['document_NUMBER'];
          default: return item[property];
        }
      };
      this.DataSourceTerceros.sort = this.SorterTablaTerceros;
      this.EstadoBusqueda_Terceros = 2;
      CPrint("ELEMENTO: "+elem);
    })

  }

  clearBrands(){
    this.SelectedBrand2=-1
  }

  excelProductos(){
    CPrint("THIS IS ROWS: ",this.ListReportProd);
    this.http2.post(Urlbase.tienda+"/resource/productos/Excel",this.ListReportProd,{ responseType: 'text'}).subscribe(response => {
      CPrint(response);
      window.open(Urlbase.root+"reportes/"+response);
    })
  }

  clearDataSource(){
    this.ListReportBill=[];
    this.DataSourceFacturacion = new MatTableDataSourceWithCustomSort(this.ListReportBill);
    this.DataSourceFacturacion.sortingDataAccessor = (item, property) => {
      switch(property) {
        case 'fullname': return item['fullname']+'-'+item['num_DOCUMENTO'];
        default: return item[property];
      }
    };
    this.DataSourceFacturacion.sort = this.SorterTablaFacturacion;
  }

  excelCategorias(){
    CPrint("THIS IS ROWS: ",this.ListReportCat);
    this.http2.post(Urlbase.tienda+"/resource/categorias/Excel",this.ListReportCat,{ responseType: 'text'}).subscribe(response => {
      CPrint(response);
      window.open(Urlbase.root+"reportes/"+response);
    })
  }

  excelFacturas(){
    CPrint("THIS IS ROWS: ",this.ListReportBill);
    this.http2.post(Urlbase.tienda+"/resource/facturas/Excel?tipofactura="+this.tipoFactura2,this.ListReportBill,{ responseType: 'text'}).subscribe(response => {
      CPrint(response);
      window.open(Urlbase.root+"reportes/"+response);
    })
  }

  excelCaja(){
    CPrint("THIS IS ROWS: ",this.ListReportCC);
    this.http2.post(Urlbase.tienda+"/resource/cajas/Excel",this.ListReportCC,{ responseType: 'text'}).subscribe(response => {
      CPrint(response);
      window.open(Urlbase.root+"reportes/"+response);
    })
  }
}
