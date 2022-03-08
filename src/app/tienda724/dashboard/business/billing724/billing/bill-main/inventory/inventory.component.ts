import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import {BillingService} from '../../../../../../../services/billing.service';
import {MatDialog, MatPaginator, MatSort, MatTabChangeEvent} from '@angular/material';
import {ProductsOnCategoryComponent} from '../products-on-category/products-on-category.component';
import {ProductsOnStoreComponent} from '../products-on-store/products-on-store.component';
import {NoDispCompComponent} from './../no-disp-comp/no-disp-comp.component';
import {LocalStorage} from '../../../../../../../services/localStorage';
import {ThirdService} from '../../../../../../../services/third.service';
import {HttpClient} from '@angular/common/http';
import {Urlbase} from '../../../../../../../shared/urls';
import {Router} from '@angular/router';
import {MatTableDataSourceWithCustomSort} from '../pedidos/pedidos.component';
import { KardexComponent } from '../kardex/kardex.component';

@Component({
  selector: 'app-inventarios-tienda',
  templateUrl: './inventory.component.html',
  styleUrls: ['./inventory.component.scss']
})
export class InventoryComponent implements OnInit {
  //--------------
  CantidadA = 0;
  CantidadV = 0;
  rotacion = 0;
  Cantidad = 0;
  Costo = 0;
  CostoTotal = 0;
  PCT = 0;
  size = 1;
  days = 1;
  dataTable = [];
  dataTable2 = [];
  storesToSend = [];
  linesToSend = [];
  categoriesToSend = [];
  brandsToSend = [];
  Stores;
  CategoryFirstLvlList;
  SelectedLine =-1;
  SelectedSubCategory = -1;
  SubCategoryList;
  Brands;
  SelectedBrand = -1;
  list = [];
  //--------------
  productList;
  generalCategories;
  subcategories;
  modal1 = true;
  modal2 = false;
  modal3 = false;
  filterNumber=1;
  filterBox="";
  id_employee;
  subCategoryTitle;
  categories;
  products;
  allCategories;
  allProducts;
  myProducts;
  stores;
  currentStore;
  currentStorage;
  idThirdFather;
  currentStorages;
  productsOnCategory;
  categoryStack = [];
  selectedTab = 0;
  currentCategory;
  @ViewChild('nameit') private elementRef: ElementRef;
  ///////
  //
  //Todo Tabla Reporte Inventario
  DictColumnas_Reporte_Inventario = {};
  GetKeysReporteInventario(){
    this.DictColumnas_Reporte_Inventario = {};
    this.DictColumnas_Reporte_Inventario["producto"] = ["Producto",0];
    this.DictColumnas_Reporte_Inventario["barcode"] = ["Codigo de Barras",0];
    this.DictColumnas_Reporte_Inventario["codigotienda"] = ["Codigo Rapido",0];
    this.DictColumnas_Reporte_Inventario["linea"] = ["Linea",0];
    this.DictColumnas_Reporte_Inventario["categoria"] = ["Categoria",0];
    this.DictColumnas_Reporte_Inventario["fabricante"] = ["Fabricante",0];
    this.DictColumnas_Reporte_Inventario["marca"] = ["Marca",0];
    this.DictColumnas_Reporte_Inventario["cantidad"] = ["Cantidad",0];
    this.DictColumnas_Reporte_Inventario["iva"] = ["IVA%",0];
    this.DictColumnas_Reporte_Inventario["precio"] = ["Precio",1];
    this.DictColumnas_Reporte_Inventario["costo"] = ["Costo",1];
    this.DictColumnas_Reporte_Inventario["costototal"] = ["Costo Total",1];
    this.DictColumnas_Reporte_Inventario["pct_INVENTARIO"] = ["PCT",0];
    this.DictColumnas_Reporte_Inventario["nodisp"] = ["No disponibles",0];
    return Object.keys(this.DictColumnas_Reporte_Inventario);
  }
  EstadoBusqueda_Reporte_Inventario = -1;
  DataSourceReporte_Inventario = new MatTableDataSourceWithCustomSort();
  //@ViewChild('pickerP2') SelectorFechaFinal_Productos: MatDatepicker<Date>;
  @ViewChild('SorterTablaReporte_Inventario') SorterTablaProductos: MatSort;
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  //
  CampoSorteando = ["",""];
  Invertido = [false,false];

