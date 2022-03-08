import {Component, OnInit} from '@angular/core';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-notes-modal',
  templateUrl: './notes-modal2.component.html',
  styleUrls: ['./notes-modal2.component.css']
})
export class NotesModal2Component implements OnInit {

  constructor(public dialogRef: MatDialogRef<NotesModal2Component>) { }

  ngOnInit() {
  }

  notes=" "
  monedas = "";
  billetes = "";
  total = "";

  close(){
    this.dialogRef.close({
      resp: false,
      notes: " ",
      billetes: this.billetes,
      monedas: this.monedas,
      total: this.total
    });

  }

  acept(){

    this.dialogRef.close({
      resp: true,
      notes:this.notes,
      billetes: this.billetes,
      monedas: this.monedas,
      total: this.total
    });

  }
}
