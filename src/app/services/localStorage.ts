import {Injectable} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
//import { Token } from '../shared/token';
import {Third} from '../tienda724/dashboard/business/thirds724/third/models/third';
import {Session} from '../shared/session';
import {Person} from '../shared/models/person';
import {Token} from '../shared/token';
import {Menu} from '../shared/menu';
import {Rol} from '../shared/rol';
import {from, Observable} from 'rxjs';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Urlbase} from '../shared/urls';


@Injectable({
  providedIn:'root'
})
export class LocalStorage {
  id_city;
  dateOfflineBills = [];
  priceList = [];
  inventoryList = [];
  offLineBillList = [];
  online = true;
  auditoryDateOnline;
  oldCaja="1";
  private isnav=false;
  private baseCaja = 0;
  private openedBox: boolean = false;
  //--------------------LINEA PARA MANEJO DE CODIGOS DE BARRAS DE ACCESO RAPIDO
  private codigoDeBarras: String;
  //--------------------LINEA PARA MANEJO DE CODIGOS DE BARRAS DE ACCESO RAPIDO
  private session: Session;
  private person: Person;
  private token: Token;
  private menu: Menu[];
  private third:Third;
  private rol: Rol[];
  private caja: Boolean = false;
  //------------------------LINEA PARA LUCHO-------------------------------
  private id_caja: any;
  //------------------------LINEA PARA LUCHO-------------------------------
  private id_store: any;

  private listaTipo: [number];

  private doIRefund: boolean = false;
  private idRefund: number = 0;
  private AppId = -1;

  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });



//-----------MACHETE PARA DIRECCION Y TELEFONO
private direccion: String;
private telefono: String;
cajaNumber = "";
//-----------MACHETE PARA DIRECCION Y TELEFONO

private Stores = [];
private Boxes = [];

storeList = "";

  constructor( private http: HttpClient,) {


  if(localStorage.getItem('currentUserSessionStore724')){
      this.session = JSON.parse(localStorage.getItem('currentUserSessionStore724')) ;
  }

  //-------------------CAMBIO EN CAJA A ARCHIVO LOCAL--------------------------------------------
//------------------------LINEA PARA LUCHO-------------------------------
this.id_caja = 1;
//------------------------LINEA PARA LUCHO-------------------------------
  //-------------------CAMBIO EN CAJA A ARCHIVO LOCAL--------------------------------------------

this.id_store =1;


//--------------------LINEA PARA MANEJO DE CODIGOS DE BARRAS DE ACCESO RAPIDO
this.codigoDeBarras = "-1";
//--------------------LINEA PARA MANEJO DE CODIGOS DE BARRAS DE ACCESO RAPIDO




  if(localStorage.getItem('currentUserPersonStore724')){
    this.person = JSON.parse(localStorage.getItem('currentUserPersonStore724')) ;
  }
  if(localStorage.getItem('currentUserTokenStore724')){
      this.token = JSON.parse(localStorage.getItem('currentUserTokenStore724')) ;
  }

  if(localStorage.getItem('currentUserMenuStore724')){
      this.menu = JSON.parse(localStorage.getItem('currentUserMenusStore724')) ;
  }

  if(localStorage.getItem('currentUserRolStore724')){
       this.rol = JSON.parse(localStorage.getItem('currentUserRolStore724')) ;
  }

  if(localStorage.getItem('currentThirdFatherStore724')){
    this.rol = JSON.parse(localStorage.getItem('currentThirdFatherStore724')) ;
  }

  }

  getStoreList(){
    return this.storeList;
  }

  setStoreList(storeList){
     this.storeList = storeList; 
  }

  setAppID(id){
    this.AppId = id;
  }

  getAppId(){
    return this.AppId;
  }

  setIdCity(id){
    this.id_city = id;
  }

  getIdCity(){
    return this.id_city;
  }


setCajaOld(elem){
  this.oldCaja = elem;
}

getCajaOld(){
  return this.oldCaja;
}

  setCajaNumber(elem){
    this.cajaNumber = elem;
}

getCajaNumber(){
  return this.cajaNumber;
}

getDateOfflineBills(){
  return this.dateOfflineBills;
}

setDateOfflineBills(elem){
  this.dateOfflineBills = elem;
}

pushDateOfflineBills(elem){
  this.dateOfflineBills.push(elem);
}


  private handleError(error: Response | any) {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      // @ts-ignore
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;
    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    if(localStorage.getItem("SesionExpirada") != "true"){ alert("Se encontro un error de conexion. Favor haga click en el boton Recargar y vuelva a intentar.\n\n"+errMsg);}
    return null; //Observable.throw(errMsg);
  }



  private personClient: any;

  getStoresByThird = (id_third): Observable < any > => {
    let promesa = new Promise((resolve, reject) => {
      this.http.get(Urlbase.tienda + "/store" + "?id_third=" + String(id_third), {headers: this.headers})
        .subscribe(value => {resolve(value)},error => {this.handleError(error);reject(error)});
    });
    return from(promesa);
  };

  getStores(){
    this.getStoresByThird(this.getToken().id_third).subscribe(data => {
      CPrint(data.find(item => item.id_STORE == this.getIdStore()))
      this.Stores = data;
    })
  }

  getStoreName() {
      return this.Stores.find(item => item.id_STORE == this.getIdStore()).store_NAME
  }

  getBoxByStore = (id_store): Observable < any > => {
    let promesa = new Promise((resolve, reject) => {
      this.http.get(Urlbase.tienda + "/store" + "/b?id_store=" + String(id_store), {headers: this.headers})
        .subscribe(value => {resolve(value)},error => {this.handleError(error);reject(error)});
    });
    return from(promesa);
  };


  getBoxes(){
    this.getBoxByStore(this.getIdStore()).subscribe(data => {
      this.Boxes = data;
    })
  }

  setPersonClient(elem){
    this.personClient = elem;
  }

