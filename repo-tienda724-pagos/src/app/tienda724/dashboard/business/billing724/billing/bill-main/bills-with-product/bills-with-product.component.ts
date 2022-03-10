import {Component, Inject, OnInit} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import {MAT_DIALOG_DATA, MatDialog} from '@angular/material';
import {HttpClient} from '@angular/common/http';
import {Urlbase} from 'src/app/shared/urls';
import {LocalStorage} from 'src/app/services/localStorage';

@Component({
  selector: 'app-bills-with-product',
  templateUrl: './bills-with-product.component.html',
  styleUrls: ['./bills-with-product.component.css']
})
export class BillsWithProductComponent implements OnInit {

  constructor(public dialog: MatDialog
    ,@Inject(MAT_DIALOG_DATA) public data: DialogData,
    private http: HttpClient,
    private locStorage: LocalStorage,) { }

  items;
  ngOnInit(): void {
    CPrint(this.data.element.ownbarcode)
    this.http.get(Urlbase.facturacion + "/pedidos/own?code="+this.data.element.ownbarcode+"&id_store=" + this.data.id_store).subscribe( id_ps => {
      CPrint("id_PS: ", id_ps)
      CPrint("URL: ", Urlbase.facturacion + "/pedidos/bill4prods?id_ps="+id_ps+"&date1="+this.data.date1+"&date2="+this.data.date2);
      this.http.post(Urlbase.facturacion + "/pedidos/bill4prods?id_ps="+id_ps+"&date1="+this.data.date1+"&date2="+this.data.date2,{}).subscribe( bills => {
        CPrint("bills: ", bills)
        this.items = bills;
      })
    })
  }

  generatePdfRoute(elem){
    //let name = fullname.split(" ").join("_");

    this.http.get(Urlbase.facturacion+"/billing/validatePdfDrawing?idbill="+elem.id_BILL).subscribe(element => {
    this.http.get(Urlbase.facturacion+"/billing/UniversalPDF?id_bill="+elem.id_BILL+"&pdf=-1&cash=0&size="+false,{responseType: 'text'}).subscribe(response =>{

      //return Urlbase.root+"facturas/"+name+"_"+num_DOCUMENTO+".pdf";
      window.open(Urlbase.facturas+"/"+response, "_blank");
    });
  });
  }

}

export interface DialogData {
  element: any;
  id_store: any;
  date1: any;
  date2: any;
}
