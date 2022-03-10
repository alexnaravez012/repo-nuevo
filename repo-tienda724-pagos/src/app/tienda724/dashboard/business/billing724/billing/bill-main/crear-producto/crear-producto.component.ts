import {Component, OnInit, ViewChild, ElementRef} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {LocalStorage} from 'src/app/services/localStorage';
import {Router} from '@angular/router';
import {Urlbase} from 'src/app/shared/urls';
import {BillingService} from '../../../../../../../services/billing.service';
import * as jQuery from 'jquery';
import 'bootstrap-notify';
import {MatDialog} from '@angular/material/dialog';
import {UpdateNewProductComponent} from '../update-new-product/update-new-product.component';
import {MatTableDataSourceWithCustomSort} from '../pedidos/pedidos.component';
import {MatPaginator, MatSort} from '@angular/material';
import { ThirdselectComponent } from '../../thirdselect/thirdselect.component';
import { GenerateThirdComponent2Component } from '../generate-third-component2/generate-third-component2.component';
import { ClientData } from '../../models/clientData';

let $: any = jQuery;

@Component({
  selector: 'app-crear-producto',
  templateUrl: './crear-producto.component.html',
  styleUrls: ['./crear-producto.component.scss']
})

export class CrearProductoComponent implements OnInit {
  tax=0;
  price = 0;
  cost = 0;
  Stores = [];
  prodname = "";
  barcode = "";
  quantity=0;
  id_menu = 262;
  products = [];
  measureUnitList;
    SelectedMun = -1;
    SelectedLine = -1;
    SelectedSubCategory = -1;
    SelectedBrand = -1;
    SubCategoryList;
    CategoryFirstLvlList;
    productName;
    brands;


  //COSAS PARA LA TABLA
  @ViewChild(MatPaginator, {static: true}) paginator: MatPaginator;
  @ViewChild(MatSort, {static: true}) sort: MatSort;
  @ViewChild('myInput') myInputVariable: ElementRef;
  dataSource = new MatTableDataSourceWithCustomSort(this.products);
  expandedElement: any | null;
  GetKeys(){
    return ["product_STORE_NAME","id_CODE","code"];
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();

    if (this.dataSource.paginator) {
      this.dataSource.paginator.firstPage();
    }
  }

