import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { Urlbase } from 'src/app/shared/urls';
import { CPrint } from 'src/app/shared/util/CustomGlobalFunctions';

@Component({
  selector: 'app-pedidos-domicilios-planillas',
  templateUrl: './pedidos-domicilios-planillas.component.html',
  styleUrls: ['./pedidos-domicilios-planillas.component.css']
})
export class PedidosDomiciliosPlanillasComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<PedidosDomiciliosPlanillasComponent>,public dialog: MatDialog,private httpClient: HttpClient
    ,@Inject(MAT_DIALOG_DATA) public data: any) { }

  planillaDetails;
  total=0;
  ngOnInit(): void {
    this.httpClient.get(Urlbase.facturacion + "/pedidos/getDatosPlanilla?id_planilla="+this.data.idPlanilla).subscribe( result => {
      CPrint(result);
      this.planillaDetails = result
      //@ts-ignore
      result.forEach(element => {
        this.total+=element.totalprice;
      });

    })
  }

  PDF(elem){
    this.httpClient.get(Urlbase.facturacion+"/billing/UniversalPDF?id_bill="+elem.id_BILL+"&pdf=-1&cash=0&size="+false,{responseType: 'text'}).subscribe(response =>{
      //-----------------------------------------------------------------------------------------------------------------
      window.open(Urlbase.facturas+"/"+response, "_blank");
    });
  }

}
