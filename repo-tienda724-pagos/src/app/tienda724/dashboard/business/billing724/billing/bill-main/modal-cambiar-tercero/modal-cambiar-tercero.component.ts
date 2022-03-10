import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-modal-cambiar-tercero',
  templateUrl: './modal-cambiar-tercero.component.html',
  styleUrls: ['./modal-cambiar-tercero.component.css']
})
export class ModalCambiarTerceroComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ModalCambiarTerceroComponent>
    ,@Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog,) { }

  ngOnInit(): void {
  }

  acept(){
    this.dialogRef.close({response: true})

  }

  close(){
    this.dialogRef.close({response: false})
  }

}
