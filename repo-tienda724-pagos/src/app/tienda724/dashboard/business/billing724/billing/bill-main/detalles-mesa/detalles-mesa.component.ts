import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LocalStorage } from 'src/app/services/localStorage';
import { Urlbase } from 'src/app/shared/urls';
import { EditarPedidoRestauranteComponent } from '../editar-pedido-restaurante/editar-pedido-restaurante.component';
import { EditarPedidoComponent } from '../editar-pedido/editar-pedido.component';
import { ModalConfirmarCancelacionPedidoComponent } from '../modal-confirmar-cancelacion-pedido/modal-confirmar-cancelacion-pedido.component';
let $: any = jQuery;
import * as jQuery from 'jquery';
import 'bootstrap-notify';
import { ThirdselectComponent } from '../../thirdselect/thirdselect.component';
import { ClientData } from '../../models/clientData';
import { GenerateThirdComponent2Component } from '../generate-third-component2/generate-third-component2.component';
import { detailDataBound } from '@syncfusion/ej2-angular-treegrid';
import { ScrollingModule } from '@angular/cdk/scrolling';
import { EditarMeseroComponent } from '../editar-mesero/editar-mesero.component';
import { DatePipe } from '@angular/common';
import { SelectCancelAdminComponent } from '../select-cancel-admin/select-cancel-admin.component';
import { NotesComandaComponent } from '../notes-comanda/notes-comanda.component';
@Component({
  selector: 'app-detalles-mesa',
  templateUrl: './detalles-mesa.component.html',
  styleUrls: ['./detalles-mesa.component.css']
})
export class DetallesMesaComponent implements OnInit {

  constructor(public datePipe: DatePipe,public dialogRef: MatDialogRef<DetallesMesaComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private httpClient: HttpClient,
    public locStorage: LocalStorage,
    public dialog: MatDialog,) {
      this.headers = new HttpHeaders({
        'Content-Type':  'application/json',
        'Authorization':  this.locStorage.getTokenValue(),
      });
     }

    private readonly headers = new HttpHeaders({ 'Content-Type': 'application/json' });

    productList = [];

    displayedColumns = ['producto', 'notas', 'estado', 'fecha', 'opciones'];


    openDialogEditMeserio(){
      const dialogRef = this.dialog.open(EditarMeseroComponent, {
        width: '60vw',
        height: '33vh',

        data: { item: this.data }
      });

      dialogRef.afterClosed().subscribe(result => {
        console.log("THIS IS RESULT: ",result.meseroNew);
        this.data.item.mesero = result.meseroNew[0].domiciliario;
        this.data.item.id_THIRD_DOMICILIARIO = result.meseroNew[0].id_THIRD_DOMICILIARIO;

      });
    }



  productListToShow = [];
  rolesCajeros;
  ngOnInit(): void {
    this.rolesCajeros = this.locStorage.getRol().filter(element => this.locStorage.getListRolesCajeros().includes(element.id_rol) )
    console.log("this object: ", this.data)
    this.httpClient.get(Urlbase.facturacion + "/billing/getProductosPedidoMesa?id_bill="+this.data.idbill).subscribe(response => {
      console.log("DATA: ",response)
      //@ts-ignore
      this.productList = response;
      //@ts-ignore
      this.productListToShow = response.filter(i => i.ownbarcode !== '45000198');
    })
  }

  getDateInMinutes(date){
    if(date == null){
      return null;
    }
    let today = new Date();
    let dif = today.getTime() - (new Date(date)).getTime();
    return Math.round((Math.round(dif/1000)/60))
  }

  wayToPay = "contado";
  paymentMethod="";
  clickedOn(method){
    this.paymentMethod = method;
  }

  id_person = -888;
  ccClient = "";
  cliente= "";
  clientData = new ClientData(true, 'Cliente Ocacional', '--', '000', 'N/A', '000', 'N/A', null);
  id_directory = 0;

