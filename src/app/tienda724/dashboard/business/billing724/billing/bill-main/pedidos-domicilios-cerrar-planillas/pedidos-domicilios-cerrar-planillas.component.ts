import {Component, Inject, OnInit, ViewChild, ElementRef} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {HttpClient} from '@angular/common/http';
import {Urlbase} from 'src/app/shared/urls';
import * as jQuery from 'jquery';
import 'bootstrap-notify';
import { LocalStorage } from 'src/app/services/localStorage';
let $: any = jQuery;

@Component({
  selector: 'app-pedidos-domicilios-cerrar-planillas',
  templateUrl: './pedidos-domicilios-cerrar-planillas.component.html',
  styleUrls: ['./pedidos-domicilios-cerrar-planillas.component.css']
})
export class PedidosDomiciliosCerrarPlanillasComponent implements OnInit {

  @ViewChild('nameref') private elementRef: ElementRef;

  constructor(public locStorage: LocalStorage, public dialogRef: MatDialogRef<PedidosDomiciliosCerrarPlanillasComponent>,public dialog: MatDialog,private httpClient: HttpClient
    ,@Inject(MAT_DIALOG_DATA) public data: any) { }

    obs = "";
    billetes = 0;
    monedas = 0;
    totalOtros=0;
    SelectedBillState;
    total=0;

  planillaDetails;
  ngOnInit(): void {
    setTimeout(() => {

      this.elementRef.nativeElement.focus();
      this.elementRef.nativeElement.select();

    }, 100);
    this.SelectedBillState = this.data.myStateId;
    this.httpClient.get(Urlbase.facturacion + "/pedidos/getDatosPlanilla?id_planilla="+this.data.idPlanilla).subscribe( result => {
      CPrint(result);
      this.planillaDetails = result
      //@ts-ignore
      result.forEach(element => {
        this.total+=element.totalprice;
      });
    })
  }

  PDF(elem){
    this.httpClient.get(Urlbase.facturacion+"/billing/UniversalPDF?id_bill="+elem.id_BILL+"&pdf=-1&cash=0&size="+false,{responseType: 'text'}).subscribe(response =>{
      //-----------------------------------------------------------------------------------------------------------------
      window.open(Urlbase.facturas+"/"+response, "_blank");
    });
  }


  cerrarPlanilla(){
    this.httpClient.post(Urlbase.facturacion + "/pedidos/cerrarPlanilla?IDPLANILLA="+this.data.idPlanilla+"&NOTAS="+this.obs+"&valorbilletes="+this.billetes+"&valormonedas="+this.monedas+"&ESTADOORIGENPROV="+this.SelectedBillState+"&IDTHIRDUSER="+this.locStorage.getToken().id_third+"&ACTOR=P"+"&valorotros="+this.totalOtros,{}).subscribe( result => {
      CPrint(result);
      if(result==1){
        this.showNotification('top', 'center', 3, "<h3>Planilla cerrada.</h3> ", 'info');
        this.dialogRef.close({
          type: 1
        })
      }else{
        this.showNotification('top', 'center', 3, "<h3>Se presento un problema al cerrar la planilla</h3> ", 'danger');
      }
    })
  }

  cerrarPlanillaNovedad(){
    this.httpClient.post(Urlbase.facturacion + "/pedidos/cerrarPlanillaNovedad?IDPLANILLA="+this.data.idPlanilla+"&NOTAS="+this.obs+"&ESTADOORIGENPROV="+this.SelectedBillState+"&IDTHIRDUSER="+this.locStorage.getToken().id_third+"&ACTOR=P",{}).subscribe( result => {
      CPrint(result);
      if(result==1){
        this.showNotification('top', 'center', 3, "<h3>Planilla cerrada con novedad.</h3> ", 'info');
        this.dialogRef.close({
          type: 2
        })
      }else{
        this.showNotification('top', 'center', 3, "<h3>Se presento un problema al cerrar la planilla</h3> ", 'danger');
      }
    })
  }

  showNotification(from, align, id_type?, msn?, typeStr?) {
    const type = ['', 'info', 'success', 'warning', 'danger'];

    const color = Math.floor((Math.random() * 4) + 1);

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
