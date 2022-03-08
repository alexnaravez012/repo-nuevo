import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-modal-crear-como-proveedor',
  templateUrl: './modal-crear-como-proveedor.component.html',
  styleUrls: ['./modal-crear-como-proveedor.component.css']
})
export class ModalCrearComoProveedorComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ModalCrearComoProveedorComponent>
    ,@Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog,) { }

  name;

  ngOnInit(): void {
    this.name = this.data.proveedor;
    console.log(this.data)

  }

  acept(){
    this.dialogRef.close({response: true})

  }

  close(){
    this.dialogRef.close({response: false})
  }

}
