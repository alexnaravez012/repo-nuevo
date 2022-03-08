import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LocalStorage } from 'src/app/services/localStorage';
import { Urlbase } from 'src/app/shared/urls';
let $: any = jQuery;
import * as jQuery from 'jquery';
import 'bootstrap-notify';
import * as bcrypt from 'bcryptjs';

@Component({
  selector: 'app-select-cancel-admin',
  templateUrl: './select-cancel-admin.component.html',
  styleUrls: ['./select-cancel-admin.component.css']
})
export class SelectCancelAdminComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<SelectCancelAdminComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, 
              public dialog: MatDialog, 
              private httpClient: HttpClient, 
              public locStorage: LocalStorage) { }

  admins;
  selectedPassword;
  password;

  ngOnInit(): void {
    console.log("DATA: ",this.data);
    this.httpClient.get(Urlbase.tienda+"/resource/adminusers?idrol="+23+"&id_store="+this.data.idStore).subscribe(response => {
      this.admins = response;
      this.selectedPassword = response[0].clave;
    })
  }

  validate(){
    const salt = bcrypt.genSaltSync(12);

    let pass = bcrypt.hashSync(this.password, salt);
    bcrypt.compare(this.password,this.selectedPassword).then((result)=>{
      if(result){
        console.log("authentication successful")
        this.httpClient.post(Urlbase.facturacion +"/billing/actualizarEstadoMesa?IDBILL="+this.data.idbill+"&IDESTADODESTINO="+this.data.state+"&nota="+this.data.notes+"&IDESTADOORIGEN="+this.data.originState+"&IDTHIRDUSER="+this.data.idthird+"&ACTOR=P",{}).subscribe(result => {
          if(result == 1){
            this.showNotification('top', 'center', 3, "<h3>Mesa Cancelada.</h3> ", 'info');
            this.dialogRef.close({
              resp: 1
            });
          }else{
            this.showNotification('top', 'center', 3, "<h3>Se presento un error al cancelar la mesa.</h3> ", 'danger');
          }
        }) 
      } else {
        console.log("authentication failed. Password doesn't match")
        this.showNotification('top', 'center', 3, "<h3>Se presento un error al validar la autenticacion del administrador.</h3> ", 'danger');
    
      }
    })   
  }

  cancel(){
    this.dialogRef.close({
      resp: 0
    });
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
