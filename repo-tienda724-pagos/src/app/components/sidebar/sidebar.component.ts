import {Component, ElementRef, HostListener, OnInit, ViewChild, ViewEncapsulation} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import {ActivatedRoute, Router} from '@angular/router';
import {Menu} from '../../shared/menu';
import {Token} from '../../shared/token';
import {Person} from '../../shared/models/person';
import {LocalStorage} from '../../services/localStorage';
import {AuthenticationService} from '../../services/authentication.service';
import {Third} from '../../tienda724/dashboard/business/thirds724/third/models/third';
import {ThirdService} from '../../services/third.service';
import {OpenBoxComponent} from '../open-box/open-box.component';
import {BillingService} from '../../services/billing.service';
import {MatDialog} from '@angular/material';
//import { HttpClient } from '@angular/common/http';
import {UserIdleService} from 'angular-user-idle';
import {OpenorcloseboxComponent} from '../openorclosebox/openorclosebox.component';
import {SelectboxComponent} from '../selectbox/selectbox.component';
import {CloseBoxComponent} from '../../tienda724/dashboard/business/billing724/billing/bill-main/close-box/close-box.component';
import {StoreSelectorService} from '../store-selector.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';

import * as jQuery from 'jquery';
import 'bootstrap-notify';
import {Urlbase} from '../../shared/urls';
import {InventoriesService} from 'src/app/services/inventories.service';
import {FCMservice} from '../../services/fcmservice.service';
import {NgxCoolDialogsService} from 'ngx-cool-dialogs';
import { ReturnStatement } from '@angular/compiler';

let $: any = jQuery;
declare interface RouteInfo {
  path: string;
  title: string;
  icon: string;
  class: string;
}
export const ROUTES_START: RouteInfo[] = [
  /* { path: 'business/menu', title: 'Dashboard',  icon: 'dashboard', class: '' }, */
  /*   { path: 'user-profile', title: 'User Profile',  icon:'person', class: '' } */
];
export const ROUTES: RouteInfo[] = [
  /* { path: 'table-list', title: 'Table List',  icon:'content_paste', class: '' },
  { path: 'typography', title: 'Typography',  icon:'library_books', class: '' },
  { path: 'icons', title: 'Icons',  icon:'bubble_chart', class: '' },
  { path: 'maps', title: 'Maps',  icon:'location_on', class: '' },
  { path: 'notifications', title: 'Notifications',  icon:'notifications', class: '' },
{ path: 'upgrade', title: 'Upgrade to PRO',  icon:'unarchive', class: '' }, */
];

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  encapsulation:ViewEncapsulation.None

})
export class SidebarComponent implements OnInit {
  menusLista:Menu[];
  token:Token;
  menuItems: any[];
  menuItemsStart: any[];
  person: Person;
  thirdFather: Third;
  idThird: number;
  myBox: any;
  currentBox: String = "21";
  urlBase = "/dashboard/business/movement/";
  compressed = false;
  storeName=" ";
  SelectedStore;
  Stores;
  mostrandoCargando = false;
  mostrandoNombreTiendaFlotante = false;
  AjusteLeftTiendaFlotante = "50vw";
  private readonly headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  EstiloPanel = 1;

