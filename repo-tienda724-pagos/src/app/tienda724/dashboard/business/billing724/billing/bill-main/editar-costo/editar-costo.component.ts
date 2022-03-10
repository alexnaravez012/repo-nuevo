import {Component, Inject, OnInit} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
//import { HttpClient } from '@angular/common/http';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {LocalStorage} from '../../../../../../../services/localStorage';
import {HttpClient} from '@angular/common/http';
import * as jQuery from 'jquery';
import 'bootstrap-notify';
import {Urlbase} from '../../../../../../../shared/urls';

let $: any = jQuery;

@Component({
  selector: 'app-editar-costo',
  templateUrl: './editar-costo.component.html',
  styleUrls: ['./editar-costo.component.scss']
})
export class EditarCostoComponent implements OnInit {

  constructor(@Inject(MAT_DIALOG_DATA) public data: DialogData,private http2: HttpClient,public locStorage: LocalStorage,public dialogRef: MatDialogRef<EditarCostoComponent>) { }
  psName = "";
  psOwn = "";
  ps;
  newCost = 0;
  costoActual = 0;
  ngOnInit() {
    CPrint(this.data)
    this.psName = this.data.psName;
    this.psOwn = this.data.psOwn;
    this.http2.get(Urlbase.tienda + "/store/psid?&code="+this.psOwn+"&id_store="+this.locStorage.getIdStore()).subscribe(response => {
      this.ps = response;
      CPrint(this.ps);
      this.http2.get(Urlbase.tienda + "/store/stPriceByPs?id_ps="+response).subscribe(resp => {
        //@ts-ignore
        this.newCost = resp;
        //@ts-ignore
        this.costoActual = resp;
      });
    });

  }

  updateStandardPrice(){
    try{
      this.http2.put(Urlbase.tienda + "/store/standardprice?standard_price="+this.newCost+"&id_ps="+this.ps,null).subscribe(response => {
        this.showNotification('top','center',3,"<h3 class = 'text-center'>Se actualizo el precio de compra Exitosamente<h3>",'info');
        this.dialogRef.close();
      })
    }catch(Exception){
      this.showNotification('top','center',3,"<h3 class = 'text-center'>No se pudo actualizar el precio de compra.<h3>",'Danger');
    }

  }


  showNotification(from, align, id_type?, msn?, typeStr?) {
    const type = ['', 'info', 'success', 'warning', 'danger'];

    const color = Math.floor((Math.random() * 4) + 1);

    $.notify({
      icon: "notifications",
      message: msn ? msn : "<b>Noficación automatica </b>"

    }, {
        type: typeStr ? typeStr : type[id_type ? id_type : 2],
        timer: 200,
        placement: {
          from: from,
          align: align
        }
      });
  }


}


export interface DialogData {
  psName: any;
  psOwn: any;
}
