import {Component, OnInit} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import {HttpClient} from '@angular/common/http';
import {Urlbase} from '../../../../../../../shared/urls';
import {LocalStorage} from 'src/app/services/localStorage';

@Component({
  selector: 'app-not-authorized',
  templateUrl: './not-authorized.component.html',
  styleUrls: ['./not-authorized.component.css']
})
export class NotAuthorizedComponent implements OnInit {

  constructor(private http2: HttpClient,public locStorage: LocalStorage) { }

  ngOnInit() {
    this.http2.post(Urlbase.tienda + "/resource/auditoria?nombre= ACCESO A ELEMENTO NO AUTORIZADO &id_third_employee="+this.locStorage.getToken().id_third+"&id_store="+this.locStorage.getIdStore()+"&valor_anterior="+"-1"+"&valor_nuevo="+"INTENTO NO AUTORIZADO DE ACCESO POR URL A ELEMENTO",{}).subscribe(data => {
      CPrint(data);
    })
  }

}
