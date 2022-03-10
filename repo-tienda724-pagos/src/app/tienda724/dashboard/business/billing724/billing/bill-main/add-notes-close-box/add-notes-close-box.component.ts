import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-add-notes-close-box',
  templateUrl: './add-notes-close-box.component.html',
  styleUrls: ['./add-notes-close-box.component.scss']
})
export class AddNotesCloseBoxComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<AddNotesCloseBoxComponent>) { }
  movementNotas = "";
  ngOnInit() {
    this.movementNotas = ""
  }


  addNotes(){
    this.dialogRef.close(this.movementNotas)
  }

}
