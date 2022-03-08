import {Component, Inject, OnInit} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import {BillingService} from '../../../../../../../services/billing.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-add-brand',
  templateUrl: './add-brand.component.html',
  styleUrls: ['./add-brand.component.scss']
})
export class AddBrandComponent implements OnInit {

  constructor(public categoriesService: BillingService ,public dialogRef: MatDialogRef<AddBrandComponent>,public dialog: MatDialog,@Inject(MAT_DIALOG_DATA) public data: DialogData) { }
  brandToPost
  lastBrand
  editingBrand
  brandToEdit
  ngOnInit() {
    this.brandToPost = this.data.brandToPost
    this.lastBrand = this.data.lastBrand
    this.editingBrand = this.data.editingBrand
    this.brandToEdit = this.data.brandToEdit
  }

  createBrand(){
      CPrint(this.brandToPost);
      CPrint(this.lastBrand);
      if(this.editingBrand){
        this.brandToEdit.url_img = this.brandToPost.url_IMG;
        this.brandToEdit.brand = this.brandToPost.brand;
        this.categoriesService.putBrand(this.brandToEdit,this.brandToPost.id_BRAND).subscribe(res=>{
          this.dialogRef.close()
        })
      }else{
        this.categoriesService.postBrand(this.brandToPost).subscribe(res=>{
          this.dialogRef.close()

        });
      }

  }



}

export interface DialogData {
  brandToPost: any;
  lastBrand: any;
  editingBrand: any;
  brandToEdit: any;
}
