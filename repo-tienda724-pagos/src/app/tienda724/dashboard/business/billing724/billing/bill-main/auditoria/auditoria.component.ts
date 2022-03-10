import {Component, OnInit} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
//import { HttpClient } from '@angular/common/http';
import {LocalStorage} from '../../../../../../../services/localStorage';
import {DatePipe} from '@angular/common';
import {BillingService} from '../../../../../../../services/billing.service';
import {HttpClient} from '@angular/common/http';
import {Urlbase} from '../../../../../../../shared/urls';

@Component({
  selector: 'app-auditoria',
  templateUrl: './auditoria.component.html',
  styleUrls: ['./auditoria.component.scss']
})
export class AuditoriaComponent implements OnInit {

  constructor(private categoriesService: BillingService,
    private datePipe: DatePipe,
    private http2: HttpClient,
    public locStorage: LocalStorage) { }



  SelectedStore = "";
  date: Date;
  date2: Date;
  Stores;
  Audits;
  //DEFINICIONES PARA EL SORTEO DE LA TABLA
  CampoSorteando = "";
  Invertido = false;

  roundDecimals(number){
    return Math.round(number * 100) / 100
  }

  SortearPorPropiedadMetodo(propiedad,invertido) {
    return function(n1, n2) {
      let Terminado = false;
      let i = 0;
      let TempN1 = n1[propiedad];
      let TempN2 = n2[propiedad];
      TempN1 = TempN1 + "";
      TempN2 = TempN2 + "";
      let Arreglo1 = [];
      let Arreglo2 = [];
      try {
        Arreglo1 = TempN1.trim().split(/[ ,.]+/)
        Arreglo2 = TempN2.trim().split(/[ ,.]+/)
      }
      catch(error) {
        console.error(error);
      }
      let retorno = -1;
      while(!Terminado){
        if(Arreglo1.length <= i){
          Terminado = true;
          retorno = -1;
          break;
        }
        if(Arreglo2.length <= i){
          Terminado = true;
          retorno = 1;
          break;
        }
        let Parte1 = Arreglo1[i]
        let Parte2 = Arreglo2[i]
        var A = parseInt(Parte1);
        var B = parseInt(Parte2);
        if(isNaN(A)){ A = Parte1;}
        if(isNaN(B)){ B = Parte2;}
        i++;
        if (A < B){
          retorno = -1;
          Terminado = true;
          break;
        }else if (A > B){
          retorno = 1;
          Terminado = true;
          break;
        }else{
          continue;
        }
      }
      return invertido ? -retorno:retorno;
    };
  }

  SortBy(campo){
    if(this.CampoSorteando != campo){
      this.CampoSorteando = campo;
    }else{
      this.Invertido = !this.Invertido;
    }
    //Genero copia del listado
    var ListaCopia = [...this.Audits];
    //Lo sorteo
    var ListaCopiaSorteada: string[][] = ListaCopia.sort(this.SortearPorPropiedadMetodo(campo,this.Invertido));
    this.Audits = ListaCopiaSorteada;
  }
  ///////////////////////////////////

  ngOnInit() {
    this.getStores();
  }

  getStores() {
    this.categoriesService.getStoresByThird(this.locStorage.getToken().id_third).subscribe(data => {
        CPrint(data);this.Stores = data
        this.SelectedStore = data[0].id_STORE})
  }

  getAudit(){
    this.Audits = null;
    this.http2.get(Urlbase.tienda + "/resource/getAuditory?id_store="+this.SelectedStore+"&date1="+this.date+"&date2="+this.date2).subscribe(data => {
      this.Audits =data;
      CPrint(data);
    })
  }


}


