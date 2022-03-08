import {Component, Inject, OnInit} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {BillingService} from '../../../../../../../services/billing.service';

@Component({
  selector: 'app-add-category',
  templateUrl: './add-category.component.html',
  styleUrls: ['./add-category.component.scss']
})
export class AddCategoryComponent implements OnInit {

  constructor(public categoriesService: BillingService ,public dialogRef: MatDialogRef<AddCategoryComponent>,public dialog: MatDialog,@Inject(MAT_DIALOG_DATA) public data: DialogData) { }
  categoryToPut
  categoryToPost
  editing
  idCategory2
  ngOnInit() {
    this.categoryToPost = this.data.categoryToPost
    this.categoryToPut = this.data.categoryToPut
    this.editing = this.data.editing
    this.idCategory2 = this.data.idCategory2
  }

  createNewCategory(){
    if(!this.editing){
      CPrint(this.categoryToPost);
      this.categoriesService.postCategory(this.categoryToPost).subscribe(res=>{
        this.dialogRef.close()
      })
    }else{
      this.categoriesService.putCategory(this.categoryToPut,this.idCategory2).subscribe(res=>{
        this.dialogRef.close()
      })
    }
    CPrint(this.categoryToPost);
  }

}



export interface DialogData {
  categoryToPut: any;
  categoryToPost: any;
  editing: any;
  idCategory2: any;
}
