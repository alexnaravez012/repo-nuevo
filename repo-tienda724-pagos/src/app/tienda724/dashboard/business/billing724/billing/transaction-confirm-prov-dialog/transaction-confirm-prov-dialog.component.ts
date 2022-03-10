import {Component, Inject, OnInit} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import {Urlbase} from '../../../../../../../app/shared/urls';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {ClientData} from '../models/clientData';
import {BillingService} from '../../../../../../services/billing.service';
import {LocalStorage} from '../../../../../../services/localStorage';
import {CurrencyPipe} from '@angular/common';
import {GenerateThirdComponent2Component} from '../bill-main/generate-third-component2/generate-third-component2.component';

@Component({
  selector: 'app-transaction-confirm-prov-dialog',
  templateUrl: './transaction-confirm-prov-dialog.component.html',
  styleUrls: ['./transaction-confirm-prov-dialog.component.scss']
})
export class TransactionConfirmProvDialogComponent implements OnInit {
  ccClient = "";
  showedCash = '';
  private options;
  Urlbase = Urlbase;
  public cash = 0;
  public wayToPay='contado';
  public creditBank= '';
  public debitBank= '';
  public observations='';
  public transactionCode = '';
  public paymentMethod = 'efectivo';
  public cliente = "Ocasional";
  public id_person;
  public sum = true;
  public clientData = new ClientData(true, 'Cliente Ocacional', '--', '000', 'N/A', '000', 'N/A',null);
  directoryList: any;
  api_uri = Urlbase.tercero;
  personList: any;
  private readonly headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(public currencyPipe: CurrencyPipe, private billingService: BillingService, private httpClient: HttpClient, private locStorage: LocalStorage,
    public dialogRef: MatDialogRef<TransactionConfirmProvDialogComponent>,public dialog: MatDialog
    ,@Inject(MAT_DIALOG_DATA) public data: DialogData)  {

    this.headers = new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization':  this.locStorage.getTokenValue(),
    });

    let token = localStorage.getItem('currentUser');

    this.options = { headers: this.headers };


  }

  total;
  ngOnInit() {
    this.cash=this.roundnum(this.data.total);
    this.total = Math.round(Number(this.data.total));
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
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

  roundnum(num){
    return Math.round(num);
    }


  disableButton(){
    return Math.round(Number(this.data.total)) > this.cash;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  clickedOn(method){
    this.paymentMethod = method;
  }

  returnData(){
    this.dialogRef.close({
      wayToPay:this.wayToPay,
      cash:this.cash,
      creditBank:this.creditBank,
      debitBank:this.debitBank,
      observations:this.observations,
      paymentMethod:this.paymentMethod,
      transactionCode: this.transactionCode,
      clientData : this.clientData,
      id_person : this.id_person
    });
  }
  transformAmount(element){
    this.showedCash = this.currencyPipe.transform(this.showedCash, '$');

    element.target.value = this.showedCash;
  }
  openDialogClient(): void {



        const dialogRef = this.dialog.open(GenerateThirdComponent2Component, {
          width: '60vw',
          data: {}
        });


    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        // CPrint('CREATE CLIENT SUCCESS');
        // CPrint(result);
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

  searchClient(event){
    const identificacionCliente = String(event.target.value);
    let aux;
    this.httpClient.get<any[]>(Urlbase.tercero + '/persons/search?doc_person='+String(identificacionCliente),{ headers: this.headers }).subscribe((res)=>{
      CPrint(res);
      if (res.length == 0){
        this.openDialogClient();
        // this.searchClient(event);
      }else{
        aux = res[0];
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




  searchClient2(){
    const identificacionCliente = this.ccClient;
    let aux;
    this.httpClient.get<any[]>(Urlbase.tercero + '/persons/search?doc_person='+String(identificacionCliente),{ headers: this.headers }).subscribe((res)=>{
      CPrint(res);
      if (res.length == 0){
        this.openDialogClient();
        // this.searchClient(event);
      }else{
        aux = res[0];
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


}

export interface DialogData {
  total: string;
  productsQuantity: number;
}
