import { element } from 'protractor';
import { DatePipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LocalStorage } from 'src/app/services/localStorage';
import { Urlbase } from 'src/app/shared/urls';
import { AddProductosMesa2Component } from '../add-productos-mesa2/add-productos-mesa2.component';
import { SelectCancelAdminComponent } from '../select-cancel-admin/select-cancel-admin.component';
import * as jQuery from 'jquery';
import 'bootstrap-notify';
let $: any = jQuery;


@Component({
  selector: 'app-facturar-mesas2',
  templateUrl: './facturar-mesas2.component.html',
  styleUrls: ['./facturar-mesas2.component.css']
})
export class FacturarMesas2Component implements OnInit {

  constructor(public dialogRef: MatDialogRef<FacturarMesas2Component>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private httpClient: HttpClient,
              public locStorage: LocalStorage,
              public datePipe: DatePipe,
              public dialog: MatDialog,) { }

  productListToShow = [];
  productList = [];
  setStatus = "1501";
  notas = "";
  ngOnInit(): void {
    this.httpClient.get(Urlbase.facturacion + "/billing/getProductosPedidoMesa?id_bill="+this.data.item.id_BILL).subscribe(response => {
      console.log(response)
      //@ts-ignore
      this.productList = response;
      //@ts-ignore
      this.productListToShow = response.filter(i => i.ownbarcode !== '45000198');

      console.log(!this.disabledComanda())
    })
  }


  send(){
    let item = this.elementToUse;

    console.log(this.locStorage.getToken());
    //@ts-ignore
    console.log(item.estado!="CANCELADO");
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
    //@ts-ignore
    if((item.estado!="CANCELADO")){
      //@ts-ignore
      console.log(Urlbase.facturacion + "/billing/actualizarEstadoPedidoMesa?ID_DETALLE_DETAIL_BILL="+item.id_DETALLE_DETAIL_BILL+"&IDESTADODESTINO="+idestadofinal+"&notas="+this.notas+"&IDESTADOORIGEN="+idestadoorigen+"&IDTHIRDUSER="+this.locStorage.getToken().id_third+"&ACTOR=P");

      //@ts-ignore
      this.httpClient.post(Urlbase.facturacion + "/billing/actualizarEstadoPedidoMesa?ID_DETALLE_DETAIL_BILL="+item.id_DETALLE_DETAIL_BILL+"&IDESTADODESTINO="+idestadofinal+"&notas="+this.notas+"&IDESTADOORIGEN="+idestadoorigen+"&IDTHIRDUSER="+this.locStorage.getToken().id_third+"&ACTOR=P",{}).subscribe(response => {
        if(response == 1){
          this.dialogRef.close({color: color});
        }
      })
    }



  }

  getDateInMinutes(date){
    if(date == null){
      return null;
    }
    let today = new Date();
    let dif = today.getTime() - (new Date(date)).getTime();
    return Math.round((Math.round(dif/1000)/60))
  }

  closeDialog(){
    this.dialogRef.close();
  }


  elementToUse = { producto: "",
                   fecha_EVENTO: ""};
  eliminationOrEditDetail(item){
    this.elementToUse = item;
  }


  disabledComanda(){
    let suma = 0;
    for(let i=0;i<this.productListToShow.length;i++){
      let item = this.productListToShow[i];
      if(item.color == "AMARILLO"){
        suma++;
      }
    }
    if(!(suma>0) || this.productListToShow.length<=0){
      return true;
    }else{
      return false;
    }
  }


  printBill(){
    console.log("comanda");
    this.httpClient.get(Urlbase.facturacion+"/billing/PrintPdfTable?id_bill="+this.data.item.id_BILL+"&pdf=0&cash=0&restflag=1&mesa="+this.data.item.mesa,{responseType: 'text'}).subscribe(response =>{
      window.open(Urlbase.facturas+"/"+response, "_blank");
    })
  }


  disabled(){
    let sumaAmarillos = 0;
    let sumaNaranja = 0;
    for(let i=0;i<this.productList.length;i++){
      let item = this.productList[i];
      if(item.color == "AMARILLO"){
        sumaAmarillos++;
      }
      if(item.color == "NARANJA"){
        sumaNaranja++;
      }
    }
    if(sumaNaranja>0 || sumaAmarillos>0 || this.productList.length<=0){
      return true;
    }else{
      return false;
    }
  }


