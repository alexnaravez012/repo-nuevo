import {Component, Inject, OnInit} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {CreatePriceComponent} from '../../bill-main/create-price/create-price.component';
import {EditarCostoComponent} from '../../bill-main/editar-costo/editar-costo.component';

@Component({
  selector: 'app-products-on-category',
  templateUrl: './products-on-category.component.html',
  styleUrls: ['./products-on-category.component.scss']
})
export class ProductsOnCategoryComponent implements OnInit {
  productsOnCategory;
  category
  constructor(public dialogRef: MatDialogRef<ProductsOnCategoryComponent>,public dialog: MatDialog,@Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {
    this.productsOnCategory = this.data.productsOnCategory
    this.category = this.data.category
    CPrint(this.data.productsOnCategory);
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

  getTotalCant(){
    let sum=0;
    this.productsOnCategory.forEach(element => {
      sum+=element.quantity;
    });
    return sum;
  }



  getTotalProd(){
   return this.productsOnCategory.length;
  }

  editCost(psName, psOwn) {

    var dialogRef
    dialogRef = this.dialog.open(EditarCostoComponent,{
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

