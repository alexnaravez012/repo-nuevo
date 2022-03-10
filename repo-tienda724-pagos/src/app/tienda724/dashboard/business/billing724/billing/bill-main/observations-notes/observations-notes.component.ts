import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-observations-notes',
  templateUrl: './observations-notes.component.html',
  styleUrls: ['./observations-notes.component.css']
})
export class ObservationsNotesComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<ObservationsNotesComponent>,public dialog: MatDialog
    ,@Inject(MAT_DIALOG_DATA) public data: any, public http2: HttpClient) { }

  notes = "";
  ngOnInit(): void {
    this.notes = this.data.obs;
  }

}
