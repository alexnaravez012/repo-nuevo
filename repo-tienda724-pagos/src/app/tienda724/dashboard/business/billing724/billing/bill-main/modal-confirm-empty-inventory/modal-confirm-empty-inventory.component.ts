import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-modal-confirm-empty-inventory',
  templateUrl: './modal-confirm-empty-inventory.component.html',
  styleUrls: ['./modal-confirm-empty-inventory.component.css']
})
export class ModalConfirmEmptyInventoryComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ModalConfirmEmptyInventoryComponent>
    ,@Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog,) { }

  name;

  ngOnInit(): void {
  }

  acept(){
    this.dialogRef.close({response: true})

  }

  close(){
    this.dialogRef.close({response: false})
  }
}
