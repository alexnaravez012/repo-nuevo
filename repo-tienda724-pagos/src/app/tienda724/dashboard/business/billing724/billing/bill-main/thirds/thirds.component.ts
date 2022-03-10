import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import {ClientData} from '../../models/clientData';
import {MatDialog} from '@angular/material';
import {GenerateThirdComponent2Component} from '../generate-third-component2/generate-third-component2.component';
import {ThirdselectComponent} from '../../thirdselect/thirdselect.component';
import {BillingService} from '../../../../../../../services/billing.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {LocalStorage} from '../../../../../../../services/localStorage';
import * as jQuery from 'jquery';
import 'bootstrap-notify';
import {Urlbase} from '../../../../../../../shared/urls';
import {Router} from '@angular/router';

let $: any = jQuery;

@Component({
  selector: 'app-thirds',
  templateUrl: './thirds.component.html',
  styleUrls: ['./thirds.component.scss']
})
export class ThirdsComponent implements OnInit {

  constructor(public router: Router,private httpClient: HttpClient,private http2: HttpClient, private locStorage: LocalStorage, public dialog: MatDialog,private billingService : BillingService) {

    this.headers = new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization':  this.locStorage.getTokenValue(),
    });
   }
   @ViewChild('nameit') private elementRef: ElementRef;
   usuario="";
  password="";
  SelectedRol = "8888";
  document = "";
  private readonly headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  address = "";
  city = "";
  doc = "";
  docType = "";
  fullname = "";
  phones = [];
  mails = [];
  cliente="";
  id_person=0;
  ccClient = "";
  id_directory=0;
 clientData = new ClientData(true, 'Cliente Ocacional', '--', '000', 'N/A', '000', 'N/A', null);
 @ViewChild('nameot') private elementRef2: ElementRef;



  searchClient2(){
    this.id_person=0;

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
            this.id_directory = aux.id_DIRECTORY;
            CPrint("THIS IS THE CLIENT",this.clientData);
            this.httpClient.get(Urlbase.tercero + "/persons/idperson?id_third="+aux.id_PERSON,{headers: this.headers}).subscribe(idperson => {
              //@ts-ignore
              this.id_person = Number(idperson);
              CPrint(this.id_person);
            });
            setTimeout(() => {

              this.elementRef2.nativeElement.focus();
              this.elementRef2.nativeElement.select();

              }, 100);

          }
        });


      }


    });

  }else{
    this.showNotification('top', 'center', 3, "<h3>El elemento de busqueda debe ser de longitud mayor a 4.</h3> ", 'danger');
  }  
  }


  asociarCajaTienda(){
    this.http2.post(Urlbase.tienda + "/resource/asociarAPerson?idperson="+this.id_person+"&idstore="+this.SelectedStore+"&idcaja="+this.SelectedBox,{}).subscribe(resp => {
      if(resp == 1){
        this.showNotification('top', 'center', 3, "<h3>SE ASOCIO LA CAJA Y LA TIENDA EXITOSAMENTE</h3> ", 'info');
      }else{
        this.showNotification('top', 'center', 3, "<h3>NO SE REALIZO LA ASOCIACON ADECUADAMENTE</h3> ", 'info');
      }
    })
  }

 


  update(){
    CPrint(Urlbase.tercero + "/directories/phoneAndMail?id_directory="+this.id_directory+"&phone="+this.clientData.phone+"&mail="+this.clientData.email+"&address="+this.clientData.address);
    this.httpClient.put(Urlbase.tercero + "/directories/phoneAndMail?id_directory="+this.id_directory+"&phone="+this.clientData.phone+"&mail="+this.clientData.email+"&address="+this.clientData.address.split("#").join("_"), {} ,{ headers: this.headers }).subscribe(resp => {
      CPrint("THIS IS MY RTESP: ",resp);
      this.clientData = new ClientData(true, 'Cliente Ocacional', '--', '000', 'N/A', '000', 'N/A', null);
      this.ccClient= "";
      this.cliente = "";
    })
  }


  searchClient(event){
    this.id_person=0;
    const identificacionCliente = String(event.target.value);
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
            this.id_directory = aux.id_DIRECTORY;
            CPrint("THIS IS THE CLIENT",this.clientData);
            this.httpClient.get(Urlbase.tercero + "/persons/idperson?id_third="+aux.id_PERSON,{headers: this.headers}).subscribe(idperson => {
              //@ts-ignore
              this.id_person = Number(idperson);
              CPrint(this.id_person);
            })

          }
          setTimeout(() => {

            this.elementRef.nativeElement.focus();
            this.elementRef.nativeElement.select();

            }, 100);
        });
      }


    });
  }else{
    this.showNotification('top', 'center', 3, "<h3>El elemento de busqueda debe ser de longitud mayor a 4.</h3> ", 'danger');
  }
  }

  crearUsuario(){

     //@ts-ignore
     this.httpClient.post(Urlbase.tercero + "/employees?id_person="+this.id_person,{"salary":1100000,
     "state":{"state": 1,
              "creation_date":new Date(),
              "modify_date": new Date()}},
        {headers: this.headers}).subscribe(idEmployee => {


        //POST A USER_THIRD
        //@ts-ignore
        this.httpClient.post(Urlbase.tercero + "/employees/userThird?id_person="+this.id_person,{},
        {headers: this.headers}).subscribe(postedUt => {

          //POST A BACK AUTENTICACIÓN
          let body = {
            uuid: this.id_person,
            usuario: this.usuario,
            clave: this.password,
            roles: [this.SelectedRol],
            id_applicacion: 21
          };
          this.httpClient.post(Urlbase.auth+"/usuarios",body,{headers: this.headers}).subscribe(resultado => {
              this.showNotification('top', 'center', 3, "<h3>SE REGISTRO EL USUARIO EXITOSAMENTE</h3> ", 'info');
          },error => {
              CPrint(error);
              this.showNotification('top', 'center', 3, "<h3>Error al crear usuario: /h3> "+error.message, 'danger');
          });
        })
      })
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
        setTimeout(() => {

          this.elementRef2.nativeElement.focus();
          this.elementRef2.nativeElement.select();

          }, 100);
      }
      setTimeout(() => {

        this.elementRef2.nativeElement.focus();
        this.elementRef2.nativeElement.select();

        }, 100);
    });
  }

  Stores;
  SelectedStore;
  id_menu = 161;

  ngOnInit() {
    //PROTECCION URL INICIA
    CPrint(JSON.stringify(this.locStorage.getMenu()));
    const elem = this.locStorage.getMenu().find(item => item.id_menu == this.id_menu);

    if(!elem){
      // noinspection JSIgnoredPromiseFromCall
      this.router.navigateByUrl("/dashboard/business/movement/nopermision");
    }
    //PROTECCION URL TERMINA

    this.billingService.getStoresByThird(this.locStorage.getToken().id_third).subscribe(data => {
      this.Stores = data;
     this.SelectedStore = data[0].id_STORE;
     this.getBoxes()
    })
  }

  boxes;
  SelectedBox;

  getBoxes(){
    this.http2.get(Urlbase.tienda + "/resource/boxes?id_store="+this.SelectedStore).subscribe(response => {
     this.SelectedBox = response[0].id_CAJA;
     this.boxes = response;
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


  buscarTercero(){
    let aux;
    this.httpClient.get<any[]>(Urlbase.tercero + '/persons/search?doc_person='+this.document,{ headers: this.headers }).subscribe(data =>{
    this.phones = [];
    this.mails = [];
    if (data.length == 0){
        this.showNotification('top', 'center', 3, "<h3>NO SE ENCONTRO EL DOCUMENTO DE FACTURA SOLICITADO</h3> ", 'danger');
        // this.searchClient(event);
      }else{
        aux = data[0];
        this.httpClient.get<any>(Urlbase.tercero + "/directories/generalDir?id_directory="+aux.id_DIRECTORY,{ headers: this.headers }).subscribe(response =>{
          this.httpClient.get<any>(Urlbase.tercero + "/directories/phone?id_directory="+aux.id_DIRECTORY,{ headers: this.headers }).subscribe(responsePhone =>{
            this.httpClient.get<any>(Urlbase.tercero + "/directories/mail?id_directory="+aux.id_DIRECTORY,{ headers: this.headers }).subscribe(responseMail=>{
              this.address = aux.address;
              this.city = response.city;
              this.doc = aux.document_NUMBER;
              this.docType = aux.document_TYPE;
              this.fullname = aux.fullname;
              responsePhone.forEach(element => {
                this.phones.push(element)
              });
              responseMail.forEach(element => {
                this.mails.push(element)
              });

              CPrint(this.address,this.city,this.doc,this.docType,this.fullname,this.phones,this.mails)
            })
          })
        })
      }


    });
  }

}