  listTable;
  storeIva ="";
  constructor(private categoriesService: BillingService, public dialog: MatDialog, private billingService : BillingService,private http: HttpClient, public locStorage: LocalStorage,public router: Router,) { 
    this.headers = new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization':  this.locStorage.getTokenValue(),
    });
    this.clientData = new ClientData(true, 'Cliente Ocacional', '--', '000', 'N/A', '000', 'N/A', null);
  }

  ngOnInit() {
    this.getIva();
    this.listTable = this.GetKeys();
    this.getMeasureUnitList();
    this.getFirstLvlCategory();
    this.getBrands();

    //PROTECCION URL INICIA
    CPrint(JSON.stringify(this.locStorage.getMenu()));
    const elem = this.locStorage.getMenu().find(item => item.id_menu == this.id_menu);

    if(!elem){
      // noinspection JSIgnoredPromiseFromCall
      this.router.navigateByUrl("/dashboard/business/movement/nopermision");
    }
    //PROTECCION URL TERMINA


    this.billingService.getStoresByThird(this.locStorage.getToken().id_third).subscribe(data => {
      CPrint(data);
      this.Stores = data;
      let storeList = "";
      data.forEach(element => {
        //@ts-ignore
        storeList = storeList + element.id_STORE + ",";
        this.http.post(Urlbase.tienda+"/resource/getnewproducts?id_store="+storeList.substring(0,storeList.length-1),{}).subscribe(data => {
        // @ts-ignore
          this.products = data;
          this.dataSource = new MatTableDataSourceWithCustomSort(this.products);
          this.dataSource.paginator = this.paginator;
          this.dataSource.sort = this.sort;
      })
      });

    });
    this.tax=0

  }

  getIva(){
    this.http.get(Urlbase.tienda+"/resource/ivatienda?idstore="+this.locStorage.getIdStore(),{responseType: 'text'}).subscribe(response => {
      //@ts-ignore
      this.storeIva = response;
      console.log(response)
    })
  }

  
  fileBase64String = null;
  fileExtension = null;
  urlUploaded = "Sin Archivo";
  setFileImage(event) {
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
        console.log(reader.result);
        console.log("EXTENSION: ", event.target.files[0].name.split(".").pop());
        this.fileBase64String = reader.result;
        this.fileExtension = event.target.files[0].name.split(".").pop();
        this.urlUploaded = event.target.files[0].name;
    };
  }

  acept(){
    if(this.provCode==""){
      this.provCode = "-1";
    }
    if(this.cost!=0 && this.price!=0 && this.price>= this.cost && this.price>0 && this.cost>0 &&
      this.quantity>=0 && this.barcode!='' && this.prodname!=''){
        if(this.SelectedSubCategory!=-1 && this.SelectedMun != -1 && this.SelectedBrand != -1){

          this.http.post( Urlbase.tienda+"/products/v2?barcode="+this.barcode+"&idstore="+this.locStorage.getIdStore()+"&producto="+this.prodname.split("&").join("_")+"&costo="+this.cost+"&iva="+this.tax+"&precio="+this.price+"&cantidad="+this.quantity+"&mun="+this.SelectedMun+"&brand="+this.SelectedBrand+"&cate="+this.SelectedSubCategory+"&idprov="+this.id_person+"&codprov="+this.provCode+"&idtiendacliente="+this.SelectedStore,{}).subscribe(data=> {
            if(data==1){
              if(this.fileBase64String!=null){
                this.http.post(Urlbase.tienda+"/inventories/imageUpload",{file: this.fileBase64String, fileName: +this.barcode, format: this.fileExtension},{responseType:'text'}).subscribe(response =>{
                  console.log("answer", response);
                  this.showNotification('top', 'center', 3, "<h3>Producto Creado con exito.</h3> ", 'info');
                  this.cancel();
                });
              }else{
                this.showNotification('top', 'center', 3, "<h3>Producto Creado con exito.</h3> ", 'info');
                this.cancel();
              }
              
            }else{
              this.showNotification('top', 'center', 3, "<h3>Hubo un error al crear el producto. Comuniquese con el administrador</h3> ", 'danger');
              this.cancel();
            }
          });
        }else{

          if(this.SelectedSubCategory==-1 && this.SelectedMun == -1 && this.SelectedBrand == -1){

            this.http.post( Urlbase.tienda+"/products/v2?barcode="+this.barcode+"&idstore="+this.locStorage.getIdStore()+"&producto="+this.prodname+"&costo="+this.cost+"&iva="+this.tax+"&precio="+this.price+"&cantidad="+this.quantity+"&mun="+this.SelectedMun+"&brand="+this.SelectedBrand+"&cate="+this.SelectedSubCategory+"&idprov="+this.id_person+"&codprov="+this.provCode+"&idtiendacliente="+this.SelectedStore,{}).subscribe(data=> {
              if(data==1){
                this.http.post(Urlbase.tienda+"/inventories/imageUpload",{file: this.fileBase64String, fileName: +this.barcode,format: this.fileExtension},{responseType:'text'}).subscribe(response =>{
                  this.showNotification('top', 'center', 3, "<h3>Producto Creado con exito.</h3> ", 'info');
                  this.cancel();
                  console.log("answer", response);
                });
              }else{
                this.showNotification('top', 'center', 3, "<h3>Hubo un error al crear el producto. Comuniquese con el administrador</h3> ", 'danger');
                this.cancel();
              }
            });
          }else{
            this.showNotification('top', 'center', 3, "<h3>Debe elegir los 3 campos de Categoria, Marca y Unidad de medida.</h3> ", 'danger');
          }

        }

      CPrint("URL: ", Urlbase.tienda+"/products/v2?barcode="+this.barcode+"&idstore="+this.locStorage.getIdStore()+"&producto="+this.prodname+"&costo="+this.cost+"&iva="+this.tax+"&precio="+this.price+"&cantidad="+this.quantity+"&mun="+this.SelectedMun+"&brand="+this.SelectedBrand+"&cate="+this.SelectedSubCategory+"&idprov="+this.id_person+"&codprov="+this.provCode+"&idtiendacliente="+this.SelectedStore)
      }else{
      this.showNotification('top', 'center', 3, "<h3>Los datos ingresados no son validos, revise que ningun dato sea vacio y que el precio sea mayor o igual al costo.</h3> ", 'danger');
    }
 }

  cancel(){
    this.provCode = "";
    this.urlUploaded = "Sin Archivo";
    this.fileBase64String=null;
    this.fileExtension=null;
    this.myInputVariable.nativeElement.value = "";
    console.log(this.locStorage.getIdStore())
    this.tax=0;
    this.price = 0;
    this.cost = 0;
    this.prodname = "";
    this.barcode = "";
    this.quantity=0;
  }


  updateButton(elem){

      const dialogRef = this.dialog.open(UpdateNewProductComponent, {
        width: '60vw',
        height: '75vh',
        data: { element: elem }
      });

      dialogRef.afterClosed().subscribe(result => {
        if(result){
          this.ngOnInit();
        }
      })


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

  

  openDialogClient2(): void {



    const dialogRef = this.dialog.open(GenerateThirdComponent2Component, {
      width: '60vw',
      data: {}
    });


    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // CPrint('CREATE CLIENT SUCCESS');
        // CPrint(result);s
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

  public clientData: ClientData;

  cliente="---";
  private readonly headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  id_person=-1;
  StoresProv=[];
  SelectedStore="-1";

  searchClient(event){
    const identificacionCliente = String(event.target.value);
    let aux;
    if(identificacionCliente.length>4){
    this.http.get<any[]>(Urlbase.tercero + '/persons/search?doc_person='+String(identificacionCliente),{ headers: this.headers }).subscribe((res)=>{
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
            // this.http.get(Urlbase.tienda + "/products2/inventoryListCompra?id_store=" + this.SelectedStore + "&id_third_prov=" + aux.id_PERSON).subscribe(
            //   response => {
            //     console.log("INVENTORYLIST: ",response)
            //     this.inventoryList = response;
            //   }
            // );
            this.http.get(Urlbase.tienda + "/store/get/2?id_third=" + aux.id_PERSON).subscribe(data => {
              CPrint("TIENDAS PROVEEDOR",data);
              //@ts-ignore
              this.StoresProv = data;
              this.SelectedStore = data[0].id_STORE;
            })

          }
        });
      }
    });
  }else{
    this.showNotification('top', 'center', 3, "<h3>El elemento de busqueda debe ser de longitud mayor a 4.</h3> ", 'danger');
  }
  }

  ccClient = "";
  provCode = "";
  searchClient2(){
    CPrint("THIS ARE HEADERS",this.headers);
    const identificacionCliente = this.ccClient;
    let aux;
    if(identificacionCliente.length>4){
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

            
            // this.http.get(Urlbase.tienda + "/products2/inventoryListCompra?id_store=" + this.SelectedStore + "&id_third_prov=" + aux.id_PERSON).subscribe(
            //   response => {
            //     console.log("INVENTORYLIST: ",response)
            //     this.inventoryList = response;
            //   }
            // );
          
            this.http.get(Urlbase.tienda + "/store/get/2?id_third=" + aux.id_PERSON).subscribe(data => {
              CPrint("TIENDAS PROVEEDOR",data);
              //@ts-ignore
              this.StoresProv = data;
              this.SelectedStore = data[0].id_STORE;
            })


          }
        });


      }


    });

  }else{
    this.showNotification('top', 'center', 3, "<h3>El elemento de busqueda debe ser de longitud mayor a 4.</h3> ", 'danger');
  }
  }


  getSecondLvlCategory(){
    if(this.SelectedLine != -1){
      this.http.get(Urlbase.tienda+"/categories2/children?id_category_father="+this.SelectedLine).subscribe(data => {
        this.SubCategoryList = data
      })
    }
  }

  getFirstLvlCategory(){
    this.categoriesService.getGeneralCategories().subscribe(data => {
      this.CategoryFirstLvlList = data
    })
  }

  getMeasureUnitList(){

    this.categoriesService.getGenericMeassureUnits().subscribe(res=>{
      CPrint(res,"meassures")
      this.measureUnitList = res
    })
  }

  getBrands(){
    this.categoriesService.getBrands().subscribe(res=>{
      CPrint("THIS ARE BRANDS",res);
      this.brands = res;
    })
  }



}
