import { HttpClient } from '@angular/common/http';
import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material';
import { LocalStorage } from 'src/app/services/localStorage';
import { Urlbase } from '../../../../../../../shared/urls';
import { AdminRestauranteComponent } from '../admin-restaurante/admin-restaurante.component';
import { DetallesMesaComponent } from '../detalles-mesa/detalles-mesa.component';
import 'rxjs/add/observable/interval';
import { Observable, Subscription } from 'rxjs';
import { BillingService } from 'src/app/services/billing.service';

@Component({
  selector: 'app-table-read',
  templateUrl: './table-read.component.html',
  styleUrls: ['./table-read.component.css']
})
export class TableReadComponent implements OnInit, OnDestroy {

  constructor(public locStorage: LocalStorage,
              private httpClient: HttpClient,
              public dialog: MatDialog,
              private billingService : BillingService) { }

  @Input() 
  mainclassref_input: AdminRestauranteComponent;
  mainclassref: AdminRestauranteComponent;
  tableList = [];
  storeList = "";
  subscription: Subscription;
  ngOnInit(): void {


    this.storeList = this.locStorage.getStoreList();


    this.mainclassref = this.mainclassref_input;
    console.log(Urlbase.facturacion + "/billing/getPedidosMesa?id_store="+this.storeList+"&id_bill_type="+86+"&id_bill_state="+801);
    this.httpClient.get(Urlbase.facturacion + "/billing/getPedidosMesa?id_store="+this.storeList+"&id_bill_type="+86+"&id_bill_state="+801).subscribe(response => {
      console.log("DATA: ",response)
      //@ts-ignore
      this.tableList = response;
    })

    let sub = Observable.interval(30000);
    this.subscription = sub.subscribe((val) => { 

      this.httpClient.get(Urlbase.facturacion + "/billing/getPedidosMesa?id_store="+this.storeList+"&id_bill_type="+86+"&id_bill_state="+801).subscribe(response => {
        console.log("DATA: ",response)
        //@ts-ignore
        this.tableList = response;
      })

      console.log('called');

    });

  }


  ngOnDestroy() {
      this.subscription.unsubscribe()
  }


  getDateInMinutes(date){
    if(date == null){
      return null;
    }
    let today = new Date();
    let dif = today.getTime() - (new Date(date)).getTime();
    return Math.round((Math.round(dif/1000)/60))
  }

  async openDetails(item){

    await console.log(item)
    await this.locStorage.setIdStore(item.id_STORE);

    if(!(item.mesero == null)){
      const dialogRef = await this.dialog.open(DetallesMesaComponent, {
        width: '80vw',
        height: '80vh',
        data: { idbill: item.id_BILL,
                item: item}
      });

      dialogRef.afterClosed().subscribe(result => {
        this.httpClient.get(Urlbase.facturacion + "/billing/getPedidosMesa?id_store="+this.storeList+"&id_bill_type="+86+"&id_bill_state="+801).subscribe(response => {
          console.log("DATA: ",response)
          //@ts-ignore
          this.tableList = response;
        })
      });
    }else{

      await this.mainclassref.compUpdate2.setTable(item);
      await this.mainclassref.setTabIndexGlobal(1);

      await console.log("id should be: ", item.id_STORE);
      await console.log("id pre set: ",this.mainclassref.compUpdate2.getidStoreForUse());

      await this.mainclassref.compUpdate2.setidStoreForUse(item.id_STORE);
      
      await console.log("Id post set: ", this.mainclassref.compUpdate2.getidStoreForUse());

      await this.mainclassref.compUpdate2.addDetailExterno("45000198");
      
    }
  }

}