  searchClient2(){
    this.id_person=0;

    const identificacionCliente = this.ccClient;
    let aux;
    if(identificacionCliente.length>4){
    this.httpClient.get<any[]>(Urlbase.tercero + '/persons/search?doc_person='+String(identificacionCliente),{ headers: this.headers }).subscribe(data =>{
      if (data.length == 0){
        this.openDialogClient2();
        // this.searchClient(event);
      }else{
        const dialogRef = this.dialog.open(ThirdselectComponent, {
          width: '60vw',
          height: '80vh',

          data: { thirdList: data }
        });

        dialogRef.afterClosed().subscribe(result => {
          if(result){

            aux = this.locStorage.getPersonClient();
            this.cliente = aux.fullname;
            this.clientData.is_natural_person = true;
            this.clientData.fullname = aux.fullname;
            this.clientData.document_type = aux.document_TYPE;
            this.clientData.document_number = aux.document_NUMBER;
            this.clientData.id_third = aux.id_PERSON;
            this.clientData.address = aux.address;
            this.clientData.email = aux.city;
            this.clientData.phone = aux.phone;
            this.id_directory = aux.id_DIRECTORY;
            this.id_person = aux.id_PERSON;

          }
        });


      }


    });

  }else{
    this.showNotification('top', 'center', 3, "<h3>El elemento de busqueda debe ser de longitud mayor a 4.</h3> ", 'danger');
  }
  }

  nota = '';
  appCode = '';
  discount = 0;
  facturarDisabled = false;
  async closeBill(){

    this.facturarDisabled = true;
    let idpayment = 1;
    if(this.wayToPay == "contado"){
      idpayment = 1;
    }

    if(this.wayToPay == "debito"){
      idpayment = 2;
    }

    if(this.wayToPay == "credito"){
      idpayment = 3;
    }

    let note = this.nota;
    let discount = this.discount;

    let detail = "{"+idpayment+","+this.data.item.totalprice+","+0+"}"
    console.log(this.locStorage.getToken());
    console.log(Urlbase.facturacion +"/billing/facturarPedidoMesa?idthirdemployee="+this.locStorage.getToken().id_third+"&idthird="+this.locStorage.getToken().id_third_father+"&idbilltype="+1+"&notes="+" "+this.data.item.mesa+" - Inicio  "+this.datePipe.transform(new Date(this.data.item.purchase_DATE),"HH:mm")+" - Fin    "+this.datePipe.transform(new Date(),"HH:mm")+" - Tiempo "+this.getDateInMinutes(this.data.item.purchase_DATE)+" Minutos - "+note+"&idthirddestinity="+this.id_person+"&idcaja="+this.locStorage.getIdCaja()+"&idstore="+this.locStorage.getIdStore()+"&idthirddomiciliario="+-888+"&idpaymentmethod="+idpayment+"&idwaytopay="+1+"&approvalcode="+this.appCode+"&idbankentity="+1+"&idbillstate="+1+"&detallesbill="+"test"+"&descuento="+discount+"&numdocumentoadicional="+123+"&idthirdvendedor="+-888+"&detallespago="+detail+"&idbillpedido="+this.data.idbill+"&nota="+" Mesa "+this.data.item.mesa_NUMBER+" - Fecha inicio: "+this.data.item.purchase_DATE+" - Fecha Finalizacion: "+this.datePipe.transform(new Date(),"dd/MM/yyyy HH:mm")+" - Tiempo Transcurrido: "+this.getDateInMinutes(this.data.item.purchase_DATE)+" Minutos - "+note+"&idthirduser="+this.locStorage.getToken().id_third+"&actor=P");
    this.httpClient.post(Urlbase.facturacion +"/billing/facturarPedidoMesa?idthirdemployee="+this.locStorage.getToken().id_third+"&idthird="+this.locStorage.getToken().id_third_father+"&idbilltype="+1+"&notes="+" "+this.data.item.mesa+" - Inicio  "+this.datePipe.transform(new Date(this.data.item.purchase_DATE),"HH:mm")+" - Fin    "+this.datePipe.transform(new Date(),"HH:mm")+" - Tiempo "+this.getDateInMinutes(this.data.item.purchase_DATE)+" Minutos - "+note+"&idthirddestinity="+this.id_person+"&idcaja="+this.locStorage.getIdCaja()+"&idstore="+this.locStorage.getIdStore()+"&idthirddomiciliario="+-888+"&idpaymentmethod="+idpayment+"&idwaytopay="+1+"&approvalcode="+this.appCode+"&idbankentity="+1+"&idbillstate="+1+"&detallesbill="+"test"+"&descuento="+discount+"&numdocumentoadicional="+123+"&idthirdvendedor="+-888+"&detallespago="+detail+"&idbillpedido="+this.data.idbill+"&nota="+" Mesa "+this.data.item.mesa_NUMBER+" - Fecha inicio: "+this.data.item.purchase_DATE+" - Fecha Finalizacion: "+this.datePipe.transform(new Date(),"dd/MM/yyyy HH:mm")+" - Tiempo Transcurrido: "+this.getDateInMinutes(this.data.item.purchase_DATE)+" Minutos - "+note+"&idthirduser="+this.locStorage.getToken().id_third+"&actor=P",{}).subscribe(result => {
      if(result != 0){
        console.log("THIS IS RESORT:",result);
        this.httpClient.get(Urlbase.facturacion+"/billing/UniversalPDF?id_bill="+result+"&pdf=0&cash=0&restflag=1&size="+false,{responseType: 'text'}).subscribe(response =>{
          window.open(Urlbase.facturas+"/"+response, "_blank");
          this.dialogRef.close();
          this.facturarDisabled = false;
        })
      }else{
        this.facturarDisabled = false;
        this.showNotification('top', 'center', 3, "<h3>Se presento un problema al facturar la mesa.</h3> ", 'danger');

      }
    },
    error => {this.facturarDisabled = false;})
  }



