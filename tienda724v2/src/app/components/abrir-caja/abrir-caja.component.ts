import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Urlbase } from 'src/app/classes/urls';
import { SessionManagerService } from 'src/app/services/sessionManager/session-manager.service';
import * as moment from 'moment';

@Component({
  selector: 'app-abrir-caja',
  templateUrl: './abrir-caja.component.html',
  styleUrls: ['./abrir-caja.component.scss']
})
export class AbrirCajaComponent implements OnInit {

  constructor(private httpClient : HttpClient,
    private sessionManager : SessionManagerService,
    private router: Router) { }

  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });
  obj: any;
  rolList:any;
  username:any;
  clientName:any;
  boxList:any;
  openBoxList:any;
  boxToPost = {
    id_THIRD_EMPLOYEE: 0,
    notes:"Base Inicial",
    starting_DATE:"2019-03-27",
    balance:0,
    status: "O",
    id_CAJA: 0
  };
  selectedBox:any;
  selectedStore:any;

  ngOnInit(): void {
    this.obj = this.sessionManager.returnIdObject();
    this.rolList = this.obj.roles;
    this.clientName = this.obj.third.fullname;
    this.username = this.obj.usuario;
    this.httpClient.get(Urlbase.cierreCaja + "/close/openBoxes/v2?id_third=" + this.obj.id_third,{ headers: this.headers,withCredentials:true }).subscribe(answering=>{
      this.openBoxList = answering;
      console.log(answering);
    })
    this.httpClient.get(Urlbase.cierreCaja + "/close/myboxes?id_person="+this.obj.third.id_person,{ headers: this.headers,withCredentials:true }).subscribe(resp => {
      console.log(resp);
      this.boxList = resp;
      //@ts-ignore
      this.selectedBox = resp[0].id_CAJA;
    })
  }

  hasOpenBox(){
    if(this.openBoxList){
      if(this.openBoxList.length>0){
        return true;
      }
      return false;
    }else{
      return false;
    }
  }

  getRolString(){
    let response = "";
    this.rolList.forEach((i: { rol: string; }) => {
      response = response + i.rol+"/ "
    });
    return response;
  }

  goMenu(){
    this.router.navigate(['menu']);
  }

  getStoreName(){
    return this.sessionManager.returnStoreName();
  }

  openBox(){
    this.boxToPost.id_CAJA = this.selectedBox;
    this.boxToPost.id_THIRD_EMPLOYEE = this.obj.id_third;
    this.boxToPost.balance = 500;
    this.boxToPost.notes = "BALANCE INICIAL";
    this.boxToPost.status = "O";
    this.httpClient.post(Urlbase.cierreCaja + '/close',this.boxToPost,{ headers: this.headers,withCredentials:true }).subscribe(response =>
      {
        localStorage.removeItem("idStore");
        localStorage.setItem('idStore', btoa(this.selectedStore));
        localStorage.setItem('ID_CAJA', btoa(JSON.stringify(response)));
        let initialMoneyToPost = '[{"valor": '+String(500)+', "naturaleza": "D", "movement_DATE": "2019-03-23", "notes": "Base Incial"}]';
        let params = new HttpParams();
        //@ts-ignore
        params = params.append('id_cierre_caja', response);
        this.httpClient.post(Urlbase.cierreCaja + '/detail-close',initialMoneyToPost,{ headers: this.headers,params: params,withCredentials:true }).subscribe(answer=>{
          if(answer==1){
            this.router.navigate(['boxoption']);
          }
        })
      }
    )
  }


  setStore(){
    let element = this.boxList.filter((element: any) => element.id_CAJA == this.selectedBox);
    this.selectedStore = element[0].id_STORE;
    //this.selectedStore =
  }

  continueWithOpenBox(){
    localStorage.removeItem("idStore");
    this.sessionManager.setStoreName(this.openBoxList[0].tienda);
    this.sessionManager.setIdStore(this.openBoxList[0].id_STORE);
    localStorage.setItem('ID_CAJA', btoa(JSON.stringify(this.openBoxList[0].id_CAJA)));
    this.router.navigate(['boxoption']);
  }

}
