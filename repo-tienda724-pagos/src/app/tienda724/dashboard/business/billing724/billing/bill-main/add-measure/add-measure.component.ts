import {Component, Inject, OnInit} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import {BillingService} from '../../../../../../../services/billing.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-add-measure',
  templateUrl: './add-measure.component.html',
  styleUrls: ['./add-measure.component.scss']
})
export class AddMeasureComponent implements OnInit {

  constructor(public categoriesService: BillingService ,public dialogRef: MatDialogRef<AddMeasureComponent>,public dialog: MatDialog,@Inject(MAT_DIALOG_DATA) public data: DialogData) { }
  measureToPost;
  lastMeasure;
  editingMeasure;
  measureToEdit;
  ngOnInit() {
    this.measureToPost = this.data.measureToPost;
    this.lastMeasure = this.data.lastMeasure;
    this.editingMeasure = this.data.editingMeasure;
    this.measureToEdit = this.data.measureToEdit
  }

  createMeassureUnit(){
    CPrint(this.measureToPost);
    CPrint(this.lastMeasure);
    if(!this.editingMeasure){
      this.categoriesService.postMeasureUnit(this.measureToPost).subscribe(res=>{
        this.dialogRef.close()
      });

    }else{
      this.measureToEdit.MUDescription = this.measureToPost.MUDescription;
      this.measureToEdit.MUName = this.measureToPost.MUName;
      if(this.measureToPost.id_measure_unit_father){
        this.measureToEdit.id_measure_unit_father = this.measureToPost.id_measure_unit_father
      }
      CPrint(this.measureToEdit);
      this.categoriesService.putMeasureUnit(this.measureToEdit,this.measureToPost.id_measure).subscribe(res=>{
        this.dialogRef.close()
      })
    }
  }

}

export interface DialogData {
  measureToPost: any;
  lastMeasure: any;
  editingMeasure: any;
  measureToEdit: any;
}
