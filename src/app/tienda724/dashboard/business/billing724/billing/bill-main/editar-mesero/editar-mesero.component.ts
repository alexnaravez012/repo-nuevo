import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LocalStorage } from 'src/app/services/localStorage';
import { Urlbase } from 'src/app/shared/urls';

@Component({
  selector: 'app-editar-mesero',
  templateUrl: './editar-mesero.component.html',
  styleUrls: ['./editar-mesero.component.css']
})
export class EditarMeseroComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<EditarMeseroComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, public dialog: MatDialog ,private httpClient: HttpClient, public locStorage: LocalStorage) { }

  domiList;
  selectedDomi;

  ngOnInit(): void {
    console.log(this.data)
    this.httpClient.get(Urlbase.facturacion + "/billing/domiciliarios?id_store="+this.locStorage.getIdStore()).subscribe(data => {
      this.domiList = data;
      this.selectedDomi = this.locStorage.getToken().id_third;
      console.log(data)
    });
  }

  acept(){
    this.httpClient.post(Urlbase.facturacion + "/billing/asignarMeseroPedido?idbprov="+this.data.item.idbill+"&id_third_mesero="+this.selectedDomi,{}).subscribe(response => {
      if(response == 1){
        this.dialogRef.close({meseroNew: this.findMeseroName() });
      }else{
        alert("Se presento un error.");
      }
    })
  }

  findMeseroName(){
    return this.domiList.filter(i => i.id_THIRD_DOMICILIARIO == this.selectedDomi);
  }

  close(){
    this.dialogRef.close();
  }

}