  facturarDisabled = false;
  nota = "";
  appCode = "";
  id_person = -1;
  async closeBill(){

    console.log("facturar");

    this.facturarDisabled = true;
    let idpayment = 1;


    let note = this.nota;
    let discount = 0;

    let detail = "{"+idpayment+","+this.data.item.totalprice+","+0+"}"
    console.log(this.locStorage.getToken());
    console.log(Urlbase.facturacion +"/billing/facturarPedidoMesa?idthirdemployee="+this.locStorage.getToken().id_third+"&idthird="+this.locStorage.getToken().id_third_father+"&idbilltype="+1+"&notes="+" "+this.data.item.mesa+" - Inicio  "+this.datePipe.transform(new Date(this.data.item.purchase_DATE),"HH:mm")+" - Fin    "+this.datePipe.transform(new Date(),"HH:mm")+" - Tiempo "+this.getDateInMinutes(this.data.item.purchase_DATE)+" Minutos - "+note+"&idthirddestinity="+this.id_person+"&idcaja="+this.locStorage.getIdCaja()+"&idstore="+this.locStorage.getIdStore()+"&idthirddomiciliario="+-888+"&idpaymentmethod="+idpayment+"&idwaytopay="+1+"&approvalcode="+this.appCode+"&idbankentity="+1+"&idbillstate="+1+"&detallesbill="+"test"+"&descuento="+discount+"&numdocumentoadicional="+123+"&idthirdvendedor="+-888+"&detallespago="+detail+"&idbillpedido="+this.data.item.id_BILL+"&nota="+" Mesa "+this.data.item.mesa_NUMBER+" - Fecha inicio: "+this.data.item.purchase_DATE+" - Fecha Finalizacion: "+this.datePipe.transform(new Date(),"dd/MM/yyyy HH:mm")+" - Tiempo Transcurrido: "+this.getDateInMinutes(this.data.item.purchase_DATE)+" Minutos - "+note+"&idthirduser="+this.locStorage.getToken().id_third+"&actor=P");
    this.httpClient.post(Urlbase.facturacion +"/billing/facturarPedidoMesa?idthirdemployee="+this.locStorage.getToken().id_third+"&idthird="+this.locStorage.getToken().id_third_father+"&idbilltype="+1+"&notes="+" "+this.data.item.mesa+" - Inicio  "+this.datePipe.transform(new Date(this.data.item.purchase_DATE),"HH:mm")+" - Fin    "+this.datePipe.transform(new Date(),"HH:mm")+" - Tiempo "+this.getDateInMinutes(this.data.item.purchase_DATE)+" Minutos - "+note+"&idthirddestinity="+this.id_person+"&idcaja="+this.locStorage.getIdCaja()+"&idstore="+this.locStorage.getIdStore()+"&idthirddomiciliario="+-888+"&idpaymentmethod="+idpayment+"&idwaytopay="+1+"&approvalcode="+this.appCode+"&idbankentity="+1+"&idbillstate="+1+"&detallesbill="+"test"+"&descuento="+discount+"&numdocumentoadicional="+123+"&idthirdvendedor="+-888+"&detallespago="+detail+"&idbillpedido="+this.data.item.id_BILL+"&nota="+" Mesa "+this.data.item.mesa_NUMBER+" - Fecha inicio: "+this.data.item.purchase_DATE+" - Fecha Finalizacion: "+this.datePipe.transform(new Date(),"dd/MM/yyyy HH:mm")+" - Tiempo Transcurrido: "+this.getDateInMinutes(this.data.item.purchase_DATE)+" Minutos - "+note+"&idthirduser="+this.locStorage.getToken().id_third+"&actor=P",{}).subscribe(result => {
      if(result != 0){
        console.log("THIS IS RESORT:",result);
        this.httpClient.get(Urlbase.facturacion+"/billing/UniversalPDF?id_bill="+result+"&pdf=0&cash=0&restflag=1&size="+false,{responseType: 'text'}).subscribe(response =>{
          window.open(Urlbase.facturas+"/"+response, "_blank");
          this.dialogRef.close();
          this.facturarDisabled = false;
        })
      }else{
        this.facturarDisabled = false;

      }
    },
    error => {this.facturarDisabled = false;})
  }

  openInventoryList(){

    const dialogRef = this.dialog.open(AddProductosMesa2Component, {
      width: '80vw',
      height: '80vh',
      data: {data: this.data}
    });

    dialogRef.afterClosed().subscribe(result => {

      this.ngOnInit();

    });

  }


