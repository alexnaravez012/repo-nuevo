import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { HttpClient } from '@angular/common/http';
import { Urlbase } from 'src/app/shared/urls';
import { CPrint } from 'src/app/shared/util/CustomGlobalFunctions';

@Component({
  selector: 'app-log-pedidos',
  templateUrl: './log-pedidos.component.html',
  styleUrls: ['./log-pedidos.component.css']
})
export class LogPedidosComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<LogPedidosComponent>,public dialog: MatDialog
    ,@Inject(MAT_DIALOG_DATA) public data: any, public http2: HttpClient) { }

    logs;
    totalF=0;
    totalCF=0;
  ngOnInit(): void {
    console.log(this.data.element)
    this.http2.get(Urlbase.facturacion+"/pedidos/getDetailForPedido?id_bill="+this.data.element.id_BILL).subscribe(item =>  {
      //@ts-ignore
      this.logs = item;
      let date1F = new Date(this.logs[0].fecha_EVENTO)
      let date2F = new Date(this.logs[this.logs.length-1].fecha_EVENTO)

      let date1FC = new Date(this.logs[1].fecha_EVENTO)
      let date2FC = new Date(this.logs[this.logs.length-1].fecha_EVENTO)


      var dif = date2F.getTime() - date1F.getTime()
      var seconds2 = dif/60000;
      this.totalF = -Math.round(seconds2 * 10)/10;



      var difw = date2FC.getTime() - date1FC.getTime()
      var seconds = difw/60000;
      this.totalCF = -Math.round(seconds * 10)/10;


    })
  }

  excel(){
   console.log(JSON.stringify({documento: this.data.element.numdocumento,
                            pedidoCliente: this.data.element.numpedido,
                            cliente: this.data.element.cliente,
                            direccion: this.data.element.address,
                            telefono: this.data.element.phone,
                            tiempoTotal: this.totalF,
                            tiempoEntrega: this.totalCF,
                            log: this.logs}))
    this.http2.post(Urlbase.tienda + "/resource/logs/Excel",{documento: this.data.element.numdocumento,
      pedidoCliente: this.data.element.numpedido,
      cliente: this.data.element.cliente,
      direccion: this.data.element.address,
      telefono: this.data.element.phone,
      tiempoTotal: this.totalF,
      tiempoEntrega: this.totalCF,
      log: this.logs},{ responseType: 'text'}).subscribe(response => {
      CPrint(response);
      window.open(Urlbase.root+"reportes/"+response);
    })
  }

  close(){
    this.dialogRef.close();
  }


  getDateTime(i){


    try{
      let date1 = new Date(this.logs[i].fecha_EVENTO)
      let date2 = new Date(this.logs[i+1].fecha_EVENTO)

      var dif = date2.getTime() - date1.getTime()

      var seconds = dif/60000;

      var seconds_between_dates = -Math.round(seconds * 10)/10;

      return seconds_between_dates + " Mins"

    }catch(e){
      return "ESTADO INICIAL"
    }

  }

}