getBoxName() {
      return this.Boxes.find(item => item.id_CAJA == this.getIdCaja()).caja_NAME
  }

  getPersonClient(){
   return this.personClient;
  }


  setDateOnline(elem){
    this.auditoryDateOnline = elem;
  }

  getDateOnline(){
   return this.auditoryDateOnline;
  }

  setOnline(elem){
    this.online = elem;
  }

  getOnline(){
   return this.online;
  }

  setOfflineBillList(elem){
    this.offLineBillList = elem;
  }

  getOfflineBillList(){
    return this.offLineBillList;
  }
  
  bills=0;
  setBills(elem){
    this.bills = elem;
  }

  increaseBills(){
    this.bills = this.bills + 1;
  }

  getBills(){
    return this.bills;
  }

  pushBillOffline(elem){
    this.offLineBillList.push(elem);
  }

  setPriceList(elem){
    this.priceList = elem;
  }

  getPriceList(){
   return this.priceList;
  }



  setInventoryList(elem){
    this.inventoryList = elem;
  }

  getInventoryList(){
   return this.inventoryList;
  }

  setDoINav(elemn){
this.isnav = elemn;
  };


  getDoINav(){
    return this.isnav;
  }


  setBase(tel){
    this.baseCaja = tel;
  }

  getBase(){
    return this.baseCaja;
  }



//---------------MACHETE PARA DIRECCION Y TELEFONO

setTelefono(tel){
  this.telefono = tel;
}

getTelefono(){
  return this.telefono
}

setBoxStatus(op){
  this.openedBox = op;
}

getBoxStatus(){
  return this.openedBox;
}

setDireccion(dir){
  this.direccion = dir;
}

getDireccion(){
  return this.direccion
}




//_____________REFUND

getDoIMakeRefund(){
  return this.doIRefund;
}

setDoIMakeRefund(state){
  this.doIRefund = state;
}

getIdRefund(){
  return this.idRefund;
}

setIdRefund(state){
  this.idRefund = state;
}





//---------------MACHETE PARA DIRECCION Y TELEFONO







  setTipo(lista){
    this.listaTipo = lista;
  }

  getTipo(){
    return this.listaTipo;
  }

  //--------------------LINEA PARA MANEJO DE CODIGOS DE BARRAS DE ACCESO RAPIDO
  setCodigoBarras(CB){
    this.codigoDeBarras = CB;
  }

  getCodigoBarras(){
    return this.codigoDeBarras;
  }
  //--------------------LINEA PARA MANEJO DE CODIGOS DE BARRAS DE ACCESO RAPIDO

  getCaja(){
    return this.caja;
  }

  setCaja(state){
    this.caja = state;
  }

//------------------------LINEA PARA LUCHO-------------------------------
getIdCaja(){
  return this.id_caja;
}

setIdCaja(state){
  this.id_caja = state;
}

getIdStore(){
  return this.id_store;
}

setIdStore(state){
  this.id_store = state;
}
//------------------------LINEA PARA LUCHO-------------------------------

  getSession() {
    this.session= JSON.parse(localStorage.getItem('currentUserSessionStore724'));
    return this.session;
  }
   getToken() {
    this.token= JSON.parse(localStorage.getItem('currentUserTokenStore724'));
    return this.token;
  }
  getThird(){
    this.third= JSON.parse(localStorage.getItem('currentThirdFatherStore724'));
    return this.third;
  }

  getIdThird() {

    var id_third=localStorage.getItem('idThird724')

    return id_third ;
  }

  getTokenValue(){
    return '3020D4:0DD-2F413E82B-A1EF04559-78CA';
  }

  getUUID(){
    return JSON.parse(localStorage.getItem('UUIDThird724'));;
  }

  getPerson() {
    this.person= JSON.parse(localStorage.getItem('currentUserPersonStore724'));
    return this.person;
  }

  getMenu() {
    this.menu= JSON.parse(localStorage.getItem('currentUserMenuStore724'));
    return this.menu;
  }

  getRol() {
    this.rol= JSON.parse(localStorage.getItem('currentUserRolStore724'));
    return this.rol;
  }


  getIdPersonApp() {
    return (this.person['id_person'])?this.person['id_person']:null;
  }
  getUIdPersonApp() {
    return (this.person['uid_usuario'])?this.person['uid_usuario']:null;
  }

 getUser() {
    return (this.token['user'])?this.token['user']:null;
  }

  isSession() {
    if ( localStorage.getItem('currentUserSessionStore724') !== null ) {
      return true;
    }
    return false;
  }

  getIdApplication(){
    return 21;
  }

  cleanSession() {
    localStorage.setItem("FCMrequest",null);
    localStorage.removeItem('currentThirdFatherStore724');
    localStorage.removeItem('currentUserSessionStore724');
    localStorage.removeItem('currentUserPersonStore724');
    localStorage.removeItem('currentUserTokenStore724');
    localStorage.removeItem('currentUserMenuStore724');
    localStorage.removeItem('currentUserRolStore724');
    localStorage.removeItem('currentUserStore724');
  }


  private listRolesCajeros = [8888]

  getListRolesCajeros(){
    return this.listRolesCajeros;
  }


}
