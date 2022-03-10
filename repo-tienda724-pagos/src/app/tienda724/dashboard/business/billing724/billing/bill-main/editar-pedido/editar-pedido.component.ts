import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LocalStorage } from 'src/app/services/localStorage';
import { Urlbase } from 'src/app/shared/urls';

@Component({
  selector: 'app-editar-pedido',
  templateUrl: './editar-pedido.component.html',
  styleUrls: ['./editar-pedido.component.css']
})
export class EditarPedidoComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<EditarPedidoComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,private httpClient: HttpClient,
    public locStorage: LocalStorage,
    public dialog: MatDialog,) { }

  setStatus = "1501";
  notas="";
  ngOnInit(): void {
    console.log("THIS IS DATA: "+this.data);
  }


  close(){
    this.dialogRef.close();
  }

  send(){
    let item = this.data.item

    console.log(this.locStorage.getToken());
    console.log(item.estado!="CANCELADO");
    let idestadoorigen;
    let idestadofinal;
    idestadofinal = this.setStatus;
    if(item.estado=='CANCELADO'){
      idestadoorigen = 1599;
    }
    if(item.estado=='ENTREGADO EN MESA'){
      idestadoorigen = 1503;
    }
    if(item.estado=='ENTREGADO A MESERO'){
      idestadoorigen = 1502;
    }
    if(item.estado=='EN PROCESO'){
      idestadoorigen = 1501;
    }

    let color = "azul";
    if(idestadofinal==1599){
      color = "rojo"
    }
    if(idestadofinal==1503){
      color = "azul";
    }
    if(idestadofinal==1501){
      color = "amarillo"
    }
    if(idestadofinal==1502){
      color = "naranja"
    }
    if((item.estado!="CANCELADO")){
      console.log(Urlbase.facturacion + "/billing/actualizarEstadoPedidoMesa?ID_DETALLE_DETAIL_BILL="+item.id_DETALLE_DETAIL_BILL+"&IDESTADODESTINO="+idestadofinal+"&notas="+this.notas+"&IDESTADOORIGEN="+idestadoorigen+"&IDTHIRDUSER="+this.locStorage.getToken().id_third+"&ACTOR=P");
    
      this.httpClient.post(Urlbase.facturacion + "/billing/actualizarEstadoPedidoMesa?ID_DETALLE_DETAIL_BILL="+item.id_DETALLE_DETAIL_BILL+"&IDESTADODESTINO="+idestadofinal+"&notas="+this.notas+"&IDESTADOORIGEN="+idestadoorigen+"&IDTHIRDUSER="+this.locStorage.getToken().id_third+"&ACTOR=P",{}).subscribe(response => {
        if(response == 1){
          this.dialogRef.close({color: color});
        }
      })
    }



  }

}
