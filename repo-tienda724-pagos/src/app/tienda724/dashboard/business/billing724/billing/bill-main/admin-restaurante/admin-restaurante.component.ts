import { Component, OnInit, ViewChild } from '@angular/core';
import * as jQuery from 'jquery';
import { PedidosRestaurantesCreadosComponent } from '../pedidos-restaurantes-creados/pedidos-restaurantes-creados.component';
import { RegistrarPedidoRestauranteComponent } from '../registrar-pedido-restaurante/registrar-pedido-restaurante.component';
import { TableReadComponent } from '../table-read/table-read.component';
let $: any = jQuery;

@Component({
  selector: 'app-admin-restaurante',
  templateUrl: './admin-restaurante.component.html',
  styleUrls: ['./admin-restaurante.component.css']
})
export class AdminRestauranteComponent implements OnInit {

  constructor() { }

  SelectedTabIndexGlobal = 0;
  
  @ViewChild("grilla") compUpdate: TableReadComponent;
  @ViewChild("generar") compUpdate2: RegistrarPedidoRestauranteComponent;
  @ViewChild("recibidos") compUpdate3: PedidosRestaurantesCreadosComponent;

  ngOnInit(): void {
  }

  setTabIndexGlobal(index){
    this.SelectedTabIndexGlobal = index;
  }

  showTabs = false;
  
  showTab(){
    this.showTabs = !this.showTabs;
  }


  // Notification
  showNotification(from, align,id_type?, msn?, typeStr?){
    const type = ['','info','success','warning','danger'];

    const color = Math.floor((Math.random() * 4) + 1);

    $.notify({
      icon: "notifications",
      message: msn?msn:"<b>Noficación automatica </b>"

    },{
      type: typeStr? typeStr:type[id_type?id_type:2],
      timer: 200,
      placement: {
        from: from,
        align: align
      }
    });
  }
}
