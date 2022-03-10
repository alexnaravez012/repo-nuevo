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
  selector: 'app-reorden',
  templateUrl: './reorden.component.html',
  styleUrls: ['./reorden.component.scss']
})
export class ReordenComponent implements OnInit {

  constructor(private categoriesService: BillingService,
    private datePipe: DatePipe,
    private http2: HttpClient,
    public locStorage: LocalStorage) { }

  ngOnInit() {
    this.getStores();
  }
  type = "1";
  SelectedStore = "";
  Stores = [];
  isListProdFull=false;
  ListReportProd;
  dateP1;
  dateP2;

  getStores() {
    this.categoriesService.getStoresByThird(this.locStorage.getToken().id_third).subscribe(data => {
        CPrint(data);this.Stores = data
        this.SelectedStore = data[0].id_STORE})
}


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

getRepProdList(){
  CPrint(Urlbase.facturacion + "/reorder?id_third="+this.locStorage.getThird().id_third+"&id_store="+this.SelectedStore+"&date1="+this.transformDate(this.dateP1)+"&date2="+this.transformDate(this.dateP2))
  this.http2.get(Urlbase.facturacion + "/reorder?id_third="+this.locStorage.getThird().id_third+"&id_store="+this.SelectedStore+"&date1="+this.transformDate(this.dateP1)+"&date2="+this.transformDate(this.dateP2)).subscribe(
      data => {
        CPrint("THIS IS DATA: ",data)
        if(this.type=="1"){
          //@ts-ignore
          this.ListReportProd = data.sort(this.dynamicSort("linea"));
        }
        if(this.type=="2"){
          //@ts-ignore
          this.ListReportProd = data.sort(this.dynamicSort("categoria"));
        }
        if(this.type=="3"){
          //@ts-ignore
          this.ListReportProd = data.sort(this.dynamicSort("marca"));
        }
          this.isListProdFull = true;
      }
  )
}

transformDate(date){
  return this.datePipe.transform(date, 'yyyy/MM/dd');
  }

}