  constructor(
    public inventoriesService: InventoriesService,
    private service: StoreSelectorService,
    private userIdle: UserIdleService,
    private http: HttpClient,
    private authService:AuthenticationService,
    public locStorage: LocalStorage,
    public dialog: MatDialog,
    public router: Router,
    private thirdService : ThirdService,
    private billingService : BillingService,
    private activatedRoute: ActivatedRoute,
    private fcmService: FCMservice,
    private coolDialogs: NgxCoolDialogsService
  ) {
    if(localStorage.getItem("SidebarStyle") == "1"){//Panel
      this.EstiloPanel = 1;
    }else{//Sidebar
      this.EstiloPanel = 2;
    }

    this.service.onMainEvent.subscribe(
      (onMain) => {
        this.SelectedStore = onMain;
      }
    );

    this.service.onLogOutEvent.subscribe(
      (log) => {
        // noinspection JSIgnoredPromiseFromCall
        this.logout();
      }
    );
    this.headers = new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization':  this.locStorage.getTokenValue(),
    });
  }

  //TODO LO QUE TIENE QUE VER CON EL PANEL
  @ViewChild('ContenedorMatCard') ContenedorOpciones: ElementRef;
  @ViewChild('ContenedorHeader') HeaderRef: ElementRef;
  MostrarPanel = true;
  AnchoOpcionPanel = 100;
  AltoOpcionPanel = 100;
  ColumnasEnElPanel = 3;


  ClickShowOptions(){
    this.MostrarPanel = true;
    window.setTimeout(() => {this.GenerarOpciones();},150);
  }
  CerrarPanel(){
    this.MostrarPanel = false;
  }
  ngAfterViewInit(){
    window.setTimeout(() => {this.GenerarOpciones();},150);
    //this.GenerarOpciones();
  }
  @HostListener("window:resize", [])
  private onResize() {
    this.GenerarOpciones();
  }
  GenerarOpciones(){
    CPrint("[INICIO]GenerarOpciones");
    try {
      if(this.HeaderRef == null){CPrint("this.HeaderRef NULL");return;}
      this.HeaderRef.nativeElement.parentElement.children[0].setAttribute('style', 'margin: 0 0');
      this.AnchoOpcionPanel = ((this.ContenedorOpciones.nativeElement.offsetWidth-10)/this.ColumnasEnElPanel)-10;
      this.AltoOpcionPanel = ((this.ContenedorOpciones.nativeElement.offsetHeight-10)/(Math.ceil(this.menusLista.length/this.ColumnasEnElPanel))) - 10;
    }catch (e) {
      CPrint("[ERROR]GenerarOpciones");
      CPrint(e);
    }
    return true;
  }

  CambiarVista(){
    if(this.EstiloPanel == 1){
      this.EstiloPanel = 2;
      this.MostrarPanel = true;
      window.setTimeout(() => {this.GenerarOpciones();},50);
    }else{
      this.EstiloPanel = 1;
    }
    this.AjustarTituloTiendaFlotante(this.menuSeleccionado.ruta);
    localStorage.setItem("SidebarStyle",this.EstiloPanel+"");
  }
  ////////////////////////////////////////

  firstComponentFunction(){
    this.billingService.onClick();
  }

  ComprimirSidebar(){
    this.compressed = !this.compressed;
    this.AjustarTituloTiendaFlotante(this.menuSeleccionado.ruta);
    localStorage.setItem('EstadoSideBar', this.compressed ? "Comprimido":"NoComprimido");
  }

  imgurl;
  imgNameSend;
  imgNameSend2;
  ngOnInit() {



    CPrint("THIS THIR IS MINE: ", this.locStorage.getThird());

    this.imgurl = Urlbase.logos+"/"+this.locStorage.getThird().info.type_document+" "+this.locStorage.getThird().info.document_number+".jpg";
    this.imgNameSend = this.locStorage.getThird().info.type_document+" "+this.locStorage.getThird().info.document_number;
    this.imgNameSend2 = this.locStorage.getToken().id_third_father;
    CPrint("this.imgurl", this.imgurl);
    //Esto es para cargar el estado previo del sidebar
    let valorPrevioSidebar = localStorage.getItem('EstadoSideBar');
    if(valorPrevioSidebar == null){
      this.compressed = false;
    }else{
      this.compressed = valorPrevioSidebar == "Comprimido";
    }
    ///////////////////////
    let idPerson = this.locStorage.getPerson().id_person;

    //let directory = this.billingService.getDirectoryById();

    //@ts-ignore
  this.http.get(Urlbase.tercero+"/thirds/getCity?id_third="+this.locStorage.getToken().id_third_father,{ headers: this.headers }).subscribe(response => {
    this.locStorage.setIdCity(response);
  })

    let rolesCajeros = this.locStorage.getRol().filter(element => this.locStorage.getListRolesCajeros().includes(element.id_rol) )
    localStorage.setItem("id_employee",String(this.locStorage.getToken().id_third));
      //if(this.locStorage.getRol()[0].id_rol==8888 || this.locStorage.getRol()[0].id_rol==21 || this.locStorage.getRol()[0].id_rol==7777 || this.locStorage.getRol()[0].id_rol == 23  || this.locStorage.getRol()[0].id_rol == 41 ){
      let itemMenu = this.locStorage.getMenu().sort(this.dynamicSort("id_menu")).filter(item => item.id_menu == 143 || (rolesCajeros.length>0))
      if( itemMenu.length>0 ){
        this.mostrandoCargando = true;
        this.http.get(Urlbase.cierreCaja + "/close/openBoxes/v2?id_third=" + this.locStorage.getToken().id_third).subscribe(answering=>{
          if(localStorage.getItem("SesionExpirada") == "true"){
            return;
          }

          localStorage.setItem("myBox",answering.toString());
          this.currentBox = localStorage.getItem("currentBox");
          CPrint("this is responshe",answering);

          this.mostrandoCargando = false;
          if(this.locStorage.getRol()[0].id_rol==8888){
            this.MostrarPanel = false;
          }

          //@ts-ignore
          if(answering.length > 0){
            this.locStorage.setDoINav(true);
            let dialogRef = this.dialog.open(OpenorcloseboxComponent, {
              width: '60vw',
              data: {answering},
              disableClose: true
            }).afterClosed().subscribe(response=> {
              CPrint(response);
              if(response){
                this.locStorage.setBoxStatus(true);
                this.locStorage.setCajaOld(Number(answering[0].id_CAJA));
                this.locStorage.setIdCaja(Number(answering[0].id_CAJA));
                this.http.get(Urlbase.cierreCaja + "/close/myboxes?id_person="+this.locStorage.getPerson().id_person).subscribe(resp => {
                  CPrint(resp);
                  //@ts-ignore
                  resp.forEach(element => {
                    if(element.id_CAJA==Number(answering[0].id_CAJA)){
                      CPrint("ENTRE");
                      this.locStorage.setIdStore(element.id_STORE);
                      this.http.get(Urlbase.cierreCaja +"/close/openBox?id_store="+this.locStorage.getIdStore()).subscribe(
                        elements => {
                          //@ts-ignore
                          elements.forEach(thing => {
                            //@ts-ignore
                            if(thing.id_CAJA==element.id_CAJA){
                              //@ts-ignore
                              this.locStorage.setCajaNumber(thing.caja)
                            }

                          });
                        }
                      );
                      this.getLists();
                      this.getStoreType(element.id_STORE);
                    }
                  });
                  this.SelectedStore=this.locStorage.getIdStore();
                  // noinspection JSIgnoredPromiseFromCall
                  //this.router.navigateByUrl("/dashboard/business/movement/billing/main");
                  this.getStores2();
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
                  this.locStorage.setIdCaja(Number(answering[0].id_CAJA));

                this.locStorage.setCajaOld(Number(answering[0].id_CAJA));
                  dialogRef = this.dialog.open(SelectboxComponent, {
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
                      this.http.get(Urlbase.cierreCaja + "/close/myboxes?id_person="+this.locStorage.getPerson().id_person).subscribe(resp => {
                        //@ts-ignore
                        resp.forEach(element => {
                          if(element.id_CAJA==this.locStorage.getIdCaja()){
                            this.locStorage.setIdStore(element.id_STORE);
                            this.http.get(Urlbase.cierreCaja +"/close/openBox?id_store="+this.locStorage.getIdStore()).subscribe(
                              elements => {
                                //@ts-ignore
                                elements.forEach(thing => {
                                  //@ts-ignore
                                  if(thing.id_CAJA==element.id_CAJA){
                                    //@ts-ignore
                                    this.locStorage.setCajaNumber(thing.caja)
                                  }

                                });
                              }
                            );
                            this.getLists();
                            this.getStoreType(element.id_STORE);
                          }
                        });
                      });
                      dialogRef = this.dialog.open(OpenBoxComponent, {
                        width: '60vw',
                        data: {flag:false},
                        disableClose: true
                      }).afterClosed().subscribe(response=> {
                        this.http.post(Urlbase.facturacion+"/pedidos/abrirCajaPlanilla?IDCIERRECAJA="+this.locStorage.getIdCaja(),{}).subscribe(e=> {
                          this.locStorage.setBoxStatus(true);
                          this.SelectedStore=this.locStorage.getIdStore();
                          this.getStores2();
                          this.locStorage.setCajaOld(this.locStorage.getIdCaja());
                          CPrint("ID CAJA: ",this.locStorage.getIdCaja());
                          CPrint("ID STORE: ",this.locStorage.getIdStore());
                          CPrint("STORE TYPE: ",this.locStorage.getTipo());
                          CPrint("BOX TYPE: ",this.locStorage.getBoxStatus());
                          // noinspection JSIgnoredPromiseFromCall
                          //this.router.navigateByUrl("/dashboard/business/movement/billing/main")
                        })
                      });

                    }else{
                      this.locStorage.setBoxStatus(false);
                      this.getStores2();
                    }
                  });

                });
              }
            });
          }else{
            this.locStorage.setDoINav(true);
            CPrint("IM ON THE NO OPEN BOX SIDE OF THINGS");
            let dialogRef = this.dialog.open(SelectboxComponent, {
              width: '60vw',
              data: {},
              disableClose: true
            }).afterClosed().subscribe(response2=> {
              CPrint("this is my boolean, ",response2.open);
              this.locStorage.setDoINav(false);
              if(response2.logout){
                // noinspection JSIgnoredPromiseFromCall
                this.logout();
              }else if(response2.open){
                this.locStorage.setIdCaja(response2.idcaja);

                this.locStorage.setCajaOld(response2.idcaja);
                this.locStorage.setBoxStatus(true);
                this.http.get(Urlbase.cierreCaja + "/close/myboxes?id_person="+this.locStorage.getPerson().id_person).subscribe(resp => {
                  //@ts-ignore
                  resp.forEach(element => {
                    if(element.id_CAJA==this.locStorage.getIdCaja()){
                      this.locStorage.setIdStore(element.id_STORE);
                      this.http.get(Urlbase.cierreCaja +"/close/openBox?id_store="+this.locStorage.getIdStore()).subscribe(
                        elements => {
                          //@ts-ignore
                          elements.forEach(thing => {
                            //@ts-ignore
                            if(thing.id_CAJA==element.id_CAJA){
                              //@ts-ignore
                              this.locStorage.setCajaNumber(thing.caja)
                            }

                          });
                        }
                      );
                      this.getLists();
                      this.getStoreType(element.id_STORE);
                    }
                  });
                });
                dialogRef = this.dialog.open(OpenBoxComponent, {
                  width: '60vw',
                  data: {flag:false},
                  disableClose: true
                }).afterClosed().subscribe(response=> {
                  this.http.post(Urlbase.facturacion+"/pedidos/abrirCajaPlanilla?IDCIERRECAJA="+this.locStorage.getIdCaja(),{}).subscribe(e=> {
                    this.locStorage.setBoxStatus(true);
                    CPrint("ID CAJA: ",this.locStorage.getIdCaja());
                    CPrint("ID STORE: ",this.locStorage.getIdStore());
                    CPrint("STORE TYPE: ",this.locStorage.getTipo());
                    CPrint("BOX TYPE: ",this.locStorage.getBoxStatus());
                    this.SelectedStore=this.locStorage.getIdStore();
                    this.locStorage.setCajaOld(this.locStorage.getIdCaja());
                    // noinspection JSIgnoredPromiseFromCall
                    //this.router.navigateByUrl("/dashboard/business/movement/billing/main");
                    this.getStores2();
                    this.firstComponentFunction()
                  });
                });
              }else{
                this.locStorage.setIdCaja(response2.idcaja);

                this.locStorage.setCajaOld(response2.idcaja);
                this.getStores3(response2.idcaja);

                this.http.get(Urlbase.cierreCaja + "/close/myboxes?id_person="+this.locStorage.getPerson().id_person).subscribe(resp => {
                  //@ts-ignore
                  resp.forEach(element => {
                    if(element.id_CAJA==this.locStorage.getIdCaja()){
                      this.locStorage.setIdStore(element.id_STORE);
                      this.http.get(Urlbase.cierreCaja +"/close/openBox?id_store="+this.locStorage.getIdStore()).subscribe(
                        elements => {
                          //@ts-ignore
                          elements.forEach(thing => {
                            //@ts-ignore
                            if(thing.id_CAJA==element.id_CAJA){
                              //@ts-ignore
                              this.locStorage.setCajaNumber(thing.caja)
                            }

                          });
                        }
                      );
                      this.getLists();
                      this.getStoreType(element.id_STORE);
                      this.getStores2();
                    }
                  });
                })

              }
            });


          }
        });
      }
