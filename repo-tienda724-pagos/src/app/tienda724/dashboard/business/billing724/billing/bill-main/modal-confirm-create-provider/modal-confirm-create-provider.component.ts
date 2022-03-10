import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-modal-confirm-create-provider',
  templateUrl: './modal-confirm-create-provider.component.html',
  styleUrls: ['./modal-confirm-create-provider.component.css']
})
export class ModalConfirmCreateProviderComponent implements OnInit {


  constructor(public dialogRef: MatDialogRef<ModalConfirmCreateProviderComponent>
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
