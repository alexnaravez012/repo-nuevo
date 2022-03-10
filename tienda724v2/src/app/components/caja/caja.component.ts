import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionManagerService } from 'src/app/services/sessionManager/session-manager.service';

@Component({
  selector: 'app-caja',
  templateUrl: './caja.component.html',
  styleUrls: ['./caja.component.scss']
})
export class CajaComponent implements OnInit {

  constructor(private router: Router,
              private sessionManager : SessionManagerService,
              private httpClient: HttpClient,
              public datePipe: DatePipe,) { }

  username:any;
  clientName:any;
  obj: any;
  rolList:any;

  ngOnInit(): void {
    this.obj = this.sessionManager.returnIdObject();
    this.clientName = this.obj.third.fullname;
    this.username = this.obj.usuario;
    this.rolList = this.obj.roles;
  }

  goMenu(){
    this.router.navigate(['menu']);
  }

  getRolString(){
    let response = "";
    this.rolList.forEach((i: { rol: string; }) => {
      response = response + i.rol+"/ "
    });
    return response;
  }

  getStoreName(){
    return this.sessionManager.returnStoreName();
  }

  logOut(){
    localStorage.removeItem("ID");
    localStorage.removeItem("idStore");
    localStorage.removeItem("mesa");
    localStorage.removeItem("storeName");
    localStorage.removeItem("ID_CAJA");
    this.router.navigate(['login']);
  }

}
