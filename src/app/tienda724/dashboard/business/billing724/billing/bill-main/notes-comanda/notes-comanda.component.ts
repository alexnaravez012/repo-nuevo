import { Component, Inject, OnInit } from '@angular/core';
import { MAT_DIALOG_DATA } from '@angular/material';

@Component({
  selector: 'app-notes-comanda',
  templateUrl: './notes-comanda.component.html',
  styleUrls: ['./notes-comanda.component.css']
})
export class NotesComandaComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: any) { }

  list:any;

  ngOnInit(): void {
    console.log(this.data);
    this.list = this.data.element.notas.split(";");
  }

}
