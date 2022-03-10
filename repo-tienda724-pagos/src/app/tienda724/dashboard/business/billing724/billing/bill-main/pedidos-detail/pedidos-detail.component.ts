import {Component, Inject, OnInit} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
//import { HttpClient } from '@angular/common/http';
import {LocalStorage} from '../../../../../../../services/localStorage';
import {Urlbase} from '../../../../../../../shared/urls';
import {HttpClient} from '@angular/common/http';

@Component({
  selector: 'app-pedidos-detail',
  templateUrl: './pedidos-detail.component.html',
  styleUrls: ['./pedidos-detail.component.scss']
})
export class PedidosDetailComponent implements OnInit {
  elem: any;
  ListReportProd;

  CampoSorteando = "";
  Invertido = false;

  constructor(
      public locStorage: LocalStorage,
      private http2: HttpClient,
      public dialogRef: MatDialogRef<PedidosDetailComponent>,
      public dialog: MatDialog,
      @Inject(MAT_DIALOG_DATA) public data: DialogData,
  )
  { }


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
    var ListaCopia = [...this.ListReportProd];
    //Lo sorteo
    var ListaCopiaSorteada: string[][] = ListaCopia.sort(this.SortearPorPropiedadMetodo(campo,this.Invertido));
    this.ListReportProd = ListaCopiaSorteada;
  }

  ngOnInit() {
    this.elem = this.data.elem;
    CPrint(this.data.elem);
    CPrint(JSON.stringify({listaTipos: [this.data.elem.id_BILL]}))
    this.http2.post(Urlbase.facturacion + "/pedidos/detalles",{listaTipos: [this.data.elem.id_BILL]},{}).subscribe(
      response => {
        this.ListReportProd = response;
        CPrint(response)
      }
    )
  }






genPdf(){
  CPrint("THIS I NEED: ",{
    documento: this.elem.numdocumento,
    cliente: this.elem.cliente+"-"+this.elem.tienda,
    fecha: new Date(),
    documento_cliente: this.elem.numpedido,
    telefono: this.elem.telefono,
    correo: this.elem.mail,
    direccion: this.elem.address,
    total: 0 + 0,
    subtotal: 0,
    tax: 0,
    percent: this.elem.tax,
    detail_list: this.ListReportProd,
    used_list: [],
    observaciones: this.elem.body,
    logo: this.locStorage.getThird().info.type_document+" "+this.locStorage.getThird().info.document_number
  })
  CPrint(JSON.stringify({
    documento: this.elem.numdocumento,
    cliente: this.elem.cliente+"-"+this.elem.tienda,
    fecha: new Date(),
    documento_cliente: this.elem.numpedido,
    telefono: this.elem.telefono,
    correo: this.elem.mail,
    direccion: this.elem.address,
    total: 0 + 0,
    subtotal: 0,
    tax: 0,
    detail_list: this.ListReportProd,
    used_list: [],
    observaciones: this.elem.body  ,
    logo: this.locStorage.getThird().info.type_document+" "+this.locStorage.getThird().info.document_number
  }));
  this.http2.post(Urlbase.facturacion+"/pedidos/pdf2",{
    documento: this.elem.numdocumento,
    cliente: this.elem.cliente+"-"+this.elem.tienda,
    fecha: new Date(),
    documento_cliente: this.elem.numpedido,
    telefono: this.elem.telefono,
    correo: this.elem.mail,
    direccion: this.elem.address,
    total: 0 + 0,
    subtotal: 0,
    tax: 0,
    detail_list: this.ListReportProd,
    used_list: [],
    observaciones: this.elem.body  ,
    logo: this.locStorage.getThird().info.type_document+" "+this.locStorage.getThird().info.document_number
  },{responseType: 'text'}).subscribe(responsepdf => {
    CPrint("THIS IS MY RESPONSE, ",responsepdf);
    window.open(Urlbase.remisiones+"/"+responsepdf, "_blank");
  })
}


confirmarEnv() {
  this.http2.post(Urlbase.tienda + "/store/confirmarPC?numpedido="+this.elem.numdocumento+"&idstore="+this.locStorage.getIdStore()+"&idthird="+this.locStorage.getIdThird(),{}).subscribe(
    response => {
    }
  )
}






}



export interface DialogData {
  elem: any
}