else{
  this.getStores4()
}
    // this.userIdle.startWatching();

    // // Start watching when user idle is starting.
    // this.userIdle.onTimerStart().subscribe(count => CPrint(count));

    // Start watch when time is up.
    // this.userIdle.onTimeout().subscribe(() => {
    //   if(localStorage.getItem("SesionExpirada") != "true"){ alert('Se ha cerrado su sesion debido a Inactividad.');}
    //    // noinspection JSIgnoredPromiseFromCall
    //   this.logout();

    // });
    this.menuItems = ROUTES.filter(menuItem => menuItem);
    this.menuItemsStart = ROUTES_START.filter(menuItem => menuItem);

    /** @todo elimanar la asiignación de token

     */


    let session=this.locStorage.getSession();
    if(!session){
      /**
       @todo Eliminar comentario para
       */
      this.Login();
    }else{
      this.menusLista=this.locStorage.getMenu().filter((item,index,self) => index === self.findIndex(
        (t) => t.id_menu === item.id_menu
      )).sort(this.dynamicSort("id_menu"));

      this.token=this.locStorage.getToken();

      this.person=this.locStorage.getPerson();
      this.thirdFather=this.locStorage.getThird();

      //Esto es para poder seleccionar el item que tiene abierto
      this.router.events.subscribe(val => {
        let ruta = this.router.url.substring(29);
        for(let j = 0;j<this.menusLista.length;j++){
          if(ruta.includes(this.menusLista[j].ruta)){
            this.menuSeleccionado = this.menusLista[j];
            this.AjustarTituloTiendaFlotante(this.menusLista[j].ruta);
            break;
          }
        }
      });
      // this.activatedRoute.url.subscribe(activeUrl =>{
      //   CPrint("[ruta1]this.router.url es "+this.router.url);
      //   let ruta = this.router.url.substring(29);
      //   CPrint("[ruta]ruta es "+ruta);
      //   CPrint("[ruta]menusLista es ");
      //   CPrint(this.menusLista);
      //   for(let j = 0;j<this.menusLista.length;j++){
      //     if(ruta.includes(this.menusLista[j].ruta)){
      //       this.menuSeleccionado = this.menusLista[j];
      //       break;
      //     }
      //   }
      // });
    }

    window.setTimeout(() => {this.GenerarOpciones();},300);
  }




  AjustarTituloTiendaFlotante(ruta){
    if(ruta != "billing/main" && ruta != "pedidos" &&  ruta != "devbill" && ruta != "inventory" && ruta!="compbill"){
      this.mostrandoNombreTiendaFlotante = true;
      // if(ruta =="compbill"){this.AjusteLeftTiendaFlotante = "calc(49vw - "+(this.EstiloPanel == 1 ? this.compressed ? (175/2):0:110)+"px)";}
      if(ruta =="inbill"){this.AjusteLeftTiendaFlotante = "calc(58vw - "+(this.EstiloPanel == 1 ? this.compressed ? (175/2):0:110)+"px)";}
      if(ruta =="outbill"){this.AjusteLeftTiendaFlotante = "calc(58vw  - "+(this.EstiloPanel == 1 ? this.compressed ? (175/2):0:110)+"px)";}
      if(ruta =="devbill"){this.AjusteLeftTiendaFlotante = "calc(64vw  - "+(this.EstiloPanel == 1 ? this.compressed ? (175/2):0:110)+"px)";}
      if(ruta =="categories"){this.AjusteLeftTiendaFlotante = "calc(51vw  - "+(this.EstiloPanel == 1 ? this.compressed ? (175/2):0:110)+"px)";}
      if(ruta =="inventory"){this.AjusteLeftTiendaFlotante = "calc(51vw  - "+(this.EstiloPanel == 1 ? this.compressed ? (175/2):0:110)+"px)";}
      if(ruta =="reportes"){this.AjusteLeftTiendaFlotante = "calc(51vw  - "+(this.EstiloPanel == 1 ? this.compressed ? (175/2):0:110)+"px)";}
      if(ruta =="thirds"){this.AjusteLeftTiendaFlotante = "calc(51vw  - "+(this.EstiloPanel == 1 ? this.compressed ? (175/2):0:110)+"px)";}
      if(ruta =="conta"){this.AjusteLeftTiendaFlotante = "calc(51vw  - "+(this.EstiloPanel == 1 ? this.compressed ? (175/2):0:110)+"px)";}
      if(ruta =="newproduct"){this.AjusteLeftTiendaFlotante = "calc(51vw  - "+(this.EstiloPanel == 1 ? this.compressed ? (175/2):0:110)+"px)";}
      CPrint("this.AjusteLeftTiendaFlotante es "+this.AjusteLeftTiendaFlotante);
    }else{
      this.mostrandoNombreTiendaFlotante = false;
    }
  }

  getStoreType(id_store){
    //@ts-ignore
    this.http.get(Urlbase.tienda + "/store/tipoStore?id_store="+id_store).subscribe( response => {
      this.locStorage.setTipo(response);
      CPrint("ID CAJA: ",this.locStorage.getIdCaja());
      CPrint("ID STORE: ",this.locStorage.getIdStore());
      CPrint("STORE TYPE: ",this.locStorage.getTipo());
      CPrint("BOX TYPE: ",this.locStorage.getBoxStatus());
      this.getStores();
    })
  }


  getStores() {
    this.billingService.getStoresByThird(this.locStorage.getToken().id_third).subscribe(data => {
      data.forEach(element => {
        if(element.id_STORE==this.locStorage.getIdStore()){
          this.storeName = element.store_NAME;
        }
      });
      let storeList = "";
      for(let a=0; a<data.length; a++){
        storeList += data[a].id_STORE+",";
        this.locStorage.setStoreList(storeList.substring(0,storeList.length-1));

      }
    })
  }

  GetNameFromIDStore(){
    let name = "";
    for(let n = 0;n<this.Stores.length;n++){
      if(this.Stores[n].id_STORE == this.SelectedStore){
        name = this.Stores[n].store_NAME;
        break;
      }
    }
    return name;
  }

  setIdStore(){
    this.locStorage.setIdStore(this.SelectedStore);
    this.locStorage.setCajaNumber("");

    this.getLists();
    this.locStorage.setIdCaja(1);
    this.locStorage.setBoxStatus(false);
    CPrint("NEW ID STORE:", this.locStorage.getIdStore());
    CPrint("NEW ID CAJA:", this.locStorage.getIdCaja());
    CPrint("NEW BOX STATUS:", this.locStorage.getBoxStatus());
    this.http.get(Urlbase.tienda + "/store/tipoStore?id_store="+this.SelectedStore).subscribe( response => {
      this.locStorage.setTipo(response);
    })
  }

  getLists(){

    this.locStorage.setOnline(true);
    this.locStorage.getStores();
    this.locStorage.getBoxes();



    // this.http.get(Urlbase.tienda+"/price-list/priceList?idstore="+this.locStorage.getIdStore()).subscribe(response => {
    //   this.locStorage.setPriceList(response);
    //   // this.inventoriesService.getInventory(this.locStorage.getIdStore()).subscribe(res => {
    //   //   this.locStorage.setInventoryList(res);
    //   // })
    //   //this.getInventoryList(this.locStorage.getIdStore());
    // })

  }


  fileBase64String = null;
  fileExtension = null;
  urlUploaded = "Sin Archivo";
  imgName = null;
  imgURL = null;
  size = null;

  setFileImage(event) {
    console.log("UPLOAD IMAGE")
    const file = event.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {

        this.size = Math.round((event.srcElement.files[0].size/1024/1024) * 100) / 100;

        if(this.size>=1){
          this.showNotification2('top', 'center', 3, "<h3>El tamaño de la imagen es mayor al limite permitido de 1MB.</h3> ", 'danger')
          this.clearImg();
          return;
        }

        this.fileBase64String = reader.result;
        this.fileExtension = event.target.files[0].name.split(".").pop();
        this.urlUploaded = event.target.files[0].name;
        this.imgName = event.target.files[0].name;
        if(this.fileExtension == "jpg" || this.fileExtension == "jpeg" || this.fileExtension == "png" ){
          this.http.post(Urlbase.tienda+"/products2/imgupload?filename1="+this.imgNameSend+"&filename2="+this.imgNameSend2,{file: this.fileBase64String, fileName: this.urlUploaded.split("(").join("_").split(")").join("_").split(" ").join("_"), format: this.fileExtension}).subscribe(e => {
          console.log("im in")
          })
          this.imgURL = reader.result;
          this.imgurl = reader.result;
          //SUBIR IMAGEN;
        }else{
          this.showNotification2('top', 'center', 3, "<h3>Formato de imagen no válido, los formatos permitidos son, JPG, JPEG y PNG.</h3> ", 'danger');
          this.clearImg();
          return;
        }
    };
  }

  clearImg(){
    this.fileBase64String = null;
    this.fileExtension = null;
    this.urlUploaded = "Sin Archivo";
    this.imgName = null;
    this.imgURL = null;
    this.size = null;
  }

  openFile(){
    console.log('hell')
    document.querySelector('input').click()
  }


  getInventoryList(store){
    this.http.get(Urlbase.tienda+"/products2/inventoryListActivos?id_store="+this.locStorage.getIdStore()).subscribe(data => {
      this.locStorage.setInventoryList(data);
    });

  }


