import {Component, OnInit, ViewChild, Inject} from '@angular/core';
import { NewPersonComponent } from '../../../../thirds724/third/new-person/new-person.component';
import { NewThirdComponent } from '../../../../thirds724/third/new-third/new-third.component';
import { MatDialog, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material';

@Component({
  selector: 'app-generate-third-component2',
  templateUrl: './generate-third-component2.component.html',
  styleUrls: ['./generate-third-component2.component.scss']
})
export class GenerateThirdComponent2Component implements OnInit {

  constructor(public dialogRef: MatDialogRef<GenerateThirdComponent2Component>,public dialog: MatDialog
    ,@Inject(MAT_DIALOG_DATA) public data: any) { }


  
  @ViewChild("nuevaPersona") newPerson: NewPersonComponent;
  @ViewChild("nuevaEmpresa") newThird: NewThirdComponent;


  ngOnInit() {

  }


  close(){
    console.log("NEW PERSON:",{
      person:this.newPerson.thirdDTO,
      idThird: this.newPerson.idThirdResponse,
      isPerson: true
    })
    this.dialogRef.close({
      person:this.newPerson.thirdDTO,
      idThird: this.newPerson.idThirdResponse,
      isPerson: true
    });
   }

   closeThird(){
    console.log("NEW EMP:",{
      emp:this.newThird.thirdDTO,
      idThird: this.newThird.idThirdResponse,
      isPerson: false
    })
    this.dialogRef.close({
      emp:this.newThird.thirdDTO,
      idThird: this.newThird.idThirdResponse,
      isPerson: false
    });
   }
}
