import { Component, OnInit, Inject } from '@angular/core';
import { LocalStorage } from 'src/app/services/localStorage';
import { MatDialogRef, MatDialog, MAT_DIALOG_DATA } from '@angular/material';
import { DialogData } from '../pedidos-detail/pedidos-detail.component';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Urlbase } from 'src/app/shared/urls';
import * as jQuery from 'jquery';
let $: any = jQuery;



@Component({
  selector: 'app-update-third-info',
  templateUrl: './update-third-info.component.html',
  styleUrls: ['./update-third-info.component.css']
})
export class UpdateThirdInfoComponent implements OnInit {

  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private locStorage: LocalStorage,
    public dialogRef: MatDialogRef<UpdateThirdInfoComponent>,public dialog: MatDialog
    ,@Inject(MAT_DIALOG_DATA) public data: DialogData,private httpClient: HttpClient
    ) { }


    phone;
    address;
    mail;

  ngOnInit(): void {
    console.log("ELEMENT")
    console.log(this.data)
    this.headers = new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization':  this.locStorage.getTokenValue(),
    });


  }




  updateThird(){

    this.httpClient.post(Urlbase.tercero + "/thirds/updateThird?idthird="+this.data.elem.id_PERSON+"&addressc="+this.data.elem.address+"&phonec="+this.data.elem.phone+"&mailc="+this.data.elem.city,{} ,{headers: this.headers}).subscribe(response => {
      if(response == 1){
        this.showNotification('top', 'center', 3, "<h3>SE ACTUALIZO EXITOSAMENTE EL TERCERO</h3> ", 'info');
        this.dialogRef.close({reps: true})
      }else{
        this.showNotification('top', 'center', 3, "<h3>ALGO FALLO AL ACTUALIZAR EL TERCERO</h3> ", 'Danger');
      }
    });

  }


  close(){
    this.dialogRef.close();
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