setLocStorageStore(){
  this.locStorage.setIdStore(this.SelectedStore);
  this.locStorage.setBoxStatus(false);

}
  getStores2() {
    this.billingService.getStoresByThird(this.locStorage.getToken().id_third).subscribe(data => {
      CPrint(data);
      this.Stores = data;
      this.SelectedStore = this.locStorage.getIdStore();
      this.locStorage.setDoINav(false);
    })
  }


  getStores3(object) {
    this.billingService.getStoresByThird(this.locStorage.getToken().id_third).subscribe(data => {
      this.getStoreType(data[0].id_STORE);
      CPrint(data);
      this.locStorage.setBoxStatus(false);
      this.Stores = data;
      this.SelectedStore = data[0].id_STORE;
      this.locStorage.setIdStore(data[0].id_STORE);
      this.http.get(Urlbase.cierreCaja +"/close/openBox?id_store="+data[0].id_STORE).subscribe(
        elements => {
          //@ts-ignore
          elements.forEach(thing => {
            //@ts-ignore
            if(thing.id_CAJA==object){
              //@ts-ignore
              this.locStorage.setCajaNumber(thing.caja)
            }

          });
        }
      );
      this.getLists()
    }      )
  }


  getStores4() {
    this.billingService.getStoresByThird(this.locStorage.getToken().id_third).subscribe(data => {
      this.getStoreType(data[0].id_STORE);
      CPrint(data);
      this.locStorage.setBoxStatus(false);
      this.Stores = data;
      this.SelectedStore = data[0].id_STORE;
      this.locStorage.setIdStore(data[0].id_STORE);
      this.getLists()
    }      )
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

  isMobileMenu() {
    return window.innerWidth <= 991;
  };

  doubleclick = false;

  async logout() {
    if(this.doubleclick){
      return;
    }else{
      this.doubleclick = true;
    }
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

  showNotification2(from, align, id_type?, msn?, typeStr?) {
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


  showNotification(from, align,text = "Usted <b>Cerro Sesión</b> de forma satisfactoria."){
    const type = ['','info','success','warning','danger'];

    const color = Math.floor((Math.random() * 4) + 1);

    $.notify({
      icon: "notifications",
      message: text

    },{
      type: type[2],
      timer: 200,
      placement: {
        from: from,
        align: align
      }
    });
  }

  goIndex() {
    let link = ['/'];
    // noinspection JSIgnoredPromiseFromCall
    this.router.navigate(link);
  }

  Login() {
    let link = ['/auth'];
    // noinspection JSIgnoredPromiseFromCall
    this.router.navigate(link);
  }

  isMobileMenuNav() {
    return window.innerWidth <= 991;

  };

  public menuSeleccionado = null;

  gotoMenu(menu){
    this.MostrarPanel = false;
    // noinspection JSIgnoredPromiseFromCall
    this.router.navigateByUrl(this.urlBase+menu.ruta)
  }
}
