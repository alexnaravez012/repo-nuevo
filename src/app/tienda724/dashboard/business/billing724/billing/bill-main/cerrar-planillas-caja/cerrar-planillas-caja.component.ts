import { Component, OnInit, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import { HttpClient } from '@angular/common/http';
import { LocalStorage } from 'src/app/services/localStorage';
import { TransactionConfirmDialogComponent } from '../transaction-confirm-dialog/transaction-confirm-dialog.component';
import { PedidosDomiciliosCerrarPlanillasComponent } from '../pedidos-domicilios-cerrar-planillas/pedidos-domicilios-cerrar-planillas.component';
import { Urlbase } from 'src/app/shared/urls';

@Component({
  selector: 'app-cerrar-planillas-caja',
  templateUrl: './cerrar-planillas-caja.component.html',
  styleUrls: ['./cerrar-planillas-caja.component.css']
})
export class CerrarPlanillasCajaComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any, private httpClient: HttpClient, private locStorage: LocalStorage,
  public dialogRef: MatDialogRef<CerrarPlanillasCajaComponent>,public dialog: MatDialog) { }
  list;
  ngOnInit(): void {
    CPrint("I NEED THIS: ITS DATAAAS:")
    CPrint(this.data.resp)
    this.list = this.data.resp;
  }

  closePlanilla(item){

    const dialogRef = this.dialog.open(PedidosDomiciliosCerrarPlanillasComponent, {
      width: '120vw',
      height: '80vh',
      data: {idPlanilla: item.id_PLANILLA,
        blockedObs: false,
        myStateId: 809}
    });

    dialogRef.afterClosed().subscribe(result => {

      this.httpClient.get(Urlbase.facturacion+"/pedidos/getPlanillasData/cierreCaja?id_cierre_caja="+this.data.id_cierre_caja+"&status=C").subscribe(resp => {
        CPrint("IM IN")
          this.list = resp;
          //@ts-ignore
          if(resp.length<=0){
            this.dialogRef.close();
          }
      });

    });




  }

  close(){
    this.dialogRef.close();
  }

}
