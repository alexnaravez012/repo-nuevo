import { SessionManagerService } from './../../services/sessionManager/session-manager.service';
import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Urlbase } from '../../classes/urls';

@Component({
  selector: 'app-detail-mesa',
  templateUrl: './detail-mesa.component.html',
  styleUrls: ['./detail-mesa.component.scss']
})
export class DetailMesaComponent implements OnInit {

  constructor(private router: Router,
              private sessionManager : SessionManagerService,
              private httpClient: HttpClient,
              public datePipe: DatePipe,) { }
  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });
  objMesa: any;
  obj: any;
  productList: any;
  productListToShow: any;
  nota:any="";
  rolList:any;
  username:any;
  clientName:any;
  setStatus:any;
  productToEdit:any={
    producto: "",
    fecha_EVENTO: ""
  };
  facturarDisabled:any = false;
  appCode:any = "";
  id_person:any = -1;

  ngOnInit(): void {
    this.objMesa = this.sessionManager.returnMesa();
    this.obj = this.sessionManager.returnIdObject();
    this.rolList = this.obj.roles;
    this.clientName = this.obj.third.fullname;
    this.username = this.obj.usuario;
    this.httpClient.get(Urlbase.facturacion + "/billing/getProductosPedidoMesa?id_bill="+this.objMesa.id_BILL,{ headers: this.headers,withCredentials:true }).subscribe(response => {
      //@ts-ignore
      this.productList = response;
      //@ts-ignore
      this.productListToShow = response.filter(i => i.ownbarcode !== '45000198');
    })
  }


  goMenu(){
    this.router.navigate(['menu']);
  }


  logOut(){
    localStorage.removeItem("ID");
    localStorage.removeItem("idStore");
    localStorage.removeItem("mesa");
    localStorage.removeItem("storeName");
    localStorage.removeItem("ID_CAJA");
    this.router.navigate(['login']);
  }


  getRolString(){
    let response = "";
    this.rolList.forEach((i: { rol: string; }) => {
      response = response + i.rol+"/ "
    });
    return response;
  }


  regresarAMesas(){
    this.sessionManager.deleteMesa();
    this.router.navigate(['adminrestaurant']);
  }



  nextStatus(item:any){
    let idestadoorigen;
    let idestadofinal;
    if(item.estado=='CANCELADO'){
      idestadoorigen = 1599;
      idestadofinal = 1599;

      this.objMesa.rojo--;
      this.objMesa.rojo++;
    }
    if(item.estado=='ENTREGADO EN MESA'){
      idestadoorigen = 1503;
      idestadofinal = 1503
      this.objMesa.azul--;
      this.objMesa.azul++;
    }
    if(item.estado=='ENTREGADO A MESERO'){
      idestadoorigen = 1502;
      idestadofinal = 1503

      this.objMesa.naranja--;
      this.objMesa.azul++;
    }
    if(item.estado=='EN PROCESO'){
      idestadoorigen = 1501;
      idestadofinal = 1502

      this.objMesa.amarillo--;
      this.objMesa.naranja++;
    }
    if((item.estado!="CANCELADO")){

      this.httpClient.post(Urlbase.facturacion + "/billing/actualizarEstadoPedidoMesa?ID_DETALLE_DETAIL_BILL="+item.id_DETALLE_DETAIL_BILL+"&IDESTADODESTINO="+idestadofinal+"&notas=' '&IDESTADOORIGEN="+idestadoorigen+"&IDTHIRDUSER="+this.obj.id_third+"&ACTOR=P",{},{ headers: this.headers,withCredentials:true }).subscribe(response => {
        if(response == 1){
          this.httpClient.get(Urlbase.facturacion + "/billing/getProductosPedidoMesa?id_bill="+this.objMesa.id_BILL,{ headers: this.headers,withCredentials:true }).subscribe(response => {
            //@ts-ignore
            this.productList = response;
            //@ts-ignore
            this.productListToShow = response.filter(i => i.ownbarcode !== '45000198');
          })
        }
      })
    }

  }

  getDateInMinutes(date:any){
    if(date == null){
      return null;
    }
    let today = new Date();
    let dif = today.getTime() - (new Date(date)).getTime();
    return Math.round((Math.round(dif/1000)/60))
  }

  getStoreName(){
    return this.sessionManager.returnStoreName();
  }


  cancelTable(){
      if(this.obj.roles[0].id_rol == 23 || this.obj.roles[0].id_rol == 21){

      this.httpClient.post(Urlbase.facturacion +"/billing/actualizarEstadoMesa?IDBILL="+this.objMesa.id_BILL+"&IDESTADODESTINO="+99+"&nota="+this.nota+"&IDESTADOORIGEN="+801+"&IDTHIRDUSER="+this.obj.id_third+"&ACTOR=P",{},{ headers: this.headers,withCredentials:true }).subscribe(result => {
        if(result == 1){
          //this.dialogRef.close();
          this.router.navigate(['adminrestaurant']);
          localStorage.removeItem("mesa");
        }else{
          alert("Se presento un error al cancelar la mesa");
        }
      })

    }
  //   else{
  //     if(this.locStorage.getIdStore()== 45001 || this.locStorage.getIdStore()== 46803){
  //       const dialogRef = this.dialog.open(SelectCancelAdminComponent, {
  //         maxWidth: '80vw',
  //         maxHeight: '70vh',
  //         minWidth: '60vw',
  //         minHeight: '50vh',

  //         data: {
  //                 idbill: this.data.idbill,
  //                 state: 99,
  //                 notes: this.nota,
  //                 originState: 801,
  //                 idthird: this.locStorage.getToken().id_third,
  //                 idStore: this.locStorage.getIdStore(),
  //                 rol: this.locStorage.getRol()[0].id_rol
  //               }
  //       });

  //       dialogRef.afterClosed().subscribe(result => {
  //         console.log("RESULT IS: ", result.resp)
  //         if(result.resp == 1){
  //           this.dialogRef.close();
  //         }
  //       });
  //   }else{
  //     this.httpClient.post(Urlbase.facturacion +"/billing/actualizarEstadoMesa?IDBILL="+this.data.item.id_BILL+"&IDESTADODESTINO="+99+"&nota="+this.nota+"&IDESTADOORIGEN="+801+"&IDTHIRDUSER="+this.locStorage.getToken().id_third+"&ACTOR=P",{}).subscribe(result => {
  //       if(result == 1){
  //         this.dialogRef.close();
  //       }else{
  //         // this.showNotification('top', 'center', 3, "<h3>Se presento un error al cancelar la mesa.</h3> ", 'danger');
  //       }
  //     })
  //   }

  //   }

  }


  setProductToEdit(product: any){
    console.log(product);
    this.setStatus = product.id_BILL_STATE;
    this.productToEdit = product;
  }


  send(){
    let item = this.productToEdit;



    let idestadoorigen;
    let idestadofinal;
    idestadofinal = this.setStatus;
    //@ts-ignore
    if(item.estado=='CANCELADO'){
      idestadoorigen = 1599;
    }
    //@ts-ignore
    if(item.estado=='ENTREGADO EN MESA'){
      idestadoorigen = 1503;
    }
    //@ts-ignore
    if(item.estado=='ENTREGADO A MESERO'){
      idestadoorigen = 1502;
    }
    //@ts-ignore
    if(item.estado=='EN PROCESO'){
      idestadoorigen = 1501;
    }

    let color = "azul";
    if(idestadofinal==1599){
      color = "rojo"
    }
    if(idestadofinal==1503){
      color = "azul";
    }
    if(idestadofinal==1501){
      color = "amarillo"
    }
    if(idestadofinal==1502){
      color = "naranja"
    }

    if((item.estado!="CANCELADO")){
      //@ts-ignore
      this.httpClient.post(Urlbase.facturacion + "/billing/actualizarEstadoPedidoMesa?ID_DETALLE_DETAIL_BILL="+item.id_DETALLE_DETAIL_BILL+"&IDESTADODESTINO="+idestadofinal+"&notas="+this.notas+"&IDESTADOORIGEN="+idestadoorigen+"&IDTHIRDUSER="+this.obj.id_third+"&ACTOR=P",{},{ headers: this.headers,withCredentials:true }).subscribe(response => {
        if(response == 1){
          this.httpClient.get(Urlbase.facturacion + "/billing/getProductosPedidoMesa?id_bill="+this.objMesa.id_BILL,{ headers: this.headers,withCredentials:true }).subscribe(response => {
            //@ts-ignore
            this.productList = response;
            //@ts-ignore
            this.productListToShow = response.filter(i => i.ownbarcode !== '45000198');
          })
        }
      })
    }



  }


  goToAddProducts(){
    this.router.navigate(['addproductsmesa']);
  }



  closeBill(){

    console.log("facturar");

    this.facturarDisabled = true;
    let idpayment = 1;


    let note = this.nota;
    let discount = 0;

    let detail = "{"+idpayment+","+this.objMesa.totalprice+","+0+"}"
    this.httpClient.post(Urlbase.facturacion +"/billing/facturarPedidoMesa?idthirdemployee="+this.obj.id_third+"&idthird="+this.obj.id_third_father+"&idbilltype="+1+"&notes="+" "+this.objMesa.mesa+" - Inicio  "+this.datePipe.transform(new Date(this.objMesa.purchase_DATE),"HH:mm")+" - Fin    "+this.datePipe.transform(new Date(),"HH:mm")+" - Tiempo "+this.getDateInMinutes(this.objMesa.purchase_DATE)+" Minutos - "+note+"&idthirddestinity="+this.id_person+"&idcaja="+1+"&idstore="+this.sessionManager.returnIdStore()+"&idthirddomiciliario="+-888+"&idpaymentmethod="+idpayment+"&idwaytopay="+1+"&approvalcode="+this.appCode+"&idbankentity="+1+"&idbillstate="+1+"&detallesbill="+"test"+"&descuento="+discount+"&numdocumentoadicional="+123+"&idthirdvendedor="+-888+"&detallespago="+detail+"&idbillpedido="+this.objMesa.id_BILL+"&nota="+" Mesa "+this.objMesa.mesa_NUMBER+" - Fecha inicio: "+this.objMesa.purchase_DATE+" - Fecha Finalizacion: "+this.datePipe.transform(new Date(),"dd/MM/yyyy HH:mm")+" - Tiempo Transcurrido: "+this.getDateInMinutes(this.objMesa.purchase_DATE)+" Minutos - "+note+"&idthirduser="+this.obj.id_third+"&actor=P",{}).subscribe(result => {
      if(result != 0){
        this.httpClient.get(Urlbase.facturacion+"/billing/UniversalPDF?id_bill="+result+"&pdf=0&cash=0&restflag=1&size="+false,{responseType: 'text'}).subscribe(response =>{
          window.open(Urlbase.facturas+"/"+response, "_blank");
          //this.dialogRef.close();
          this.facturarDisabled = false;
        })
      }else{
        this.facturarDisabled = false;

      }
    },
    error => {this.facturarDisabled = false;})
  }

}
