import {Component, Inject, OnInit, ViewChild, ElementRef} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import {Urlbase} from '../../../../../../../../app/shared/urls';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {ClientData} from '../../models/clientData';
import {BillingService} from '../../../../../../../services/billing.service';
import {LocalStorage} from '../../../../../../../services/localStorage';
import {GenerateThirdComponentComponent} from '../../bill-main/generate-third-component/generate-third-component.component';
import {CurrencyPipe} from '@angular/common';
import {GenerateThirdComponent2Component} from '../generate-third-component2/generate-third-component2.component';
import {ThirdselectComponent} from '../../thirdselect/thirdselect.component';
import 'bootstrap-notify';
import * as jQuery from 'jquery';
import { SelectCancelAdminDisccountComponent } from '../select-cancel-admin-disccount/select-cancel-admin-disccount.component';
let $: any = jQuery;

@Component({
  selector: 'app-transaction-confirm-dialog2',
  templateUrl: './transaction-confirm-dialog2.component.html',
  styleUrls: ['./transaction-confirm-dialog2.component.scss']
})
export class TransactionConfirmDialog2Component implements OnInit{
  ccClient="";
  showedCash = '';
  Urlbase = Urlbase;
  private options;
  public cash:number;
  public wayToPay='contado';
  public creditBank= '';
  public debitBank= '';
  public observations='';
  public transactionCode = ' ';
  public paymentMethod = 'efectivo';
  public cliente = "Ocasional";
  public id_person;
  public sum = true;

  public clientData = new ClientData(true, 'Cliente Ocasional', ' ', ' ', ' ', ' ', ' ',null);
  directoryList: any;
  api_uri = Urlbase.tercero;
  personList: any;
  private readonly headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  disccountPercent = 0;
  disccount = 0;

  @ViewChild('input1') inputOne: ElementRef;

