import { Component, OnInit } from '@angular/core';
import { BillingService } from 'src/app/services/billing.service';
import { HttpClient } from '@angular/common/http';
import { LocalStorage } from 'src/app/services/localStorage';
import { Urlbase } from 'src/app/shared/urls';
let $: any = jQuery;
import * as jQuery from 'jquery';
import 'bootstrap-notify';
@Component({
  selector: 'app-reorden-consumo',
  templateUrl: './reorden-consumo.component.html',
  styleUrls: ['./reorden-consumo.component.css']
}) 
export class ReordenConsumoComponent implements OnInit {

  constructor(private categoriesService: BillingService,
    public locStorage: LocalStorage,
    private httpClient: HttpClient) { }

  ngOnInit(): void {
    this.getStores();
  }

  Stores;
  SelectedStore = this.locStorage.getIdStore();
  dateInicio = "";
  tiempoInicio = "1";
  dateFinal = "";
  tiempoFinal = "1";
  timeList = [["1","1 A.M"],["2","2 A.M"],["3","3 A.M"],["4","4 A.M"],["5","5 A.M"],["6","6 A.M"],["7","7 A.M"],["8","8 A.M"],["9","9 A.M"],["10","10 A.M"],["11","11 A.M"],["12","12 P.M"]
            ,["13","1 P.M"],["14","2 P.M"],["15","3 P.M"],["16","4 P.M"],["17","5 P.M"],["18","6 P.M"],["19","7 P.M"],["20","8 P.M"],["21","9 P.M"],["22","10 P.M"],["23","11 P.M"],["24","12 A.M"]]
  getStores() {
    this.categoriesService.getStoresByThird(this.locStorage.getToken().id_third).subscribe(data => {
      console.log("This is data; ",data);
      this.Stores = data;})
  }

  sendData(){
    
    this.httpClient.post(Urlbase.facturacion + "/pedidos/generarPedidosPorConsumo?fechainicio="+this.dateInicio+"&horainicio="+Number(this.tiempoInicio)+"&fechafin="+this.dateFinal+"&horafin="+Number(this.tiempoFinal)+"&idstoreprov="+this.SelectedStore,{}).subscribe(
      response=> {
        if(response==1){
          console.log("OK")
          this.showNotification('top','center',3,"<p> Se generaron los pedidos con exito.  <p> <br> ",'info');
        }else{
          this.showNotification('top','center',3,"<p> Algo fallo al generarse los pedidos.  <p> <br> ",'danger');
          console.log("FAILED")
        }
      })
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
