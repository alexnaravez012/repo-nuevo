import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-modal-confirmar-cancelacion-pedido',
  templateUrl: './modal-confirmar-cancelacion-pedido.component.html',
  styleUrls: ['./modal-confirmar-cancelacion-pedido.component.css']
})
export class ModalConfirmarCancelacionPedidoComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ModalConfirmarCancelacionPedidoComponent>
    ,@Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog,) { }

  name;
  notes = "";

  ngOnInit(): void {
  }

  acept(){
    this.dialogRef.close({response: true, notas: this.notes})

  }

  close(){
    this.dialogRef.close({response: false})
  }
}
