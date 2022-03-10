import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { interval } from 'rxjs';
import { SessionManagerService } from 'src/app/services/sessionManager/session-manager.service';
import { Urlbase } from '../../classes/urls';

@Component({
  selector: 'app-mesas',
  templateUrl: './mesas.component.html',
  styleUrls: ['./mesas.component.scss']
})
export class MesasComponent implements OnInit {

  constructor(private httpClient : HttpClient,
              private sessionManager : SessionManagerService,
              private router: Router,) { }
  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });
  tableList:any;
  tableToOpen:any;
  inventoryList:any
  idObject:any;
  tableName:any;
  rolList:any;
  username:any;
  clientName:any;
  obj: any;
  canItOpenTable:any = false;

  ngOnInit(): void {

    this.httpClient.get(Urlbase.tienda + "/products2/inventoryList?id_store="+this.sessionManager.returnIdStore(),{ headers: this.headers,withCredentials:true }).subscribe(data => {
      this.inventoryList = data;
      //CPrint("this is InventoryList: "+JSON.stringify(data))
      this.canItOpenTable = true;
    });

    this.idObject = this.sessionManager.returnIdObject();
    this.obj = this.sessionManager.returnIdObject();
    this.rolList = this.obj.roles;
    this.clientName = this.obj.third.fullname;
    this.username = this.obj.usuario;
    this.httpClient.get(Urlbase.facturacion + "/billing/getPedidosMesa?id_store="+this.sessionManager.returnIdStore()+"&id_bill_type="+86+"&id_bill_state="+801,{ headers: this.headers,withCredentials:true }).subscribe(response => {
      //@ts-ignore
      this.tableList = response;
    })

    interval(3000).subscribe((val:any) => {

      this.httpClient.get(Urlbase.facturacion + "/billing/getPedidosMesa?id_store="+this.sessionManager.returnIdStore()+"&id_bill_type="+86+"&id_bill_state="+801,{ headers: this.headers,withCredentials:true }).subscribe(response => {
        //console.log("DATA: ",response)
        //@ts-ignore
        this.tableList = response;
      })

      //console.log('called');

    });
  }

  getRolString(){
    let response = "";
    this.rolList.forEach((i: { rol: string; }) => {
      response = response + i.rol+"/ "
    });
    return response;
  }

  getDateInMinutes(date:any){
    if(date == null){
      return null;
    }
    let today = new Date();
    let dif = today.getTime() - (new Date(date)).getTime();
    return Math.round((Math.round(dif/1000)/60))
  }

  goToDetail(mesa:any){
    let table = this.tableList.find((element:any) => mesa.id_MESA == element.id_MESA )
    this.sessionManager.setMesa(table);
    this.router.navigate(['detailmesa']);
  }

  goMenu(){
    this.router.navigate(['menu']);
  }

  tableClick(table:any){
    this.tableToOpen = table
    this.tableName = table.mesa
  }


  logOut(){
    localStorage.removeItem("ID");
    localStorage.removeItem("idStore");
    localStorage.removeItem("mesa");
    localStorage.removeItem("storeName");
    localStorage.removeItem("ID_CAJA");
    this.router.navigate(['login']);
  }


  openTable(item:any){

    console.log(item);

    if(!this.canItOpenTable){
      alert("Espera 30 segundos mientras se terminan de cargar los productos");
      return;
    }


    let detailList = "";
    let detailListNew = "";
    let object = this.inventoryList.find((element:any) => element.code === "45000198" || element.ownbarcode === "45000198" );
    detailList = detailList+ "{"+object.id_PRODUCT_STORE+","+object.standard_PRICE+","+object.id_TAX+","+1+"},"
    detailListNew = detailListNew+ "{"+object.id_PRODUCT_STORE+",0},"


    //GENERO LA LISTA DE DTOs DE DETALLES
    this.httpClient.post(Urlbase.facturacion+ "/billing/crearPedidoMesa?idstoreclient=11&idthirduseraapp="+this.idObject.id_third+"&idstoreprov="+this.sessionManager.returnIdStore()+"&detallepedido="+detailList.substring(0, detailList.length - 1)+"&descuento="+0+"&idpaymentmethod="+1+"&idapplication="+40+"&idthirdemp="+this.idObject.id_third+"&detallepedidomesa="+detailListNew.substring(0, detailListNew.length - 1)+"&idmesa="+item.id_MESA,{},{ headers: this.headers,withCredentials:true }).subscribe(itemr => {
      if(itemr==1){
        //this.showNotification('top', 'center', 3, "<h3>Mesa abierta con <b>EXITO.</b></h3> ", 'info');
        this.httpClient.get(Urlbase.facturacion + "/billing/getPedidosMesa?id_store="+this.sessionManager.returnIdStore()+"&id_bill_type="+86+"&id_bill_state="+801,{ headers: this.headers,withCredentials:true }).subscribe(response => {
          //@ts-ignore
          this.tableList = response;
          this.goToDetail(item);
        })
      }
    })
  }

  getStoreName(){
    return this.sessionManager.returnStoreName();
  }
}
