import {Component, OnInit, ElementRef, ViewChild} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
//import { HttpClient } from '@angular/common/http';
import {LocalStorage} from '../../../../../../../services/localStorage';
import {BillingService} from '../../../../../../../services/billing.service';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {Urlbase} from '../../../../../../../shared/urls';
import {MatDialog} from '@angular/material';
import {ContUpdateComponent} from '../cont-update/cont-update.component';
import 'bootstrap-notify';
import * as jQuery from 'jquery';
import {DatePipe} from '@angular/common';
import {Router} from '@angular/router';
import {ClientData} from '../../models/clientData';
import { ThirdselectComponent } from '../../thirdselect/thirdselect.component';
import { GenerateThirdComponent2Component } from '../generate-third-component2/generate-third-component2.component';
import { Token } from 'src/app/shared/token';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import { NestedTreeControl } from '@angular/cdk/tree';
import { BehaviorSubject, Observable, of as observableOf } from 'rxjs';
import { PageSettingsModel, TreeGridComponent } from '@syncfusion/ej2-angular-treegrid';
import { MatAccordion } from '@angular/material/expansion';

export class FileNode {
  children: FileNode[]
  filename: String
  type: String
  codigoCuenta: String
}

let $: any = jQuery;

@Component({
  selector: 'app-contabilidad',
  templateUrl: './contabilidad.component.html',
  styleUrls: ['./contabilidad.component.scss']
})
export class ContabilidadComponent implements OnInit {
  @ViewChild('treegrid') tree: TreeGridComponent;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  nestedTreeControl: NestedTreeControl<FileNode>;
  nestedDataSource: MatTreeNestedDataSource<FileNode>;
  dataChange: BehaviorSubject<FileNode[]> = new BehaviorSubject<FileNode[]>([]);
  @ViewChild('treegrid2') tree2: TreeGridComponent;
  @ViewChild(MatAccordion) accordion2: MatAccordion;

  constructor(public router: Router, public datepipe: DatePipe, public ContUpdateComponent: ContUpdateComponent, public dialog: MatDialog,private http2: HttpClient,
              public locStorage: LocalStorage,
              private categoriesService: BillingService) {
                this.nestedDataSource = new MatTreeNestedDataSource();

                this.http2.get(Urlbase.tienda+"/kazu724/getAccountTree").subscribe(resp => {
                  console.log(resp)
                  //@ts-ignore
                  this.datasource = resp;
                  this.pageSettings = { pageSize: 6 };
                })

                

                this.headers = new HttpHeaders({
                  'Content-Type':  'application/json',
                  'Authorization':  this.locStorage.getTokenValue(),
                });
                this.clientData = new ClientData(true, 'Cliente Ocacional', '--', '000', 'N/A', '000', 'N/A', null);
               }
  private _getChildren = (node: FileNode) => { return observableOf(node.children) }
  hasNestedChild = (_:number, nodeData: FileNode) => {return !(nodeData.type)}
  //hasChild = (_: number, _nodeData: FileNode) => _nodeData.children.length>0;
  panelOpenState = false;
  @ViewChild('nameit') private elementRef: ElementRef;
  public token:Token;
  selectedTypeDoc=3;
  docTypeList;
  notes = "";
  selectedType = "-1"
  selectedState = "-1"
  dateC1;
  dateC11;
  dateC2;
  dateC22;
  Stores;
  docList = [];
  public pageSettings: PageSettingsModel;

  profundidad = 8;

  //nivel 1
  selectedFirstCC = "";
  firstLvlCC = [];
  //nivel 2
  selectedCC2 = "";
  lvlCC2 = [];
  //nivel 3
  selectedCC3 = "";
  lvlCC3 = [];
  //nivel 4
  selectedCC4 = "";
  lvlCC4 = [];
  //nivel 5
  selectedCC5 = "";
  lvlCC5 = [];
  //naturaleza
  selectedNat = "C"
  //valorCuenta
  cuenta = "0";
  //notasDetalle
  notesD= "";