  constructor(public currencyPipe: CurrencyPipe, private billingService: BillingService, private httpClient: HttpClient, private locStorage: LocalStorage,
    public dialogRef: MatDialogRef<TransactionConfirmDialog2Component>,public dialog: MatDialog
    ,@Inject(MAT_DIALOG_DATA) public data: DialogData) {

    this.headers = new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization':  this.locStorage.getTokenValue(),
    });

    let token = localStorage.getItem('currentUser');

    this.options = { headers: this.headers };

  }

  Number(stringElem){
    return Number(stringElem);
  }


  efectivoValidation(){
    if (this.paymentDetailList.filter(e => e.medio == 1).length > 0 && this.newMedio == 1) {
      return;
    }else{
      this.addElement();
    }
  }


  paymentDetailList = [];

  deleteElement(item){
    this.paymentDetailList.forEach((element,index)=>{
      if(element.id==item) this.paymentDetailList.splice(index,1);
   });
    console.log(this.paymentDetailList);
  }

  newMedio=1;
  newTipo=1;
  newValor=this.data.total;
  newConfCode="";

  addElement(){
    let id = 0;
    try{
      id = this.paymentDetailList[this.paymentDetailList.length-1].id+1;
    }catch(element){
      id = 0;
    }
    this.paymentDetailList.push({id: id,tipo: this.newTipo, medio: this.newMedio, valor: this.newValor, cod: this.newConfCode})
    if(this.newMedio == 1){
      this.newMedio=2;
    }else{
      this.newMedio=1;
    }
    this.newTipo=1;
    //@ts-ignore
    this.newValor=0;
    this.newConfCode="";
  }

  ngOnInit() {
    CPrint("I NEED THIS DATA,",this.data.total);
    this.cash=this.roundnum(this.data.total);
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
  }

  selectInput() {
    const inputElem = <HTMLInputElement>this.inputOne.nativeElement;
    inputElem.select();
  }

  calcPercent(){
    if(this.disccount>=this.roundnum(this.data.total)){
      this.disccount=this.roundnum(this.data.total);

    }

    if(this.disccount<=0){
      this.disccount=0;
    }

    this.disccountPercent = Math.round((this.disccount*100)/this.roundnum(this.data.total)*10)/10;
  }

  calcDiscount(){
    if(this.disccountPercent>=100){
      this.disccountPercent=100;

    }

    if(this.disccountPercent<=0){
      this.disccountPercent=0;
    }

    this.disccount = (this.disccountPercent*this.roundnum(this.data.total))/100;
  }


  getStringAsNum(string){
    return parseFloat(string);
  }

  add(number){
    this.cash+=number;
  }

  remove(number){
    this.cash-=number;
  }

  setCash(num){
    this.cash=num;
    this.sum=true;
  }

  disableButton(){
    return this.roundnum(Number(this.data.total)) > this.cash;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  clickedOn(method){
    this.paymentMethod = method;
  }

  roundnum(num){
    return Math.round(num) ;
    }

  returnData(){
    let element = this.paymentDetailList[0];

    //efectivo
    if(element.medio==1){
      this.paymentMethod = "efectivo";
      this.cash = element.valor;
      this.transactionCode = element.cod;
    }

    //debito
    if(element.medio==2){
      this.paymentMethod = "debito";
      this.debitBank = element.valor;
      this.transactionCode = element.cod;
    }

    //credito
    if(element.medio==3){
      this.paymentMethod = "credito";
      this.creditBank = element.valor;
      this.transactionCode = element.cod;
    }

    //transferencia
    if(element.medio==4){
      this.paymentMethod = "transferencia";
      this.cash = element.valor;
      this.transactionCode = element.cod;
    }

    if(this.locStorage.getIdStore()==45001 || this.locStorage.getIdStore() ==46803){

    if(this.locStorage.getRol()[0].id_rol==23){
      this.dialogRef.close({
        wayToPay:this.wayToPay,
        cash:this.roundnum(this.cash),
        creditBank:this.creditBank,
        debitBank:this.debitBank,
        observations:this.observations,
        paymentMethod:this.paymentMethod,
        transactionCode: this.transactionCode,
        clientData : this.clientData,
        id_person : this.id_person,
        cambio : this.roundnum(this.cash - Number(this.data.total)),
        percent: this.disccountPercent,
        disccount: this.disccount,
        list: this.paymentDetailList.slice(1,this.paymentDetailList.length)
      });
    }else{

      if(this.disccount==0){

        this.dialogRef.close({
          wayToPay:this.wayToPay,
          cash:this.roundnum(this.cash),
          creditBank:this.creditBank,
          debitBank:this.debitBank,
          observations:this.observations,
          paymentMethod:this.paymentMethod,
          transactionCode: this.transactionCode,
          clientData : this.clientData,
          id_person : this.id_person,
          cambio : this.roundnum(this.cash - Number(this.data.total)),
          percent: this.disccountPercent,
          disccount: this.disccount,
          list: this.paymentDetailList.slice(1,this.paymentDetailList.length)
        });

      }else{

        const dialogRef = this.dialog.open(SelectCancelAdminDisccountComponent, {
          maxWidth: '80vw',
          maxHeight: '70vh',
          minWidth: '60vw',
          minHeight: '50vh',


          data: {
                  idthird: this.locStorage.getToken().id_third,
                  idStore: this.locStorage.getIdStore(),
                  rol: this.locStorage.getRol()[0].id_rol
                }
        });

        dialogRef.afterClosed().subscribe(result => {
          console.log("RESULT IS: ", result.resp)
          if(result.resp == 1){
            this.dialogRef.close({
              wayToPay:this.wayToPay,
              cash:this.roundnum(this.cash),
              creditBank:this.creditBank,
              debitBank:this.debitBank,
              observations:this.observations,
              paymentMethod:this.paymentMethod,
              transactionCode: this.transactionCode,
              clientData : this.clientData,
              id_person : this.id_person,
              cambio : this.roundnum(this.cash - Number(this.data.total)),
              percent: this.disccountPercent,
              disccount: this.disccount,
              list: this.paymentDetailList.slice(1,this.paymentDetailList.length)
            });
          }
        });

        }
      }
    }else{
      this.dialogRef.close({
        wayToPay:this.wayToPay,
        cash:this.roundnum(this.cash),
        creditBank:this.creditBank,
        debitBank:this.debitBank,
        observations:this.observations,
        paymentMethod:this.paymentMethod,
        transactionCode: this.transactionCode,
        clientData : this.clientData,
        id_person : this.id_person,
        cambio : this.roundnum(this.cash - Number(this.data.total)),
        percent: this.disccountPercent,
        disccount: this.disccount,
        list: this.paymentDetailList.slice(1,this.paymentDetailList.length)
      });
    }

  }
  transformAmount(element){
    this.showedCash = this.currencyPipe.transform(this.showedCash, '$');

    element.target.value = this.roundnum(this.showedCash);
  }
  openDialogClient(): void {



        const dialogRef = this.dialog.open(GenerateThirdComponentComponent, {
          width: '60vw',
          data: {}
        });


    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // CPrint('CREATE CLIENT SUCCESS');
        // CPrint(result);
        CPrint("THIS IS CLIENT DATA, ",result);
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

  searchClientk(event){
    const identificacionCliente = String(event.target.value);
    let aux;
    this.httpClient.get<any[]>(Urlbase.tercero + "/persons/search?doc_person="+String(identificacionCliente),{ headers: this.headers }).subscribe(data =>{
      CPrint("THIS IS DOCUMENT DATA: ",data);
      if (data.length == 0){
        this.openDialogClient();
        // this.searchClient(event);
      }else{
        aux = data[0];
        CPrint("THIS IS AUX",aux);
        this.cliente = aux.fullname;
        this.clientData.is_natural_person = true;
        this.clientData.fullname = aux.fullname;
        this.clientData.document_type = aux.document_TYPE;
        this.clientData.document_number = aux.document_NUMBER;
        this.clientData.id_third = aux.id_PERSON;
        this.id_person = aux.id_PERSON;
        this.clientData.address = aux.address;
        this.clientData.email =  aux.city;
        this.clientData.phone = aux.phone;
      }
    });
  }

  searchClient(event){
    const identificacionCliente = String(event.target.value);
    let aux;
    if(event.target.value.length>4){
    this.httpClient.get<any[]>(Urlbase.tercero + '/persons/search?doc_person='+String(identificacionCliente),{ headers: this.headers }).subscribe(data =>{
      CPrint(data);
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
            CPrint("THIS IS THE CLIENT",this.clientData)
          }
        });
      }
    });

  }else{
    this.showNotification('top', 'center', 3, "<h3>El elemento de busqueda debe ser de longitud mayor a 4.</h3> ", 'danger');
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



  searchClient2k(){

    CPrint("THIS ARE HEADERS",this.headers);
    const identificacionCliente = this.ccClient;
    let aux;
    this.httpClient.get<any[]>(Urlbase.tercero + "/persons/search?doc_person="+String(identificacionCliente),{ headers: this.headers }).subscribe(data =>{
      CPrint("THIS IS DOCUMENT DATA: ",data);
      if (data.length == 0){
        this.openDialogClient();
        // this.searchClient(event);
      }else{
        aux = data[0];
        CPrint("THIS IS AUX",aux);
        this.cliente = aux.fullname;
        this.clientData.is_natural_person = true;
        this.clientData.fullname = aux.fullname;
        this.clientData.document_type = aux.document_TYPE;
        this.clientData.document_number = aux.document_NUMBER;
        this.clientData.id_third = aux.id_PERSON;
        this.id_person = aux.id_PERSON;
        this.clientData.address = aux.address;
        this.clientData.email =  aux.city;
        this.clientData.phone = aux.phone;
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

  searchClient2(){
    CPrint("THIS ARE HEADERS",this.headers);
    const identificacionCliente = this.ccClient;
    let aux;
    if(identificacionCliente.length>4){
    this.httpClient.get<any[]>(Urlbase.tercero + '/persons/search?doc_person='+String(identificacionCliente),{ headers: this.headers }).subscribe(data =>{
      CPrint(data);
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
            CPrint("THIS THE AUX I NEED:", aux);
            this.cliente = aux.fullname;
            this.clientData.is_natural_person = true;
            this.clientData.fullname = aux.fullname;
            this.clientData.document_type = aux.document_TYPE;
            this.clientData.document_number = aux.document_NUMBER;
            this.clientData.id_third = aux.id_PERSON;
            this.clientData.address = aux.address;
            this.clientData.email = aux.city;
            this.clientData.phone = aux.phone;
            this.id_person = aux.id_PERSON;
            CPrint("THIS IS THE CLIENT",this.clientData)
          }
        });
      }
    });
  }
  else{
    this.showNotification('top', 'center', 3, "<h3>El elemento de busqueda debe ser de longitud mayor a 4.</h3> ", 'danger');
  }
}

  validate(){
    let total = 0;

    this.paymentDetailList.forEach(element => {
      total += Number(element.valor);
    });

    console.log("TOTAL1: "+total)
    console.log("TOTAL2: "+this.data.total)
    if(Number(total)>Number(this.data.total) || Number(total)< Number(this.data.total)){
      return true;
    }else{
      return false;
    }

  }

  getTotalPagos(){
    let total = 0;

    this.paymentDetailList.forEach(element => {
      total += Number(element.valor);
    });

    return Number(total);

  }

}

export interface DialogData {
  total: string;
  productsQuantity: number;
}
