import {Component, Inject, OnInit} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {HttpClient} from '@angular/common/http';
import {Urlbase} from '../../../../../../../shared/urls';

//import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-no-disp-comp',
  templateUrl: './no-disp-comp.component.html',
  styleUrls: ['./no-disp-comp.component.scss']
})
export class NoDispCompComponent implements OnInit {

  constructor(private http2: HttpClient, public dialogRef: MatDialogRef<NoDispCompComponent>,public dialog: MatDialog
    ,@Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  vencimiento =0;
  averia =0;
  devolucion =0;
  traslado =0;
  robo =0;
  ngOnInit() {
    CPrint(this.data.stores, this.data.code)
    this.http2.get(Urlbase.tienda + "/resource/nodisponibles?idbill=-4001&listStore="+this.data.stores+"&code="+this.data.code).subscribe(res => {
      //@ts-ignore
      this.vencimiento = res;
    })
    this.http2.get(Urlbase.tienda + "/resource/nodisponibles?idbill=-4002&listStore="+this.data.stores+"&code="+this.data.code).subscribe(res => {
      //@ts-ignore
      this.averia = res;
    })
    this.http2.get(Urlbase.tienda + "/resource/nodisponibles?idbill=-4003&listStore="+this.data.stores+"&code="+this.data.code).subscribe(res => {
      //@ts-ignore
      this.devolucion = res;
    })
    this.http2.get(Urlbase.tienda + "/resource/nodisponibles?idbill=-4004&listStore="+this.data.stores+"&code="+this.data.code).subscribe(res => {
      //@ts-ignore
      this.traslado = res;
    })
    this.http2.get(Urlbase.tienda + "/resource/nodisponibles?idbill=-4005&listStore="+this.data.stores+"&code="+this.data.code).subscribe(res => {
      //@ts-ignore
      this.robo = res;
    })
  }

}

export interface DialogData {
  stores: any, code: any
}
