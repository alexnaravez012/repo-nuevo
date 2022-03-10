import {Component, Inject, OnInit} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {HttpClient} from '@angular/common/http';
import {Urlbase} from 'src/app/shared/urls';

@Component({
  selector: 'app-detalle-planillas',
  templateUrl: './detalle-planillas.component.html',
  styleUrls: ['./detalle-planillas.component.css']
})
export class DetallePlanillasComponent implements OnInit {

  constructor(private http: HttpClient, public dialogRef: MatDialogRef < DetallePlanillasComponent > , public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: DialogData) { }


  detailList = [];

  ngOnInit(): void {
    this.http.get(Urlbase.tienda+"/pedidos/planillas/detalles?idplanilla="+this.data.idPlanilla).subscribe(
      response => {
        //@ts-ignore
        this.detailList = response;
        CPrint(response)
      }
    )
  }


  generatePdfRoute(elem){
    //let name = fullname.split(" ").join("_");
    this.http.get(Urlbase.facturacion+"/billing/UniversalPDF?id_bill="+elem.id_BILL_FACTURA+"&pdf=-1&cash=0&size="+false,{responseType: 'text'}).subscribe(response =>{

      //return Urlbase.root+"facturas/"+name+"_"+num_DOCUMENTO+".pdf";
      window.open(Urlbase.facturas+"/"+response, "_blank");
    });
  }

}


export interface DialogData {
  idPlanilla: any
}