  //Tabla Detalles
  tablaDetalles = []
  id_menu=162;
  children;
  datasource: Object[]; 
  statusList;
  typeList;
  private readonly headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  ngOnInit() {
    this.http2.get(Urlbase.tienda+"/kazu724/getdocstatus").subscribe(response => {
      this.statusList = response;
    })

    this.http2.get(Urlbase.tienda+"/kazu724/getdoctype").subscribe(response => {
      this.typeList = response;
    })
    
    this.token = this.locStorage.getToken();
    //PROTECCION URL INICIA
      CPrint(JSON.stringify(this.locStorage.getMenu()));
      const elem = this.locStorage.getMenu().find(item => item.id_menu == this.id_menu);

      if(!elem){
        // noinspection JSIgnoredPromiseFromCall
        this.router.navigateByUrl("/dashboard/business/movement/nopermision");
      }
      //PROTECCION URL TERMINA

    this.getDocTypeList();
    this.getStores();
    this.getFirstlvlCC();

  }

  generateBalance(){
    this.http2.post(Urlbase.tienda+"/kazu724/generateBalance?id_store="+this.locStorage.getIdStore()+"&profundidad="+this.profundidad+"&fecha_inicial="+this.dateC11+"&fecha_final="+this.dateC22,{}).subscribe(response => {
      if(response==1){
        this.http2.get(Urlbase.tienda+"/kazu724/getBalance?id_store="+this.locStorage.getIdStore()).subscribe(responseList => {
          CPrint("tsting",responseList);
           this.http2.post(Urlbase.facturacion+"/billing/Test",{empresa: this.locStorage.getThird().info.fullname,
                                                                    NIT: this.locStorage.getThird().info.type_document+" "+this.locStorage.getThird().info.document_number,
                                                                    Fecha: this.datepipe.transform(new Date(), 'yyyy_MM_dd'),
                                                                    Filas: responseList},{
                                                                     responseType: 'text'
                                                                   }).subscribe(response => {
                                                                      CPrint(response);
                                                                      window.open(Urlbase.facturas+"/"+response, "_blank");
            this.showNotification('top', 'center', 3, "<h3>Se genero su balance exitosamente.</h3> ", 'info');
            CPrint(JSON.stringify({empresa: this.locStorage.getThird().info.fullname,
              NIT: this.locStorage.getThird().info.type_document+" "+this.locStorage.getThird().info.document_number,
              Fecha: this.datepipe.transform(new Date(), 'yyyy/MM/dd'),
              Filas: responseList}))
           })
        })
      }else{
        this.showNotification('top', 'center', 3, "<h3>Se presento un error al generar el balance.</h3> ", 'danger');
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

  nombreCuenta = "";

  addElement(){
    this.accordion.closeAll();

    console.log("Damn Nigga")
    console.log(this.tree.getSelectedRowIndexes());
    //@ts-ignore
    console.log(this.tree.getRowByIndex(this.tree.getSelectedRowIndexes()[0]).cells[1].innerText);
    //@ts-ignore
    this.nombreCuenta = this.tree.getRowByIndex(this.tree.getSelectedRowIndexes()[0]).cells[1].innerText;
    //@ts-ignore
    this.selectedFirstCC = this.tree.getRowByIndex(this.tree.getSelectedRowIndexes()[0]).cells[0].innerText;
  }

  nombreCuentaPost = "";
  selectedFirstCCPost = "";


  nombreCuentaPost2 = "";
  selectedFirstCCPost2 = "";


  addElement2(){

    //@ts-ignore
    this.nombreCuentaPost = this.tree2.getRowByIndex(this.tree2.getSelectedRowIndexes()[0]).cells[1].innerText;

    //@ts-ignore
    this.selectedFirstCCPost = this.tree2.getRowByIndex(this.tree2.getSelectedRowIndexes()[0]).cells[0].innerText;

  }


  addDetail(){
    if(this.selectedFirstCC=="" || this.cuenta=="0" || this.notesD == ""){
      this.showNotification('top', 'center', 3, "<h3>Faltan datos para poder agregar el detalle.</h3> ", 'danger');
    }else{
      if(this.tablaDetalles.filter(item => item.codigo_CUENTA==this.selectedFirstCC).length>0){
        if(this.tablaDetalles.filter(item => item.codigo_CUENTA==this.selectedFirstCC).length==1){
          if(this.tablaDetalles.filter(item => item.codigo_CUENTA==this.selectedFirstCC)[0].naturaleza!=this.selectedNat){

      this.tablaDetalles.push({
        cuenta: this.selectedFirstCC,
        naturaleza: this.selectedNat,
        valor: Number(this.cuenta),
        nota: this.notesD,
        nombreThird: this.detailThirdName,
        idThird: this.detailThirdId
      })


        }
      }
    }else{

        this.tablaDetalles.push({
        cuenta: this.selectedFirstCC,
        naturaleza: this.selectedNat,
        valor: Number(this.cuenta),
        nota: this.notesD,
        nombreThird: this.detailThirdName,
        idThird: this.detailThirdId
      })

    }
    
    }

    this.selectedFirstCC="";
    this.nombreCuenta = "";
    this.selectedCC2="";
    this.selectedCC3="";
    this.selectedCC4="";
    this.selectedCC5="";
    this.selectedNat="C";
    this.cuenta="0";
    this.notesD="";
  }

  getFirstlvlCC(){
    this.http2.get(Urlbase.tienda + "/kazu724/getcodcuentagen").subscribe(list => {
      //@ts-ignore
      this.firstLvlCC = list;
      this.selectedCC2 = "";
      this.selectedCC3 = "";
      this.selectedCC4 = "";
      this.selectedCC5 = "";
    })
  }

  cancel(){
    this.getFirstlvlCC();
    this.cliente = "";
    this.lvlCC2 = [];
    this.lvlCC3 = [];
    this.lvlCC4 = [];
    this.lvlCC5 = [];
    this.notes = "";
    this.ccClient = "";
    this.clientData = new ClientData(true, 'Cliente Ocacional', '--', '000', 'N/A', '000', 'N/A', null);
    this.selectedNat = "C";
    this.cuenta = "0";
    this.notesD = "";
    this.third2 = "";
    this.selectedTypeDoc = 3;
  }

  getlvlCC2(){
    this.http2.get(Urlbase.tienda + "/kazu724/getcodcuenta?cp="+this.selectedFirstCC).subscribe(list => {
      //@ts-ignore
      this.lvlCC2 = list;
      this.selectedCC3 = "";
      this.selectedCC4 = "";
      this.selectedCC5 = "";
    })
  }

  getlvlCC3(){
    this.http2.get(Urlbase.tienda + "/kazu724/getcodcuenta?cp="+this.selectedCC2).subscribe(list => {
      //@ts-ignore
      this.lvlCC3 = list;
      this.selectedCC4 = "";
      this.selectedCC5 = "";
    })
  }

  getlvlCC4(){
    this.http2.get(Urlbase.tienda + "/kazu724/getcodcuenta?cp="+this.selectedCC3).subscribe(list => {
      //@ts-ignore
      this.lvlCC4 = list;
      this.selectedCC5 = "";
    })
  }

  getlvlCC5(){
    this.http2.get(Urlbase.tienda + "/kazu724/getcodcuenta?cp="+this.selectedCC4).subscribe(list => {
      //@ts-ignore
      this.lvlCC5 = list;
    })
  }

  getStores() {
    this.categoriesService.getStoresByThird(this.locStorage.getToken().id_third).subscribe(data => {
        CPrint(data);this.Stores = data})
}

  getDocTypeList(){
    this.http2.get(Urlbase.tienda + "/kazu724/getdoctype").subscribe(list => {
      this.docTypeList = list;
    })
  }

  details = "";
  idThird = -1;
  public clientData: ClientData;
  ccClient = "";
  cliente="---";

  id_person=-1;


  third2 = "";

  detailThirdName = "";
  detailThirdId = "";

  searchClient3(){
    CPrint("THIS ARE HEADERS",this.headers);
    const identificacionCliente = this.third2;
    let aux;
    
    if(identificacionCliente.length>4){
    this.http2.get<any[]>(Urlbase.tercero + '/persons/search?doc_person='+String(identificacionCliente),{ headers: this.headers }).subscribe(res =>{
      CPrint(res);
      if (res.length == 0){
        this.openDialogClient2();
        // this.searchClient(event);
      }else{
        const dialogRef = this.dialog.open(ThirdselectComponent, {
          width: '60vw',
          height: '80vh',

          data: { thirdList: res }
        });

        dialogRef.afterClosed().subscribe(result => {
          if(result){

            aux = this.locStorage.getPersonClient();
            CPrint("THIS THE AUX I NEED:", aux);
            this.detailThirdName = aux.fullname;
            this.detailThirdId = aux.id_PERSON;
            CPrint("THIS IS THE CLIENT",this.clientData);
            this.http2.get(Urlbase.facturacion + "/billing/pedidos?id_store="+this.locStorage.getIdStore()+"&id_third="+aux.id_PERSON).subscribe(r => {
              //@ts-ignore
              r.push({numdocumento: "",
              id_BILL: -1,
              id_THIRD: -1})
              //@ts-ignore
              this.pedidosList = r;

            });

          }
        });


      }


    });

  }else{
    this.showNotification('top', 'center', 3, "<h3>El elemento de busqueda debe ser de longitud mayor a 4.</h3> ", 'danger');
  }

  }



postPuc(){
  console.log(this.selectedFirstCCPost+this.selectedFirstCCPost2, this.nombreCuentaPost2)
  this.http2.post(Urlbase.tienda+"/kazu724/puc",{cc: this.selectedFirstCCPost2,
                                                description: this.nombreCuentaPost2,
                                                ccp: this.selectedFirstCCPost,
                                                id_country: 169}).subscribe( response => {
                                                  if(response == 1){
                                                    this.showNotification('top', 'center', 3, "<h3>Se creo la cuenta adecuadamente.</h3> ", 'info');
                                                    this.http2.get(Urlbase.tienda+"/kazu724/getAccountTree").subscribe(resp => {
                                                      console.log(resp)
                                                      //@ts-ignore
                                                      this.datasource = resp;
                                                      this.pageSettings = { pageSize: 6 };
                                                    })
                                                  }else{
                                                    this.showNotification('top', 'center', 3, "<h3>Algo fallo al crear la cuenta.</h3> ", 'danger');
                                                  }
                                                } )
}



  searchClient2(){
    CPrint("THIS ARE HEADERS",this.headers);
    const identificacionCliente = this.ccClient;
    let aux;
    if(identificacionCliente.length>4){
    this.http2.get<any[]>(Urlbase.tercero + '/persons/search?doc_person='+String(identificacionCliente),{ headers: this.headers }).subscribe(res =>{
      CPrint(res);
      if (res.length == 0){
        this.openDialogClient2();
        // this.searchClient(event);
      }else{
        const dialogRef = this.dialog.open(ThirdselectComponent, {
          width: '60vw',
          height: '80vh',

          data: { thirdList: res }
        });

        dialogRef.afterClosed().subscribe(result => {
          if(result){

            aux = this.locStorage.getPersonClient();
            CPrint("THIS THE AUX I NEED:", aux);

            this.detailThirdName = aux.fullname;
            this.detailThirdId = aux.id_PERSON;
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
            CPrint("THIS IS THE CLIENT",this.clientData);
            this.http2.get(Urlbase.facturacion + "/billing/pedidos?id_store="+this.locStorage.getIdStore()+"&id_third="+aux.id_PERSON).subscribe(r => {
              //@ts-ignore
              r.push({numdocumento: "",
              id_BILL: -1,
              id_THIRD: -1})
              //@ts-ignore
              this.pedidosList = r;

            });

          }
        });


      }


    });

  }else{
    this.showNotification('top', 'center', 3, "<h3>El elemento de busqueda debe ser de longitud mayor a 4.</h3> ", 'danger');
  }
  }





  searchClient(event){
    const identificacionCliente = String(event.target.value);
    let aux;
    if(event.target.value.length>4){
    this.http2.get<any[]>(Urlbase.tercero + '/persons/search?doc_person='+String(identificacionCliente),{ headers: this.headers }).subscribe((res)=>{
      CPrint(res);
      if (res.length == 0){
        this.openDialogClient2();
        // this.searchClient(event);
      }else{
        const dialogRef = this.dialog.open(ThirdselectComponent, {
          width: '60vw',
          height: '80vh',

          data: { thirdList: res }
        });

        dialogRef.afterClosed().subscribe(result => {
          if(result){

            aux = this.locStorage.getPersonClient();
            CPrint("THIS THE AUX I NEED:", aux);
            this.detailThirdName = aux.fullname;
            this.detailThirdId = aux.id_PERSON;
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
            CPrint("THIS IS THE CLIENT",this.clientData);
            CPrint("THIS IS THE CLIENT",this.clientData);
            this.http2.get(Urlbase.facturacion + "/billing/pedidos?id_store="+this.locStorage.getIdStore()+"&id_third="+aux.id_PERSON).subscribe(r => {
              //@ts-ignore
              r.push({numdocumento: "",
              id_BILL: -1,
              id_THIRD: -1})
              //@ts-ignore
              this.pedidosList = r;

            });

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



  async generateDetailList(){
    console.log(this.tablaDetalles);

    this.tablaDetalles.forEach( elem => {
      this.details+="{"+elem.cuenta+","+elem.valor+","+elem.naturaleza+","+elem.nota+","+169+","+elem.idThird+"},"
    })

  }



  postMaster(){
    this.generateDetailList().then( r=> {
      console.log(Urlbase.tienda + "/kazu724/postDocument?iddocumenttype="+this.selectedTypeDoc+"&iddocumentstatus=1&notes="+this.notes+"&idstore="+this.locStorage.getIdStore()+"&idthird="+this.id_person+"&idthirduser="+this.token.id_third+"&docdetails="+this.details.substring(0, this.details.length - 1))
      this.http2.post(Urlbase.tienda + "/kazu724/postDocument?iddocumenttype="+this.selectedTypeDoc+"&iddocumentstatus=1&notes="+this.notes+"&idstore="+this.locStorage.getIdStore()+"&idthird="+this.id_person+"&idthirduser="+this.token.id_third+"&docdetails="+this.details.substring(0, this.details.length - 1),{}).subscribe(response=> {
        alert("Documento creado exitosamente.");
        this.details = "";
        this.id_person = -1
        this.clientData = new ClientData(true, 'Cliente Ocacional', '--', '000', 'N/A', '000', 'N/A', null);
        this.notes="";
        this.tablaDetalles = [];
      })
    })

    console.log(this.tablaDetalles);
  }

  // postMaster(){
  //   this.http2.post(Urlbase.tienda + "/kazu724/doc",{
  //   id_document_status: 1,
  //   id_document_type: this.selectedTypeDoc,
  //   notes: this.notes,
  //   id_store: this.selectedStore,
  //   id_third_user: this.locStorage.getThird().id_third}).subscribe(response => {
  //     this.tablaDetalles.forEach(element => {
  //       CPrint("THIS IS IT, ",element)
  //       let body ={
  //         cc: Number(element.cuenta),
  //         valor: Number(element.valor),
  //         naturaleza: element.naturaleza,
  //         notes: element.nota,
  //         id_document: Number(response),
  //         id_country: 169
  //       }
  //       CPrint("THIS IS BODY", body);
  //       this.http2.post(Urlbase.tienda + "/kazu724/detail",body).subscribe(element2 => {})
  //     })
  //     CPrint("THIS IS MY RESPONSE: ",response);
  //     this.notes = "";
  //     this.tablaDetalles = [];
  //   })
  // }


  individualDelete(doc){
    this.tablaDetalles.forEach( (item, index) => {
      if(item === doc) this.tablaDetalles.splice(index,1);
    });
 }

 calculateBalance(){
   let creds = 0;
   let debts = 0;
  this.tablaDetalles.forEach( (item, index) => {
    if(item.naturaleza == 'C') creds+=item.valor;
    if(item.naturaleza == 'D') debts+=item.valor;
  });
  return debts-creds;
 }

 getDocs(){
   let list;
   let list2;
   if(this.selectedType=="-1"){
    list = "1,2,3,4,5";
   }else{
    list = ""+this.selectedType;
   }
   if(this.selectedState=="-1"){
    list2 = "1,2,3";
   }else{
    list2 = ""+this.selectedState;
   }
   this.http2.get(Urlbase.tienda+"/kazu724/getDocumentHeader?id_store="+this.locStorage.getIdStore()+"&date1="+this.dateC1+"&date2="+this.dateC2+"&statusList="+list2+"&typeList="+list).subscribe(
    element => {
      //@ts-ignore
      console.log(element.length)
      //@ts-ignore
      this.docList =  element;
    }
   );
 }

 openDetailWindow(element){
  const dialogRef = this.dialog.open(ContUpdateComponent, {
    width: '80vw',
    height: '80vh',
    data: { element }
  });
  dialogRef.afterClosed().subscribe(result => {

  });
 }

}
