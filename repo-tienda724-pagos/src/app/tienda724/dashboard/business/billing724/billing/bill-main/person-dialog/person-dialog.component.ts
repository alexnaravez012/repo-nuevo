import {Component} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';

@Component({
  selector: 'app-person-dialog',
  templateUrl: './person-dialog.component.html',
  styleUrls: ['./person-dialog.component.scss']
})

export class PersonDialogComponent{
  tipo=0;
  constructor(
    // public dialogRef: MatDialogRef<PersonDialogComponent>,
    // @Inject(MAT_DIALOG_DATA) public data: DialogData
    ) {}

  onNoClick(): void {
    //this.dialogRef.close();
  }

  closeDialog() {
    //this.dialogRef.close(this.data);
  }
  save(event){
    CPrint('ESTE ES EL RESULTADO:::'+JSON.stringify(event));
    //this.dialogRef.close(event);
  }

}
export interface DialogData {
  is_natural_person:boolean;
  first_name: string;
  second_name: string;
  first_lastname: string;
  second_lastname: string;
  document_type:string;
  document_number:string;
  address:string;
  phone:string;
  country:string;
  city:string;
  email:string;
}
