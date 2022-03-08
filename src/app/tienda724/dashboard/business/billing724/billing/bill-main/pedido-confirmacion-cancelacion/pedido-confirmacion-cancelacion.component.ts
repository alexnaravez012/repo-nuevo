import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from '../pedidos-detail/pedidos-detail.component';

@Component({
  selector: 'app-pedido-confirmacion-cancelacion',
  templateUrl: './pedido-confirmacion-cancelacion.component.html',
  styleUrls: ['./pedido-confirmacion-cancelacion.component.css']
})
export class PedidoConfirmacionCancelacionComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<PedidoConfirmacionCancelacionComponent>,public dialog: MatDialog
    ,@Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit(): void {
  }

  obs="";

  accept(){
    this.dialogRef.close({
      response:true,
      obs:this.obs
    });
  }

}
 