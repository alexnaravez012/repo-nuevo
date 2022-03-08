import {Component, Inject, OnInit} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {LocalStorage} from '../../../../../../services/localStorage';
import { UpdateThirdInfoComponent } from '../bill-main/update-third-info/update-third-info.component';

@Component({
  selector: 'app-thirdselect',
  templateUrl: './thirdselect.component.html',
  styleUrls: ['./thirdselect.component.scss']
})
export class ThirdselectComponent implements OnInit {

  constructor(private locStorage: LocalStorage,
    public dialogRef: MatDialogRef<ThirdselectComponent>,public dialog: MatDialog
    ,@Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  listPerson;

  ngOnInit() {
    CPrint("THIS IS THIRD LIST, ",this.data.thirdList)
    this.listPerson = this.data.thirdList;
  }

  returnData(elem){
    this.locStorage.setPersonClient(elem);
    this.dialogRef.close({
      didDo: true
    });
  }

  closeWin(){
    this.dialogRef.close({
      didDo:false
    });
  }

  openUpdateThird(elem){
    const dialogRef2 = this.dialog.open(UpdateThirdInfoComponent, {
      width: '60vw',
      height: '50vh',
      data: { elem }
    });

    dialogRef2.afterClosed().subscribe(result => {
      if(result.reps){
        this.dialogRef.close();
      }else{

      }
    });
  }

}

export interface DialogData {
  thirdList: any;
}