  async printBill(){

    console.log(this.data.item.mesa)
    this.facturarDisabled = true;
    let idpayment = 1;
    if(this.wayToPay == "contado"){
      idpayment = 1;
    }

    if(this.wayToPay == "debito"){
      idpayment = 2;
    }

    if(this.wayToPay == "credito"){
      idpayment = 3;
    }

    let note = this.nota;
    let discount = this.discount;

    let detail = "{"+idpayment+","+this.data.item.totalprice+","+0+"}"
    console.log(this.locStorage.getToken());
        this.httpClient.get(Urlbase.facturacion+"/billing/PrintPdfTable?id_bill="+this.data.idbill+"&pdf=0&cash=0&restflag=1&mesa="+this.data.item.mesa,{responseType: 'text'}).subscribe(response =>{
          window.open(Urlbase.facturas+"/"+response, "_blank");
          this.dialogRef.close();
          this.facturarDisabled = false;
        })
  }


  openNotes(element){
    const dialogRef = this.dialog.open(NotesComandaComponent, {
      width: 'auto',
      height: 'auto',
      maxHeight: '60vw',
      maxWidth:'80vh',
      data: { element: element }
    });

    dialogRef.afterClosed().subscribe(result => {
       })
  }


  searchClient(event){
    this.id_person=0;
    const identificacionCliente = String(event.target.value);
    let aux;
    if(identificacionCliente.length>4){
    this.httpClient.get<any[]>(Urlbase.tercero + '/persons/search?doc_person='+String(identificacionCliente),{ headers: this.headers }).subscribe(data =>{
      if (data.length == 0){
        this.openDialogClient2();
        // this.searchClient(event);
      }else{
        const dialogRef = this.dialog.open(ThirdselectComponent, {
          width: '60vw',
          height: '80vh',

          data: { thirdList: data }
        });

        dialogRef.afterClosed().subscribe(result => {
          if(result){

            aux = this.locStorage.getPersonClient();
            this.cliente = aux.fullname;
            this.clientData.is_natural_person = true;
            this.clientData.fullname = aux.fullname;
            this.clientData.document_type = aux.document_TYPE;
            this.clientData.document_number = aux.document_NUMBER;
            this.clientData.id_third = aux.id_PERSON;
            this.clientData.address = aux.address;
            this.clientData.email = aux.city;
            this.clientData.phone = aux.phone;
            this.id_directory = aux.id_DIRECTORY;
            this.id_person = aux.id_PERSON;

          }
        });
      }


    });
  }else{
    this.showNotification('top', 'center', 3, "<h3>El elemento de busqueda debe ser de longitud mayor a 4.</h3> ", 'danger');
  }
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




  openAddDetails() {
    const dialogRef = this.dialog.open(EditarPedidoRestauranteComponent, {
      width: '60vw',
      height: '750px',
      data: { item: this.data}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.ngOnInit();
    });
  }

  cancel(item){

    const dialogRef = this.dialog.open(ModalConfirmarCancelacionPedidoComponent, {
      width: '60vw',
      data: { item: item}
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.response){
        console.log(this.locStorage.getToken());
        console.log(item.estado!="CANCELADO");
        let idestadoorigen;
        if(item.estado=='CANCELADO'){
          idestadoorigen = 1599;
        }
        if(item.estado=='ENTREGADO EN MESA'){
          idestadoorigen = 1503;
          this.data.item.azul--;
        }
        if(item.estado=='ENTREGADO A MESERO'){
          idestadoorigen = 1502;
          this.data.item.naranja--;
        }
        if(item.estado=='EN PROCESO'){
          idestadoorigen = 1501;
          this.data.item.amarillo--;
        }
        if((item.estado!="CANCELADO")){
          this.httpClient.post(Urlbase.facturacion + "/billing/actualizarEstadoPedidoMesa?ID_DETALLE_DETAIL_BILL="+item.id_DETALLE_DETAIL_BILL+"&IDESTADODESTINO="+1599+"&notas="+result.notas+"'&IDESTADOORIGEN="+idestadoorigen+"&IDTHIRDUSER="+this.locStorage.getToken().id_third+"&ACTOR=Mesero",{}).subscribe(response => {
            if(response == 1){
              this.httpClient.get(Urlbase.facturacion + "/billing/getProductosPedidoMesa?id_bill="+this.data.idbill).subscribe(response => {
                console.log("DATA: ",response)
                //@ts-ignore
                this.productList = response;
                //@ts-ignore
                this.productListToShow = response.filter(i => i.ownbarcode !== '45000198');
                this.data.item.rojo--;
              })
            }
          })
        }
      }
    });

  }

