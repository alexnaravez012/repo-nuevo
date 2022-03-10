import {Component, Inject, OnInit} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {HttpClient} from '@angular/common/http';
import {Urlbase} from '../../../../../../../../shared/urls';
import {LocalStorage} from 'src/app/services/localStorage';
import * as jQuery from 'jquery';
let $: any = jQuery;

@Component({
  selector: 'app-solicitar-pedido-re-orden',
  templateUrl: './solicitar-pedido-re-orden.component.html',
  styleUrls: ['./solicitar-pedido-re-orden.component.css']
})
export class SolicitarPedidoReOrdenComponent implements OnInit {
  retorno = "";
  OpcionesSelector = [];
  OpcionSelectorSeleccionada;
  detalles="";

  constructor(public dialogRef: MatDialogRef<SolicitarPedidoReOrdenComponent>,
              @Inject(MAT_DIALOG_DATA) public data: any,
              private http: HttpClient,
              public locStorage: LocalStorage) {
    this.OpcionesSelector = data.data;
  }

  ngOnInit(): void {
    this.OpcionSelectorSeleccionada = this.data.data[0];
    CPrint(this.data)
    CPrint(this.locStorage.getThird())
    CPrint(this.locStorage.getPerson())

    this.data.details.forEach(element => {

      if(this.round((this.data.days_ask * element.cantidad_VENDIDA / this.data.days_between)-element.cantidad_EN_INVENTARIO,0)>0){
        this.detalles+="{"+element.idps+","+this.round(element.costo,0)+","+element.idt+","+this.round((this.data.days_ask * element.cantidad_VENDIDA / this.data.days_between)-element.cantidad_EN_INVENTARIO,0)+"},"
      }
    });

  }

  round(value, precision) {
    const multiplier = Math.pow(10, precision || 0);
    return Math.round(value * multiplier) / multiplier;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }


  showNotification(from, align, id_type?, msn?, typeStr?,time = 200) {
    const type = ['', 'info', 'success', 'warning', 'danger'];

    const color = Math.floor((Math.random() * 4) + 1);

    $.notify({
      icon: "notifications",
      message: msn ? msn : "<b>Noficación automatica </b>"

    }, {
      type: typeStr ? typeStr : type[id_type ? id_type : 2],
      timer: time,
      placement: {
        from: from,
        align: align
      }
    });
  }



  postPedido(){
    CPrint(this.detalles);
    this.http.post(Urlbase.facturacion + "/pedidos/crearPedidoV2/costo?idthirdclient="+this.locStorage.getThird().id_third+"&idstoreclient="+this.data.id_store+"&idthirdempclient="+this.locStorage.getToken().id_third+"&idthirdprov="+this.OpcionSelectorSeleccionada.id_THIRD_DESTINITY+"&idstoreprov="+this.OpcionSelectorSeleccionada.id_STORE_PROVIDER,{ detalles: this.detalles.substring(0, this.detalles.length - 1)},{}).subscribe(
      response=> {
        this.showNotification('top', 'center', 3, "<h3>Pedido creado con exito.</h3>", 'info',20000);
    
        // this.http.get(Urlbase.facturacion+"/billing/UniversalPDF?id_bill="+response+"&pdf=-1",{responseType: 'text'}).subscribe(responses =>{
        //   window.open(Urlbase.remisiones+"/"+responses, "_blank"); 
        // })
      }
    )}
}
