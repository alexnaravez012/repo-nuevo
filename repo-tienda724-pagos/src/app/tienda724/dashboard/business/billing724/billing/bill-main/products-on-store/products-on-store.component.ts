import {Component, Inject, OnInit} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {BillingService} from '../../../../../../../services/billing.service';
import {ProductsOnStoragesComponent} from '../products-on-storages/products-on-storages.component';

@Component({
  selector: 'app-products-on-store',
  templateUrl: './products-on-store.component.html',
  styleUrls: ['./products-on-store.component.scss']
})
export class ProductsOnStoreComponent implements OnInit {
  currentStorages;
  storeName;
  constructor(public storeService: BillingService, public dialogRef: MatDialogRef<ProductsOnStoreComponent>,public dialog: MatDialog,@Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {
    this.currentStorages = this.data.currentStorages
    this.storeName = this.data.storeName
  }

  showStorage(storage){
    CPrint(storage,"sastora")
    this.storeService.getProductsByStorage(storage.id_storage).subscribe(res=>{
      CPrint(res);
      var dialogRef
      dialogRef = this.dialog.open(ProductsOnStoragesComponent,{
        height: '400px',
        width: '700px',
        data: {
          currentStorage: res, name: storage.storage_name
        }
      })

    })

  }

}

export interface DialogData {
  currentStorages: any;
  storeName: any;
}