  nextStatus(item){
    console.log(this.locStorage.getToken());
    console.log(item.estado!="CANCELADO");
    let idestadoorigen;
    let idestadofinal;
    if(item.estado=='CANCELADO'){
      idestadoorigen = 1599;
      idestadofinal = 1599;

      this.data.item.rojo--;
      this.data.item.rojo++;
    }
    if(item.estado=='ENTREGADO EN MESA'){
      idestadoorigen = 1503;
      idestadofinal = 1503
      this.data.item.azul--;
      this.data.item.azul++;
    }
    if(item.estado=='ENTREGADO A MESERO'){
      idestadoorigen = 1502;
      idestadofinal = 1503

      this.data.item.naranja--;
      this.data.item.azul++;
    }
    if(item.estado=='EN PROCESO'){
      idestadoorigen = 1501;
      idestadofinal = 1502

      this.data.item.amarillo--;
      this.data.item.naranja++;
    }
    if((item.estado!="CANCELADO")){
      console.log(Urlbase.facturacion + "/billing/actualizarEstadoPedidoMesa?ID_DETALLE_DETAIL_BILL="+item.id_DETALLE_DETAIL_BILL+"&IDESTADODESTINO="+idestadofinal+"&notas=' '&IDESTADOORIGEN="+idestadoorigen+"&IDTHIRDUSER="+this.locStorage.getToken().id_third+"&ACTOR=P");

      this.httpClient.post(Urlbase.facturacion + "/billing/actualizarEstadoPedidoMesa?ID_DETALLE_DETAIL_BILL="+item.id_DETALLE_DETAIL_BILL+"&IDESTADODESTINO="+idestadofinal+"&notas=' '&IDESTADOORIGEN="+idestadoorigen+"&IDTHIRDUSER="+this.locStorage.getToken().id_third+"&ACTOR=P",{}).subscribe(response => {
        console.log("STATUS: ", response)
        if(response == 1){
          this.httpClient.get(Urlbase.facturacion + "/billing/getProductosPedidoMesa?id_bill="+this.data.item.id_BILL).subscribe(response => {
            console.log("DATA: ",response)
            //@ts-ignore
            this.productList = response;
            //@ts-ignore
            this.productListToShow = response.filter(i => i.ownbarcode !== '45000198');
          })
        }
      })
    }

  }



  cancelTable(){
    console.log("cancel");
    if(this.locStorage.getRol()[0].id_rol == 23 || this.locStorage.getRol()[0].id_rol == 21){

      this.httpClient.post(Urlbase.facturacion +"/billing/actualizarEstadoMesa?IDBILL="+this.data.item.id_BILL+"&IDESTADODESTINO="+99+"&nota="+this.nota+"&IDESTADOORIGEN="+801+"&IDTHIRDUSER="+this.locStorage.getToken().id_third+"&ACTOR=P",{}).subscribe(result => {
        if(result == 1){
          this.dialogRef.close();
        }else{
          this.showNotification('top', 'center', 3, "<h3>Se presento un error al cancelar la mesa.</h3> ", 'danger');
        }
      })

    }
    else{
      if(this.locStorage.getIdStore()== 45001 || this.locStorage.getIdStore()== 46803){
        const dialogRef = this.dialog.open(SelectCancelAdminComponent, {
          maxWidth: '80vw',
          maxHeight: '70vh',
          minWidth: '60vw',
          minHeight: '50vh',

          data: {
                  idbill: this.data.idbill,
                  state: 99,
                  notes: this.nota,
                  originState: 801,
                  idthird: this.locStorage.getToken().id_third,
                  idStore: this.locStorage.getIdStore(),
                  rol: this.locStorage.getRol()[0].id_rol
                }
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log("RESULT IS: ", result.resp)
          if(result.resp == 1){
            this.dialogRef.close();
          }
        });
    }else{
      this.httpClient.post(Urlbase.facturacion +"/billing/actualizarEstadoMesa?IDBILL="+this.data.item.id_BILL+"&IDESTADODESTINO="+99+"&nota="+this.nota+"&IDESTADOORIGEN="+801+"&IDTHIRDUSER="+this.locStorage.getToken().id_third+"&ACTOR=P",{}).subscribe(result => {
        if(result == 1){
          this.dialogRef.close();
        }else{
          this.showNotification('top', 'center', 3, "<h3>Se presento un error al cancelar la mesa.</h3> ", 'danger');
        }
      })
    }

    }

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




}
