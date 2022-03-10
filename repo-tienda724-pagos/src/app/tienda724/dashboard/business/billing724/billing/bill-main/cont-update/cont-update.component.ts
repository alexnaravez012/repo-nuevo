import {Component, Inject, OnInit, ViewChild} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {LocalStorage} from 'src/app/services/localStorage';
import {Urlbase} from 'src/app/shared/urls';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import 'bootstrap-notify';
import * as jQuery from 'jquery';
import { ThirdselectComponent } from '../../thirdselect/thirdselect.component';
import { GenerateThirdComponent2Component } from '../generate-third-component2/generate-third-component2.component';
import { PageSettingsModel, TreeGridComponent } from '@syncfusion/ej2-angular-treegrid';
import { MatAccordion } from '@angular/material';

let $: any = jQuery;



@Component({
  selector: 'app-cont-update',
  templateUrl: './cont-update.component.html',
  styleUrls: ['./cont-update.component.css']
})
export class ContUpdateComponent implements OnInit {


  private readonly headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(public dialogRef: MatDialogRef<ContUpdateComponent>,public dialog: MatDialog,
              private http2: HttpClient,
              private locStorage: LocalStorage,
              @Inject(MAT_DIALOG_DATA) public data: any ) {
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
            }
  @ViewChild('treegrid') tree: TreeGridComponent;
  @ViewChild(MatAccordion) accordion: MatAccordion;
  public pageSettings: PageSettingsModel;
  details=[];

  third2 = "";
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
  datasource: Object[]; 
  detailThirdName = "";
  detailThirdId = "";

  ngOnInit() {
    this.detailThirdId = this.data.element.id_THIRD;
    this.detailThirdName = this.data.element.fullname;
    this.getFirstlvlCC();
    CPrint(this.data)
    this.http2.get(Urlbase.tienda+"/kazu724/getDetailsDocument?id_document="+this.data.element.id_DOCUMENT).subscribe(
      element => {
        //@ts-ignore
        this.details =  element;
      }
     );
  }

  addElement(){
    this.accordion.closeAll();

    console.log("Damn Nigga")
    console.log(this.tree.getSelectedRowIndexes());
    //@ts-ignore
    console.log(this.tree.getRowByIndex(this.tree.getSelectedRowIndexes()[0]).cells[0].innerText);
    //@ts-ignore
    this.selectedFirstCC = this.tree.getRowByIndex(this.tree.getSelectedRowIndexes()[0]).cells[0].innerText;
  }

  calculateBalance(){
    let creds = 0;
    let debts = 0;
    this.details.forEach( (item, index) => {
      if(item.naturaleza == 'C') creds+=item.valor;
      if(item.naturaleza == 'D') debts+=item.valor;
    });
    return debts-creds;
  }


  approveDoc(){
    if(this.calculateBalance()==0){
      this.http2.put(Urlbase.tienda+"/kazu724/updateDocument?id_status="+2+"&notes="+this.data.element.notes+"&id_doc="+this.data.element.id_DOCUMENT,{}).subscribe( item => {
        this.showNotification('top', 'center', 3, "<h3>El documento se aprobo exitosamente.</h3> ", 'info');
        this.data.element.document_STATUS = "Documento Aprobado"
      });
    }else{
      this.showNotification('top', 'center', 3, "<h3>Los debitos y creditos no son iguales.</h3> ", 'danger');
    }
  }


  updateNotes(){
    this.http2.put(Urlbase.tienda+"/kazu724/updateDocument?id_status="+1+"&notes="+this.data.element.notes+"&id_doc="+this.data.element.id_DOCUMENT,{}).subscribe( item => {
      this.showNotification('top', 'center', 3, "<h3>El documento se anulo exitosamente.</h3> ", 'info');

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

      this.detailThirdName = dataPerson.info.fullname;
      this.detailThirdId = dataPerson.info.id_PERSON;

    }
  });
}



