import {Component, OnInit} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
//import { HttpClient } from '@angular/common/http';
import {LocalStorage} from '../../../../../../../services/localStorage';
import {DatePipe} from '@angular/common';
import {BillingService} from '../../../../../../../services/billing.service';
import {HttpClient} from '@angular/common/http';
import {Urlbase} from '../../../../../../../shared/urls';

//import { Http, Headers } from '@angular/http';

@Component({
  selector: 'app-pedido-maual',
  templateUrl: './pedido-manual.component.html',
  styleUrls: ['./pedido-manual.component.scss']
})
export class PedidoManualComponent implements OnInit {

  constructor(private categoriesService: BillingService,
    private datePipe: DatePipe,
    private http2: HttpClient,
    public locStorage: LocalStorage) { }

  ngOnInit() {
    this.SelectedStore2 = this.locStorage.getIdStore();
  }
  type2 = "1";
  SelectedStore2;
  Stores2 = [];
  isListProdFull2=false;
  ListReportProd2;
  dateP12;
  dateP22;
  hours2=24;


dynamicSort(property) {
  var sortOrder = 1;
  if(property[0] === "-") {
      sortOrder = -1;
      property = property.substr(1);
  }
  return function (a,b) {
      /* next line works with strings and numbers,
       * and you may want to customize it to your needs
       */
      var result = (a[property] < b[property]) ? -1 : (a[property] > b[property]) ? 1 : 0;
      return result * sortOrder;
  }
}

getRepProdList2(){
  CPrint(Urlbase.facturacion + "/reorder2?id_third="+this.locStorage.getThird().id_third+"&id_store="+this.SelectedStore2)
  this.http2.get(Urlbase.facturacion + "/reorder/reorder2?id_third="+this.locStorage.getThird().id_third+"&id_store="+this.locStorage.getIdStore()+"&hours="+this.hours2).subscribe(
      data => {
        CPrint("THIS IS DATA: ",data)
        if(this.type2=="1"){
          //@ts-ignore
          this.ListReportProd2 = data.sort(this.dynamicSort("linea"));
        }
        if(this.type2=="2"){
          //@ts-ignore
          this.ListReportProd2 = data.sort(this.dynamicSort("categoria"));
        }
        if(this.type2=="3"){
          //@ts-ignore
          this.ListReportProd2 = data.sort(this.dynamicSort("marca"));
        }
          this.isListProdFull2 = true;
      }
  )
}

transformDate(date){
  return this.datePipe.transform(date, 'yyyy/MM/dd');
  }

genPedido(){
  this.http2.post(Urlbase.facturacion + "/pedidos/detailing",{reorder: this.ListReportProd2,idstore: this.locStorage.getIdStore()}).subscribe(
    response => {
      CPrint("HECHO");
    })
  }

}
