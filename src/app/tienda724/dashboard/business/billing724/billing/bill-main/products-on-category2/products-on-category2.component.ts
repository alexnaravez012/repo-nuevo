import {Component, Inject, OnInit} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {CreatePriceComponent} from '../../bill-main/create-price/create-price.component';
import {LocalStorage} from '../../../../../../../services/localStorage';

@Component({
  selector: 'app-products-on-category2',
  templateUrl: './products-on-category2.component.html',
  styleUrls: ['./products-on-category2.component.scss']
})
export class ProductsOnCategoryComponent2 implements OnInit {
  productsOnCategory;
  category;
  constructor(public locStorage: LocalStorage, public dialogRef: MatDialogRef<ProductsOnCategoryComponent2>,public dialog: MatDialog,@Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {
    this.productsOnCategory = this.data.productsOnCategory
    this.category = this.data.category
    CPrint(this.data.productsOnCategory);
  }

  setCode(code){
    this.locStorage.setCodigoBarras(code);
    this.dialogRef.close();
  }

  gotoModal7(psName, psOwn) {

    var dialogRef
    dialogRef = this.dialog.open(CreatePriceComponent,{
      height: '450px',
      width: '500px',
      data: {
        psName: psName, psOwn: psOwn
      }
    })
    dialogRef.afterClosed().subscribe(res=>{
      this.ngOnInit();
    })
  }

}

export interface DialogData {
  productsOnCategory: any;
  category: any;
}

