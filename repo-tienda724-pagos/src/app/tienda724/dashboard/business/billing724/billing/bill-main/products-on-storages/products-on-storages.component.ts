import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-products-on-storages',
  templateUrl: './products-on-storages.component.html',
  styleUrls: ['./products-on-storages.component.scss']
})
export class ProductsOnStoragesComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ProductsOnStoragesComponent>,public dialog: MatDialog,@Inject(MAT_DIALOG_DATA) public data: DialogData) { }
  currentStorage
  name
  ngOnInit() {
    this.currentStorage = this.data.currentStorage
    this.name = this.data.name
  }

}

export interface DialogData {
  currentStorage: any;
  name: any;
}
