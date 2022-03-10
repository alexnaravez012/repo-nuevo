import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-notes-modal',
  templateUrl: './notes-modal.component.html',
  styleUrls: ['./notes-modal.component.scss']
})
export class NotesModalComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<NotesModalComponent>) { }

  ngOnInit() {
  }

  notes=" "

  close(){
    this.dialogRef.close({
      resp: false,
      notes: " "
    });

  }

  acept(){

    this.dialogRef.close({
      resp: true,
      notes:this.notes
    });

  }
}
