import {Component, Inject, OnInit} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {TransactionConfirmDialogComponent} from '../transaction-confirm-dialog/transaction-confirm-dialog.component';
import {DialogData} from '../quantity-dialog/quantity-dialog.component';
import {HttpClient} from '@angular/common/http';
import {Urlbase} from '../../../../../../../shared/urls';

//import { HttpClient, HttpHeaders } from '@angular/common/http';

@Component({
  selector: 'app-notes-on-order',
  templateUrl: './notes-on-order.component.html',
  styleUrls: ['./notes-on-order.component.scss']
})
export class NotesOnOrderComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<TransactionConfirmDialogComponent>,public dialog: MatDialog
    ,@Inject(MAT_DIALOG_DATA) public data: any, public http2: HttpClient) { }

  ngOnInit() {
  }

  notes="";

  accept(){


    this.http2.post(Urlbase.tienda+"/store/confirmarPC?idbillcliente="+this.data.elem.id_BILL+"&notes="+this.notes,{}).subscribe(
      response => {
        this.dialogRef.close();
      })

    CPrint(this.data.elem.numdocumento);
  }

}

export interface DialogData2 {
  elem: any;
}
