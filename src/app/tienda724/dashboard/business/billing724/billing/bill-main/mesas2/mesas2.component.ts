import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog, MatSort } from '@angular/material';
import { BillingService } from 'src/app/services/billing.service';
import { LocalStorage } from 'src/app/services/localStorage';
import { Urlbase } from 'src/app/shared/urls';
import { Observable, Subscription } from 'rxjs';
import * as jQuery from 'jquery';
import 'bootstrap-notify';
import { InventoryName, pdfData } from '../bill-main.component';
import { MatTableDataSourceWithCustomSort } from '../pedidos-modificar/pedidos-modificar.component';
import { paymentDetailDTO } from '../../models/paymentDetailDTO';
import { stateDTO } from '../../models/stateDTO';
import { Token } from 'src/app/shared/token';
import { InventoryQuantityDTO } from '../../../../store724/inventories/models/inventoryQuantityDTO';
import { CommonStateDTO } from '../../../commons/commonStateDTO';
import { DocumentDTO } from '../../../commons/documentDTO';
import { DetailBillDTO } from '../../models/detailBillDTO';
import { BillDTO } from '../../models/billDTO';
import { ClientData } from '../statechange/statechange.component';
import { NewProductStoreComponent } from '../new-product-store/new-product-store.component';
import { InventoriesService } from 'src/app/services/inventories.service';
import { FacturarMesas2Component } from '../facturar-mesas2/facturar-mesas2.component';
let $: any = jQuery;

@Component({
  selector: 'app-mesas2',
  templateUrl: './mesas2.component.html',
  styleUrls: ['./mesas2.component.css']
})
export class Mesas2Component implements OnInit {

  constructor(public locStorage: LocalStorage,
    private httpClient: HttpClient,
    public dialog: MatDialog,
    private billingService : BillingService,
    public inventoriesService: InventoriesService) { }


    storeList;
    tableList;
    tableName;
    subscription: Subscription;
    idStoreForUse = this.locStorage.getIdStore();
    public productsObject = [];

  ngOnInit(): void {
    this.storeList = this.locStorage.getStoreList();
    this.getInventoryList(this.idStoreForUse)
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


  getDateInMinutes(date){
    if(date == null){
      return null;
    }
    let today = new Date();
    let dif = today.getTime() - (new Date(date)).getTime();
    return Math.round((Math.round(dif/1000)/60))
  }


  tableToOpen;
  tableClick(table){
    this.tableToOpen = table
    this.tableName = table.mesa
  }


  changeView(i){
    console.log(i);
  }

  goToDetail(item){
    const dialogRef = this.dialog.open(FacturarMesas2Component, {
      width: '80vw',
      height: '80vh',
      data: { item: item}
    });

    dialogRef.afterClosed().subscribe(result => {
      this.httpClient.get(Urlbase.facturacion + "/billing/getPedidosMesa?id_store="+this.storeList+"&id_bill_type="+86+"&id_bill_state="+801).subscribe(response => {
        //@ts-ignore
        this.tableList = response;
      })
    });
  }

  inventoryList;
  getInventoryList(store){
    this.inventoriesService.getInventory(store).subscribe((data: InventoryName[]) => {
        this.inventoryList = data;
        //CPrint("this is InventoryList: "+JSON.stringify(data))
      },
      (error) =>{
      },
      () => {
        if (this.inventoryList.length > 0) {

        }
      });

  }



  openTable(item){

    let detailList = "";
    let detailListNew = "";

    //console.log(this.inventoryList)
    let object = this.inventoryList.find(element => element.code === "45000198" || element.ownbarcode === "45000198" );
    detailList = detailList+ "{"+object.id_PRODUCT_STORE+","+object.standard_PRICE+","+object.id_TAX+","+1+"},"

    detailListNew = detailListNew+ "{"+object.id_PRODUCT_STORE+",0},"


    //GENERO LA LISTA DE DTOs DE DETALLES
    this.httpClient.post(Urlbase.facturacion+ "/billing/crearPedidoMesa?idstoreclient=11&idthirduseraapp="+this.locStorage.getToken().id_third+"&idstoreprov="+this.idStoreForUse+"&detallepedido="+detailList.substring(0, detailList.length - 1)+"&descuento="+0+"&idpaymentmethod="+1+"&idapplication="+40+"&idthirdemp="+this.locStorage.getToken().id_third+"&detallepedidomesa="+detailListNew.substring(0, detailListNew.length - 1)+"&idmesa="+item.id_MESA,{}).subscribe(item => {
      if(item==1){
        this.showNotification('top', 'center', 3, "<h3>Mesa abierta con <b>EXITO.</b></h3> ", 'info');
        this.httpClient.get(Urlbase.facturacion + "/billing/getPedidosMesa?id_store="+this.storeList+"&id_bill_type="+86+"&id_bill_state="+801).subscribe(response => {
          //@ts-ignore
          this.tableList = response;
        })
      }
    })
  }


  showNotification(from, align, id_type?, msn?, typeStr?) {
    const type = ['', 'info', 'success', 'warning', 'danger'];

    Math.floor((Math.random() * 4) + 1);

    $.notify({
      icon: "notifications",
      message: msn ? msn : "<b>Noficación automatica </b>"

    }, {
      type: typeStr ? typeStr : type[id_type ? id_type : 2],
      timer: 200,
      placement: {
        from: from,
        align: align
      }
    });
  }




}