  editStatus(item){

      const dialogRef = this.dialog.open(EditarPedidoComponent, {
        width: '60vw',
        data: { item: item}
      });

      dialogRef.afterClosed().subscribe(result => {
        if(result.color=="azul"){this.data.item.azul++;}
        if(result.color=="rojo"){this.data.item.rojo++;}
        if(result.color=="naranja"){this.data.item.naranja++;}
        if(result.color=="amarillo"){this.data.item.amarillo++;}

        if(item.estado=='CANCELADO'){
        }
        if(item.estado=='ENTREGADO EN MESA'){
          this.data.item.azul--;
        }
        if(item.estado=='ENTREGADO A MESERO'){
          this.data.item.naranja--;
        }
        if(item.estado=='EN PROCESO'){
          this.data.item.amarillo--;
        }

        this.httpClient.get(Urlbase.facturacion + "/billing/getProductosPedidoMesa?id_bill="+this.data.idbill).subscribe(response => {
          console.log("DATA: ",response)
          //@ts-ignore
          this.productList = response;
          //@ts-ignore
          this.productListToShow = response.filter(i => i.ownbarcode !== '45000198');
        })
      });


  }



  cancelTable(){
    if(this.locStorage.getRol()[0].id_rol == 23 || this.locStorage.getRol()[0].id_rol == 21){

      this.httpClient.post(Urlbase.facturacion +"/billing/actualizarEstadoMesa?IDBILL="+this.data.idbill+"&IDESTADODESTINO="+99+"&nota="+this.nota+"&IDESTADOORIGEN="+801+"&IDTHIRDUSER="+this.locStorage.getToken().id_third+"&ACTOR=P",{}).subscribe(result => {
        if(result == 1){
          this.dialogRef.close();
        }else{
          this.showNotification('top', 'center', 3, "<h3>Se presento un error al cancelar la mesa.</h3> ", 'danger');
        }
      })

    }else{
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
      this.httpClient.post(Urlbase.facturacion +"/billing/actualizarEstadoMesa?IDBILL="+this.data.idbill+"&IDESTADODESTINO="+99+"&nota="+this.nota+"&IDESTADOORIGEN="+801+"&IDTHIRDUSER="+this.locStorage.getToken().id_third+"&ACTOR=P",{}).subscribe(result => {
        if(result == 1){
          this.dialogRef.close();
        }else{
          this.showNotification('top', 'center', 3, "<h3>Se presento un error al cancelar la mesa.</h3> ", 'danger');
        }
      })
    }

    }

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
          this.httpClient.get(Urlbase.facturacion + "/billing/getProductosPedidoMesa?id_bill="+this.data.idbill).subscribe(response => {
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


  getNota(StringInput){
    if(StringInput.notas){
    let list = StringInput.notas.split(";");
    let stringItem = "";
    for(let i=0;i<list.length;i++){
      let item = list[i];
      if(item||item==='undefined'){
        stringItem+=item.split("=")[1]+";";
      }
    }
    if(stringItem == null){
      return '';
    }
    if(stringItem.length > 40){
      return stringItem.substring(0,40);
    }
      return stringItem;
    }else{
      return "";
    }
  }




  disabled(){
    let sumaAmarillos = 0;
    let sumaNaranja = 0;
    for(let i=0;i<this.productList.length;i++){
      let item = this.productList[i];
      console.log(item.color)
      if(item.color == "AMARILLO"){
        sumaAmarillos++;
      }
      if(item.color == "NARANJA"){
        sumaNaranja++;
      }
    }
    if(sumaNaranja>0 || sumaAmarillos>0 || this.facturarDisabled || this.productList.length<=0){
      return true;
    }else{
      return false;
    }
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

}
