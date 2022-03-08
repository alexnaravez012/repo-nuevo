import {Component, OnInit} from '@angular/core';
import {LocalStorage} from '../../services/localStorage';
//import { HttpClient } from '@angular/common/http';
import {MatDialogRef} from '@angular/material';
import {StoreSelectorService} from '../store-selector.service';
import {HttpClient} from '@angular/common/http';
import {Urlbase} from '../../shared/urls';

@Component({
  selector: 'app-selectbox',
  templateUrl: './selectbox.component.html',
  styleUrls: ['./selectbox.component.scss']
})
export class SelectboxComponent implements OnInit {

  SelectedStore;
  stores = [];
  rol;

  constructor(private service: StoreSelectorService, public locStorage: LocalStorage, private httpClient: HttpClient,public dialogRef: MatDialogRef<SelectboxComponent>) { }

  ngOnInit() {
    this.rol = this.locStorage.getRol()[0].id_rol;
    this.httpClient.get(Urlbase.cierreCaja + "/close/myboxes?id_person="+this.locStorage.getPerson().id_person).subscribe(resp => {
      //@ts-ignore
      resp.forEach(element => {
        this.httpClient.get(Urlbase.cierreCaja + "/close/isopen?idcaja="+element.id_CAJA).subscribe(response => {
          if(!(response>0)){
            this.stores.push(element);
            //CPrint("this is boxid, ", element.id_CAJA)
            this.SelectedStore = element.id_CAJA;
            //CPrint(this.stores.length,"LENGTH")
          }
        })
      });
      //CPrint(resp)
    })
  }

  open() {
    this.dialogRef.close(
      {
        logout:false,
        open: true,
        idcaja: this.SelectedStore
      }
    )
  }

  cancel() {

    this.dialogRef.close(
      {
        logout:false,
        open: false,
        idcaja: this.SelectedStore
      }
    )
  }


  doubleclick = false;
  logout() {
    this.doubleclick = true;
    //this.service.onLogOutEvent.emit(1);
    this.dialogRef.close(
      {
        logout:true,
        open: false,
        idcaja: this.SelectedStore
      }
    )
  }

}
