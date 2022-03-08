import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { BillingService } from 'src/app/services/billing.service';
import { LocalStorage } from 'src/app/services/localStorage';
import { Urlbase } from 'src/app/shared/urls';
let $: any = jQuery;
import * as jQuery from 'jquery';
import 'bootstrap-notify';

@Component({
  selector: 'app-re-orden-perfecta',
  templateUrl: './re-orden-perfecta.component.html',
  styleUrls: ['./re-orden-perfecta.component.css']
})
export class ReOrdenPerfectaComponent implements OnInit {

  constructor(public locStorage: LocalStorage,
    private httpClient: HttpClient,
    private categoriesService: BillingService) { }

  Stores;
  SelectedStore = this.locStorage.getIdStore();
  SelectedDay = 1;

  ngOnInit(): void {
    this.getStores();
  }

  getStores() {
    this.categoriesService.getStoresByThird(this.locStorage.getToken().id_third).subscribe(data => {
      console.log("This is data; ",data);
      this.Stores = data;})
  }

  generateReorder(){
    this.httpClient.post(Urlbase.tienda + "/resource/perfecto?idstorep="+this.SelectedStore+"&weekday="+this.SelectedDay,{}).subscribe(response => {
      if(response == 1){
        this.showNotification('top','center',3,"<p> Proceso terminado con exito. <p> <br> ",'info');
      }else{
        this.showNotification('top','center',3,"<p> Se presento un problema con el procedimiento. <p> <br> ",'danger');
      }
    })
  }

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