  openKardex(elem){

    const dialogRef = this.dialog.open(KardexComponent, {
      width: '120vw',
      height: '80vh',
      data: { element: elem, origin: true }
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.response){
      }else{
      }
    });

  }

  setCero(){
    this.http2.post(Urlbase.tienda + "/inventories/ponerNegativosEnCero?idstore="+this.locStorage.getIdStore(),{}).subscribe(data => {

    })
  }

  SortByInventary(){
    this.DataSourceReporte_Inventario.filterPredicate = this.FuncionFiltro;
    if(this.filterNumber == null) { this.DataSourceReporte_Inventario.filter = "0"; }
    else{this.DataSourceReporte_Inventario.filter = this.filterNumber+"";}
  }


  SortByFilter(){
    this.DataSourceReporte_Inventario.filterPredicate = this.FuncionFiltro2;
    if(this.filterBox == null) { this.DataSourceReporte_Inventario.filter = "0"; }
    else{this.DataSourceReporte_Inventario.filter = this.filterBox;}
  }

  SortearPorPropiedadMetodo(propiedad,invertido) {
    return function(n1, n2) {
      let Terminado = false;
      let i = 0;
      let TempN1 = n1[propiedad];
      let TempN2 = n2[propiedad];
      TempN1 = TempN1 + "";
      TempN2 = TempN2 + "";
      let Arreglo1 = [];
      let Arreglo2 = [];
      try {
        Arreglo1 = TempN1.trim().split(/[ ,.]+/);
        Arreglo2 = TempN2.trim().split(/[ ,.]+/)
      }
      catch(error) {
        console.error(error);
      }
      let retorno = -1;
      while(!Terminado){
        if(Arreglo1.length <= i){
          Terminado = true;
          retorno = -1;
          break;
        }
        if(Arreglo2.length <= i){
          Terminado = true;
          retorno = 1;
          break;
        }
        let Parte1 = Arreglo1[i];
        let Parte2 = Arreglo2[i];
        let A = parseInt(Parte1);
        let B = parseInt(Parte2);
        if(isNaN(A)){ A = Parte1;}
        if(isNaN(B)){ B = Parte2;}
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
      return invertido ? -retorno:retorno;
    };
  }

  SortBy(campo,caso){
    if(this.CampoSorteando[caso] != campo){
      this.CampoSorteando[caso] = campo;
    }
    else{
      this.Invertido[caso] = !this.Invertido[caso];
    }
    //Genero copia del listado
    let ListaCopia = [];
    if(caso == 0){//Productos
      ListaCopia = [...this.dataTable];
    }else if(caso == 1){//Categorias
      ListaCopia = [...this.dataTable2];
    }
    //Lo sorteo
    const ListaCopiaSorteada: string[][] = ListaCopia.sort(this.SortearPorPropiedadMetodo(campo, this.Invertido[caso]));
    if(caso == 0){//Productos
      this.dataTable = ListaCopiaSorteada;
    }else if(caso == 1){//Categorias
      this.dataTable2 = ListaCopiaSorteada;
    }
  }

  constructor(public router: Router,private http2: HttpClient,private categoriesService: BillingService,public dialog: MatDialog, private storeService: BillingService, private locStorage: LocalStorage, private thirdService: ThirdService) { }


  cancel(){

  }


  getFirstLvlCategory(){
    this.categoriesService.getGeneralCategories().subscribe(data => {
      this.CategoryFirstLvlList = data;
      this.SelectedSubCategory=-1
    })
  }

  getSonCat(){

    this.http2.post(Urlbase.tienda + "/resource/getsons",{listStore:this.locStorage.getTipo()}).subscribe(data => {
      CPrint("this is type:",this.locStorage.getTipo());
      CPrint("THIS IS SONS:",data);
      //@ts-ignore
      this.list = data })

  }

  getSecondLvlCategory(){

    if(this.SelectedLine != -1){
      this.http2.get(Urlbase.tienda + "/categories2/children?id_category_father="+this.SelectedLine).subscribe(data => {
        this.SelectedSubCategory = -1;
        this.SubCategoryList = data })
    }
  }



  getBrands(){
    this.http2.get(Urlbase.tienda + "/resource/brands").subscribe(data => {
      this.Brands = data })

  }

  getStores() {
    this.categoriesService.getStoresByThird(this.locStorage.getToken().id_third).subscribe(data => {
      CPrint(data);this.Stores = data })
  }


  getNoDisponibles(code){
    this.http2.get(Urlbase.tienda + "/resource/nodisponibles?idbill=-4001&idstore="+this.locStorage.getIdStore()+"&code="+code).subscribe(
        response => {
          return response;
        }
    )
  }



  id_menu=150;

  ngOnInit() {

    //PROTECCION URL INICIA
    CPrint(JSON.stringify(this.locStorage.getMenu()));
    const elem = this.locStorage.getMenu().find(item => item.id_menu == this.id_menu);

    if(!elem){
      // noinspection JSIgnoredPromiseFromCall
      this.router.navigateByUrl("/dashboard/business/movement/nopermision");
    }
    //PROTECCION URL TERMINA



    //-----------------------------------------------
    this.getSonCat();
    this.getBrands();
    this.getFirstLvlCategory();
    this.getStores();
    //-----------------------------------------------
    this.currentCategory = null;
    this.categoryStack = [];
    this.productsOnCategory = [];

    this.idThirdFather = this.locStorage.getThird().id_third;
    this.storeService.getGeneralCategories().subscribe(res=>{
      this.generalCategories = res;
      CPrint(this.generalCategories,"theressssssss");
    });

        this.idThirdFather = this.locStorage.getToken().id_third_father;
        this.storeService.getStoresByThird(this.idThirdFather).subscribe(res=>{
          this.stores = res;
          CPrint(this.stores)
        })


    this.currentStorage = [];
  }

  tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
    CPrint('tabChangeEvent => ', tabChangeEvent);
    CPrint('index => ', tabChangeEvent.index);
    this.selectedTab = tabChangeEvent.index;
    this.currentCategory = null;
    this.categoryStack = [];
    this.productsOnCategory = [];

        this.idThirdFather = this.locStorage.getToken().id_third_father;
        this.storeService.getStoresByThird(this.idThirdFather).subscribe(res=>{
          this.stores = res;
          CPrint(this.stores)
        });
        this.storeService.getGeneralCategories().subscribe(res=>{
          this.generalCategories = res;
        })

    this.currentStorage = [];
  };

  gotoModal3(){
    this.modal1 = false;
    this.modal2 = false;
    this.modal3 = true;
  }

  gotoModal2(){
    this.modal1 = false;
    this.modal2 = true;
    this.modal3 = false;
  }
  gotoModal1(){
    this.modal2 = false;
    this.modal1 = true;
    this.modal3 = false;
  }
  async getIdEmployee(){
    this.id_employee = this.locStorage.getPerson().id_person;

  }

  async popCategory(){
    this.categoryStack.pop();
  }

  gotoFatherCategory(){
    this.popCategory().then(res=>{
      CPrint(this.categoryStack,"categorystact");
      CPrint(this.categoryStack.length);

      if(this.categoryStack.length > 0){
        CPrint(this.categoryStack[this.categoryStack.length - 1].id_CATEGORY);
        if(this.categoryStack[this.categoryStack.length - 1].name){
          this.currentCategory = this.categoryStack[this.categoryStack.length - 1].name;
        }else{
          this.currentCategory = this.categoryStack[this.categoryStack.length - 1].category;
        }
        this.storeService.getCategoryByThirdCategory(this.idThirdFather,this.categoryStack[this.categoryStack.length - 1].id_CATEGORY).subscribe(res=>{
          this.generalCategories = res;
          CPrint(res)
        })
      }else{
        this.currentCategory = null;
        (CPrint("is 0"));
        this.storeService.getGeneralCategories().subscribe(res=>{
          this.generalCategories = res;
          CPrint(res)
        })
      }
    })

  }

  loadStore(store){
    this.currentStore = store;
    this.storeService.getStoragesByStore(store.id_STORE).subscribe(res=>{
      let dialogRef;
      dialogRef = this.dialog.open(ProductsOnStoreComponent,{
        height: '450px',
        width: '600px',
        data: {
          currentStorages: res, storeName: store.store_NAME
        }
      })
    })
  }

  gotoProductsCategory(){
    this.storeService.getProductsByCategoryThird(this.categoryStack[this.categoryStack.length - 1].id_CATEGORY,this.idThirdFather).subscribe(res=>{
      let dialogRef;
      dialogRef = this.dialog.open(ProductsOnCategoryComponent,{
        height: '450px',
        width: '850px',
        data: {
          productsOnCategory: res, category: this.currentCategory
        }
      })
    })
  }

  loadCategory(category){
    this.categoryStack.push(category);
    if(category.name){
      this.currentCategory = category.name;
    }else{
      this.currentCategory = category.category;
    }
    CPrint(category.name);
    CPrint(category);
    this.storeService.getCategoryByThirdCategory(this.idThirdFather,category.id_CATEGORY).subscribe(res=>{
      this.generalCategories = res;
      CPrint(res,"categories")
    });
    this.storeService.getProductsByCategoryThird(category.id_CATEGORY,this.idThirdFather).subscribe(res=>{
      this.productsOnCategory = res;
      CPrint(res)
    })
  }

  // setBackButtonAction(){
  //   this.navBar.backButtonClick = () => {
  //   if(this.modal2 || this.modal3){
  //     this.gotoModal1()
  //     this.currentStorage = [];
  //   }else{
  //     this.navCtrl.pop();
  //   }
  //   }
  // }

  addProduct(product){
    this.myProducts.push(product);
    product.selected = true;
  }

  deleteProduct(product){
    const currentProduct = product;
    this.myProducts.splice(this.myProducts.indexOf(product),1);
    currentProduct.selected = true;
    this.allProducts[this.allProducts.indexOf(currentProduct)].selected = false;
  }

  addCategory(){
    this.myProducts = [];
    this.allProducts.forEach(item=>{
      item.selected = false;
    });
    this.gotoModal1();
  }

  // addByBarcode(){
  //   var alert = this.alertCtrl.create({title: "Escaneando código de barra",
  //   subTitle: "Escanea o ingresa un código de barras",
  //   buttons:["Cancelar"]});
  //   alert.present();
  // }

  showStorage(storage){
    this.storeService.getProductsByStorage(storage.id_storage).subscribe(res=>{
      CPrint(res);
      this.currentStorage = res;

    })

  }

  async generate2(){
    this.filterNumber=1;
    this.brandsToSend = [];
    if(this.SelectedBrand == -1){
      this.Brands.forEach(brand => {
        this.brandsToSend.push(brand.id_BRAND);
      })
    }else{
      this.brandsToSend.push(this.SelectedBrand);
    }

    this.storesToSend = [];
    // if(this.locStorage.getIdStore() == -1){
    //   this.Stores.forEach(store => {
    //     this.storesToSend.push(store.id_STORE);
    //   })
    // }else{
      this.storesToSend.push(Number(this.locStorage.getIdStore()));
    //}

    this.linesToSend = [];
    if(this.SelectedLine == -1){
      this.CategoryFirstLvlList.forEach(line => {
        this.linesToSend.push(line.id_CATEGORY);
      })
    }else{
      this.linesToSend.push(this.SelectedLine);
    }

    this.categoriesToSend = [];
    if(this.SelectedLine == -1){
      this.categoriesToSend = this.list;
    }else{
      if(this.SelectedSubCategory==-1){
        CPrint("This is the subcategory list: ", this.SubCategoryList);
        this.SubCategoryList.forEach(element2 => {
          this.categoriesToSend.push(element2.id_CATEGORY)
        });
      }else{
        this.categoriesToSend.push(this.SelectedSubCategory)
      }
    }
  }

  openDialog(code){
    const dialogRef = this.dialog.open(NoDispCompComponent, {
      width: '60vw',
      height: '80vh',
      data: { stores: this.storesToSend, code: code}
    })
  }

  sendPost(){
    this.Cantidad = 0;
    this.Costo = 0;
    this.CostoTotal = 0;
    this.PCT = 0;
    // CPrint("LISTADOS PA JUAN",JSON.stringify({listStore: this.storesToSend,
    //   listLine: this.linesToSend,
    //   listCategory: this.categoriesToSend,
    //   listBrand: this.brandsToSend}));
    this.http2.post(Urlbase.tienda + "/resource/inventory",{listStore: this.storesToSend,
      listLine: this.linesToSend,
      listCategory: this.categoriesToSend,
      listBrand: this.brandsToSend}).subscribe(response =>  {
        console.log("THIS IS response ",response);
      console.log("THIS IS INPUT, ",{listStore: this.storesToSend,
        listLine: this.linesToSend,
        listCategory: this.categoriesToSend,
        listBrand: this.brandsToSend});
      this.http2.post(Urlbase.tienda + "/resource/sumnodisponibles",{listStore: this.storesToSend}).subscribe(responses =>  {
        CPrint(responses);
        //@ts-ignore
        response.forEach(element => {
          let item = element;
          //@ts-ignore
          if(responses.find(items => items.ownbarcode == element.barcode)){
            //@ts-ignore
            item.nodisp=responses.find(items => items.ownbarcode == element.barcode).no_DISPONIBLE;
          }else{

            item.nodisp=0;
          }
          if(item.ownbarcode != "TEMPOMESA3BANDAS" && item.ownbarcode != "TEMPOMESAPOOL" && item.ownbarcode != "TEMPOMESALIBRES"){
            this.dataTable.push(item);
            this.Cantidad += element.cantidad;
            this.Costo += element.costo;
            this.CostoTotal += element.costototal;
            this.PCT += element.pct_INVENTARIO;
          }
        });
        this.EstadoBusqueda_Reporte_Inventario = 2;
        this.DataSourceReporte_Inventario = new MatTableDataSourceWithCustomSort(this.dataTable);
        this.DataSourceReporte_Inventario.paginator = this.paginator;
        this.DataSourceReporte_Inventario.sort = this.SorterTablaProductos;
        this.DataSourceReporte_Inventario.filterPredicate = this.FuncionFiltro;
        this.SortByInventary()

        //@ts-ignore
        this.size = response.lenght;


        CPrint(response)

      } )
      //@ts-ignore

    })
  }

  FuncionFiltro(data:{cantidad: number}, filterValue: string){
    return data.cantidad >= parseInt(filterValue);
  }

  FuncionFiltro2(data:{categoria: string,barcode: string,producto: string,linea: string, marca: string, fabricante: string}, filterValue: string){
    let list = filterValue.split(" ");
    let response = true;
    for(let i = 0; i<list.length;i++){
      let element = list[i];
      if(data.fabricante.toLowerCase().includes(element.toLowerCase()) || data.categoria.toLowerCase().includes(element.toLowerCase()) || data.barcode.toLowerCase().includes(element.toLowerCase()) || data.producto.toLowerCase().includes(element.toLowerCase()) || data.linea.toLowerCase().includes(element.toLowerCase()) || data.marca.toLowerCase().includes(element.toLowerCase())){

       } else{
        response = false;
        break;
       }
    }
    return response;
  }

  sendPost2(){

    this.CantidadA = 0;
    this.CantidadV = 0;
    this.rotacion = 0;
    CPrint(JSON.stringify({listStore: this.storesToSend,
      listLine: this.linesToSend,
      listCategory: this.categoriesToSend,
      listBrand: this.brandsToSend,
      days: this.days}));
    this.http2.post(Urlbase.tienda + "/resource/rotacion",{listStore: this.storesToSend,
      listLine: this.linesToSend,
      listCategory: this.categoriesToSend,
      listBrand: this.brandsToSend,
      days: this.days}).subscribe(response =>  {
      //@ts-ignore
      this.dataTable2 = response;
      CPrint(response);
      //@ts-ignore
      response.forEach(element => {
        this.CantidadA += element.cantidadactual;
        this.CantidadV += element.cantidadvendida;
        this.rotacion += element.dias_ROTACION;
      })

    })
  }

  roundRot(){
    return Math.round((this.rotacion/this.dataTable2.length) * 100) / 100
  }


  generate(){
    this.dataTable = [];
    this.EstadoBusqueda_Reporte_Inventario = 1;
    this.generate2().then(response => {this.sendPost()})
  }

  gen(){
    this.generate2().then(response => {this.sendPost2()})
  }

  excel(){
    CPrint("THIS IS ROWS: ",JSON.stringify(this.dataTable));
    CPrint("THIS IS ROWS: ",JSON.stringify(this.dataTable.filter(item => item.cantidad>=this.filterNumber )));
    this.http2.post(Urlbase.tienda + "/resource/inventory/Excel",this.dataTable.filter(item => item.cantidad>=this.filterNumber ),{ responseType: 'text'}).subscribe(response => {
      CPrint(response);
      window.open(Urlbase.root+"reportes/"+response);
    })
  }

  excelrot(){
    CPrint("THIS IS ROWS: ",JSON.stringify(this.dataTable2));
    this.http2.post(Urlbase.tienda + "/resource/rotacion/Excel",this.dataTable2,{ responseType: 'text'}).subscribe(response => {
      CPrint(response);
      window.open(Urlbase.root+"reportes/"+response);
    })
  }
}