searchClient3(){
  CPrint("THIS ARE HEADERS",this.headers);
  const identificacionCliente = this.third2;
  let aux;
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


}




  killDoc(){
      this.http2.put(Urlbase.tienda+"/kazu724/updateDocument?id_status="+3+"&notes="+this.data.element.notes+"&id_doc="+this.data.element.id_DOCUMENT,{}).subscribe( item => {
        this.showNotification('top', 'center', 3, "<h3>El documento se anulo exitosamente.</h3> ", 'info');
        this.data.element.document_STATUS = "Documento Anulado"
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



  addDetail(){
  if(this.selectedFirstCC=="" || this.cuenta=="0" || this.notesD == ""){
    this.showNotification('top', 'center', 3, "<h3>Faltan datos para poder agregar el detalle.</h3> ", 'danger');
  }else{
    if(this.selectedCC2==""){
      if(this.details.filter(item => item.codigo_CUENTA==this.selectedFirstCC).length>0){
        if(this.details.filter(item => item.codigo_CUENTA==this.selectedFirstCC).length==1){
          if(this.details.filter(item => item.codigo_CUENTA==this.selectedFirstCC)[0].naturaleza!=this.selectedNat){

      this.http2.post(Urlbase.tienda+"/kazu724/detail",{
          cc: this.selectedFirstCC,
          naturaleza: this.selectedNat,
          valor: Number(this.cuenta),
          notes: this.notesD,
          id_document: this.data.element.id_DOCUMENT,
          id_country: 169,
          id_third: this.detailThirdId
        }).subscribe(response => {
          console.log("response: ",response)
          this.http2.get(Urlbase.tienda+"/kazu724/getDetailsDocument?id_document="+this.data.element.id_DOCUMENT).subscribe(
          element => {
            this.showNotification('top', 'center', 3, "<h3>Se agrego el detalle exitosamente.</h3> ", 'info');
            //@ts-ignore
            this.details =  element;
          });
        });
          }
        }
      }else{

      this.http2.post(Urlbase.tienda+"/kazu724/detail",{
        cc: this.selectedFirstCC,
        naturaleza: this.selectedNat,
        valor: Number(this.cuenta),
        notes: this.notesD,
        id_document: this.data.element.id_DOCUMENT,
        id_country: 169,
        id_third: this.detailThirdId
      }).subscribe(response => {
        console.log("response: ",response)
        this.http2.get(Urlbase.tienda+"/kazu724/getDetailsDocument?id_document="+this.data.element.id_DOCUMENT).subscribe(
        element => {
          this.showNotification('top', 'center', 3, "<h3>Se agrego el detalle exitosamente.</h3> ", 'info');
          //@ts-ignore
          this.details =  element;
        });
      });

      }
    }else{
      if(this.selectedCC3==""){
        if(this.details.filter(item => item.codigo_CUENTA==this.selectedCC2).length>0){
          if(this.details.filter(item => item.codigo_CUENTA==this.selectedCC2).length==1){
            if(this.details.filter(item => item.codigo_CUENTA==this.selectedCC2)[0].naturaleza!=this.selectedNat){

        this.http2.post(Urlbase.tienda+"/kazu724/detail",{
          cc: this.selectedCC2,
          naturaleza: this.selectedNat,
          valor: Number(this.cuenta),
          notes: this.notesD,
          id_document: this.data.element.id_DOCUMENT,
          id_country: 169,
          id_third: this.detailThirdId
        }).subscribe(response => {

          console.log("response: ",response)
          this.http2.get(Urlbase.tienda+"/kazu724/getDetailsDocument?id_document="+this.data.element.id_DOCUMENT).subscribe(
          element => {
            this.showNotification('top', 'center', 3, "<h3>Se agrego el detalle exitosamente.</h3> ", 'info');
            //@ts-ignore
            this.details =  element;
          });
        });

      }
    }
  }else{

  this.http2.post(Urlbase.tienda+"/kazu724/detail",{
    cc: this.selectedCC2,
    naturaleza: this.selectedNat,
    valor: Number(this.cuenta),
    notes: this.notesD,
    id_document: this.data.element.id_DOCUMENT,
    id_country: 169,
    id_third: this.detailThirdId
  }).subscribe(response => {
    console.log("response: ",response)
    this.http2.get(Urlbase.tienda+"/kazu724/getDetailsDocument?id_document="+this.data.element.id_DOCUMENT).subscribe(
    element => {
      this.showNotification('top', 'center', 3, "<h3>Se agrego el detalle exitosamente.</h3> ", 'info');
      //@ts-ignore
      this.details =  element;
    });
  });

  }
      }else{
        if(this.selectedCC4==""){
          if(this.details.filter(item => item.codigo_CUENTA==this.selectedCC3).length>0){
            if(this.details.filter(item => item.codigo_CUENTA==this.selectedCC3).length==1){
              if(this.details.filter(item => item.codigo_CUENTA==this.selectedCC3)[0].naturaleza!=this.selectedNat){
          this.http2.post(Urlbase.tienda+"/kazu724/detail",{
            cc: this.selectedCC3,
            naturaleza: this.selectedNat,
            valor: Number(this.cuenta),
            notes: this.notesD,
            id_document: this.data.element.id_DOCUMENT,
            id_country: 169,
            id_third: this.detailThirdId
          }).subscribe(response => {
            console.log("response: ",response)
            this.http2.get(Urlbase.tienda+"/kazu724/getDetailsDocument?id_document="+this.data.element.id_DOCUMENT).subscribe(
            element => {
              this.showNotification('top', 'center', 3, "<h3>Se agrego el detalle exitosamente.</h3> ", 'info');
              //@ts-ignore
              this.details =  element;
            });
          });

      }
    }
  }else{

  this.http2.post(Urlbase.tienda+"/kazu724/detail",{
    cc: this.selectedCC3,
    naturaleza: this.selectedNat,
    valor: Number(this.cuenta),
    notes: this.notesD,
    id_document: this.data.element.id_DOCUMENT,
    id_country: 169,
    id_third: this.detailThirdId
  }).subscribe(response => {
    console.log("response: ",response)
    this.http2.get(Urlbase.tienda+"/kazu724/getDetailsDocument?id_document="+this.data.element.id_DOCUMENT).subscribe(
    element => {
      this.showNotification('top', 'center', 3, "<h3>Se agrego el detalle exitosamente.</h3> ", 'info');
      //@ts-ignore
      this.details =  element;
    });
  });

  }

        }else{
          if(this.selectedCC5==""){

          if(this.details.filter(item => item.codigo_CUENTA==this.selectedCC4).length>0){
            if(this.details.filter(item => item.codigo_CUENTA==this.selectedCC4).length==1){
              if(this.details.filter(item => item.codigo_CUENTA==this.selectedCC4)[0].naturaleza!=this.selectedNat){
            this.http2.post(Urlbase.tienda+"/kazu724/detail",{
              cc: this.selectedCC4,
              naturaleza: this.selectedNat,
              valor: Number(this.cuenta),
              notes: this.notesD,
              id_document: this.data.element.id_DOCUMENT,
              id_country: 169,
              id_third: this.detailThirdId
            }).subscribe(response => {
              console.log("response: ",response)
              this.http2.get(Urlbase.tienda+"/kazu724/getDetailsDocument?id_document="+this.data.element.id_DOCUMENT).subscribe(
              element => {
                this.showNotification('top', 'center', 3, "<h3>Se agrego el detalle exitosamente.</h3> ", 'info');
                //@ts-ignore
                this.details =  element;
              });
            });

      }
    }
  }else{

  this.http2.post(Urlbase.tienda+"/kazu724/detail",{
    cc: this.selectedCC4,
    naturaleza: this.selectedNat,
    valor: Number(this.cuenta),
    notes: this.notesD,
    id_document: this.data.element.id_DOCUMENT,
    id_country: 169,
    id_third: this.detailThirdId
  }).subscribe(response => {
    console.log("response: ",response)
    this.http2.get(Urlbase.tienda+"/kazu724/getDetailsDocument?id_document="+this.data.element.id_DOCUMENT).subscribe(
    element => {
      this.showNotification('top', 'center', 3, "<h3>Se agrego el detalle exitosamente.</h3> ", 'info');
      //@ts-ignore
      this.details =  element;
    });
  });

  }

          }else{
            if(this.details.filter(item => item.codigo_CUENTA==this.selectedCC5).length>0){
              if(this.details.filter(item => item.codigo_CUENTA==this.selectedCC5).length==1){
                if(this.details.filter(item => item.codigo_CUENTA==this.selectedCC5)[0].naturaleza!=this.selectedNat){

            this.http2.post(Urlbase.tienda+"/kazu724/detail",{
              cc: this.selectedCC5,
              naturaleza: this.selectedNat,
              valor: Number(this.cuenta),
              notes: this.notesD,
              id_document: this.data.element.id_DOCUMENT,
              id_country: 169,
              id_third: this.detailThirdId
            }).subscribe(response => {
              console.log("response: ",response)
              this.http2.get(Urlbase.tienda+"/kazu724/getDetailsDocument?id_document="+this.data.element.id_DOCUMENT).subscribe(
              element => {
                this.showNotification('top', 'center', 3, "<h3>Se agrego el detalle exitosamente.</h3> ", 'info');
                //@ts-ignore
                this.details =  element;
              });
            });
          }
        }
      }else{

      this.http2.post(Urlbase.tienda+"/kazu724/detail",{
        cc: this.selectedCC5,
        naturaleza: this.selectedNat,
        valor: Number(this.cuenta),
        notes: this.notesD,
        id_document: this.data.element.id_DOCUMENT,
        id_country: 169,
        id_third: this.detailThirdId
      }).subscribe(response => {
        console.log("response: ",response)
        this.http2.get(Urlbase.tienda+"/kazu724/getDetailsDocument?id_document="+this.data.element.id_DOCUMENT).subscribe(
        element => {
          this.showNotification('top', 'center', 3, "<h3>Se agrego el detalle exitosamente.</h3> ", 'info');
          //@ts-ignore
          this.details =  element;
        });
      });

      }
          }
        }

      }
    }

    }
    this.selectedFirstCC="";
    this.selectedCC2="";
    this.selectedCC3="";
    this.selectedCC4="";
    this.selectedCC5="";
    this.selectedNat="C";
    this.cuenta="0";
    this.notesD="";
  }


  deleteDetail(item){
    this.http2.delete(Urlbase.tienda+"/kazu724/deleteDocumentDetail?id_detail="+item.id_DOCUMENT_DETAIL).subscribe(item => {
      this.showNotification('top', 'center', 3, "<h3>El detalle se borro exitosamente.</h3> ", 'info');
      this.http2.get(Urlbase.tienda+"/kazu724/getDetailsDocument?id_document="+this.data.element.id_DOCUMENT).subscribe(
      element => {
        //@ts-ignore
        this.details =  element;
      }
     );

    })
  }



}
