import { Component, OnInit, Inject, SystemJsNgModuleLoader } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { Urlbase } from 'src/app/shared/urls';
import { LocalStorage } from 'src/app/services/localStorage';
import { CPrint } from 'src/app/shared/util/CustomGlobalFunctions';

@Component({
  selector: 'app-kardex',
  templateUrl: './kardex.component.html',
  styleUrls: ['./kardex.component.css']
})
export class KardexComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<KardexComponent>,public dialog: MatDialog
    ,@Inject(MAT_DIALOG_DATA) public data: any, public http2: HttpClient, private locStorage: LocalStorage) { }


  logs;

  date1 = new Date();
  date2 = new Date();

  ngOnInit(): void {
    if(!this.data.origin){


      this.date1 = this.data.date1;
      this.date2 = this.data.date2;
      this.http2.get(Urlbase.facturacion+"/pedidos/getKardex?id_store="+this.locStorage.getIdStore()+"&ownbarcode="+this.data.element.ownbarcode+"&date1="+this.data.date1+"&date2="+this.data.date2).subscribe( response => {
        this.logs = response;
      })

    }

  }


  excel(){
   console.log({producto: this.data.element.producto,
                linea: this.data.element.linea,
                categoria: this.data.element.categoria,
                date1: this.date1,
                date2: this.date2,
                log: this.logs})

  if(this.data.origin){
    this.http2.post(Urlbase.tienda + "/resource/kardex/Excel",{producto: this.data.element.producto,
      linea: this.data.element.linea,
      categoria: this.data.element.categoria,
      date1: this.date1,
      date2: this.date2,
      log: this.logs},{ responseType: 'text'}).subscribe(response => {
      CPrint(response);
      window.open(Urlbase.root+"reportes/"+response);
    })
  }else{
    this.http2.post(Urlbase.tienda + "/resource/kardex/Excel",{producto: this.data.element.product,
      linea: this.data.element.linea,
      categoria: this.data.element.categoria,
      date1: this.date1,
      date2: this.date2,
      log: this.logs},{ responseType: 'text'}).subscribe(response => {
      CPrint(response);
      window.open(Urlbase.root+"reportes/"+response);
    })
  }


  }

  getKardex(){
    if(this.data.origin){
      console.log(Urlbase.facturacion+"/pedidos/getKardex?id_store="+this.locStorage.getIdStore()+"&ownbarcode="+this.data.element.barcode+"&date1="+this.date1+"&date2="+this.date2)
      this.http2.get(Urlbase.facturacion+"/pedidos/getKardex?id_store="+this.locStorage.getIdStore()+"&ownbarcode="+this.data.element.barcode+"&date1="+this.date1+"&date2="+this.date2).subscribe( response => {
        this.logs = response;
        console.log(response)
      })
    }else{
      console.log(Urlbase.facturacion+"/pedidos/getKardex?id_store="+this.locStorage.getIdStore()+"&ownbarcode="+this.data.element.ownbarcode+"&date1="+this.date1+"&date2="+this.date2)
      this.http2.get(Urlbase.facturacion+"/pedidos/getKardex?id_store="+this.locStorage.getIdStore()+"&ownbarcode="+this.data.element.ownbarcode+"&date1="+this.date1+"&date2="+this.date2).subscribe( response => {
        this.logs = response;
        console.log(response)
      })
    }


  }



  close(){
    this.dialogRef.close();
  }


  billPdf(elem){
    console.log(elem)
    this.http2.get(Urlbase.facturacion+"/billing/UniversalPDF?id_bill="+elem.id_BILL+"&pdf=0&cash=0&size="+false,{responseType: 'text'}).subscribe(response =>{
      window.open(Urlbase.facturas+"/"+response, "_blank");
    })
  }
}
