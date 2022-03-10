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
  selector: 'app-select-cancel-admin-disccount',
  templateUrl: './select-cancel-admin-disccount.component.html',
  styleUrls: ['./select-cancel-admin-disccount.component.css']
})
export class SelectCancelAdminDisccountComponent implements OnInit {

  constructor(public dialogRef: MatDialogRef<SelectCancelAdminDisccountComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any, 
              public dialog: MatDialog, 
              private httpClient: HttpClient, 
              public locStorage: LocalStorage) { }

  admins;
  selectedPassword;
  password;

  ngOnInit(): void {
    console.log("DATA: ",this.data);
    console.log("URL: ",Urlbase.tienda+"/resource/adminusers?idrol="+23+"&id_store="+this.data.idStore);
    this.httpClient.get(Urlbase.tienda+"/resource/adminusers?idrol="+23+"&id_store="+this.data.idStore).subscribe(response => {
      this.admins = response;
      this.selectedPassword = response[0].clave;
    })
  }

  validate(){
    const salt = bcrypt.genSaltSync(12);
    
    bcrypt.compare(this.password,this.selectedPassword).then((result)=>{
      if(result){
        console.log("authentication successful")

            this.showNotification('top', 'center', 3, "<h3>Administrador Validado Exitosamente..</h3> ", 'info');
            this.dialogRef.close({
              resp: 1
            });

      } else {
        console.log("authentication failed. Password doesn't match")
        this.showNotification('top', 'center', 3, "<h3>Se presento un error al validar la autenticación del administrador.</h3> ", 'danger');
    
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
