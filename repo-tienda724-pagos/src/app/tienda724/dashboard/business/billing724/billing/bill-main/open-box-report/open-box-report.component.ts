import {Component, OnInit} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import {LocalStorage} from '../../../../../../../services/localStorage';
import {DatePipe} from '@angular/common';
import {BillingService} from '../../../../../../../services/billing.service';
import {HttpClient} from '@angular/common/http';
import {Urlbase} from '../../../../../../../shared/urls';

@Component({
  selector: 'app-open-box-report',
  templateUrl: './open-box-report.component.html',
  styleUrls: ['./open-box-report.component.scss']
})
export class OpenBoxReportComponent implements OnInit {

  constructor(private categoriesService: BillingService,
              private datePipe: DatePipe,
              private http2: HttpClient,
              public locStorage: LocalStorage) { }


  SelectedStore = "";
  SelectedBox = "";
  Boxes;
  Stores;
  storesEmpty = true;
  efectivo = 0;
  tarjCred = 0;
  tarjDeb = 0;
  devoluciones=0;
  devolucionesCred = 0;
  devolucionesDebt = 0;
  myDetails = [];
  base=0;
  credits=0;
  debts=0;
  balances=0;
  cajero = "";
  fecha_apertura = "";
  caja = "";
  cajeroS = "";
  fecha_aperturaS = "";
  cajaS = "";


  ngOnInit() {
    this.getStores()
  }

  getStores() {
    this.categoriesService.getStoresByThird(this.locStorage.getToken().id_third).subscribe(data => {
        CPrint(data);
        this.Stores = data;
        this.SelectedStore = this.locStorage.getIdStore();
        this.storesEmpty = false;
        this.http2.get(Urlbase.cierreCaja + "/close/openBox?id_store="+this.locStorage.getIdStore()).subscribe(boxes => {
          this.Boxes = boxes;
          this.SelectedBox = boxes[0].id_CIERRE_CAJA;
          this.cajero = boxes[0].cajero;
          this.caja = boxes[0].caja;
          this.fecha_apertura = boxes[0].fecha_APERTURA;
          this.getData();
        })
      })
  }

  getBoxes(){
    this.cancel();
    this.storesEmpty = false;
    this.http2.get(Urlbase.cierreCaja + "/close/openBox?id_store="+this.SelectedStore).subscribe(boxes => {
      this.Boxes = boxes;
      this.SelectedBox = boxes[0].id_CIERRE_CAJA;
      this.cajero = boxes[0].cajero;
      this.caja = boxes[0].caja;
      this.fecha_apertura = boxes[0].fecha_APERTURA;
      this.getData();
    })
  }


  getCreds(list){
    for(let i =0; i <list.length; i++){
      if(list[i].naturaleza == "C"){
        this.credits+=list[i].valor;
      }
    }
  }

  getDevoluciones(list){
    for(let i =0; i <list.length; i++){
      if(list[i].notes.includes("Efectivo - Devolución factura")){
        this.devoluciones+=list[i].valor;
      }
      if(list[i].notes.includes("TD - Devolución factura")){
        this.devolucionesDebt+=list[i].valor;
      }
      if(list[i].notes.includes("TC - Devolución factura")){
        this.devolucionesCred+=list[i].valor;
      }
    }

  }

  getDebts(list){
    for(let i =0; i <list.length; i++){
      if(list[i].naturaleza == "D"){
        this.debts+=list[i].valor;
      }
    }

  }

  roundDecimals(number){
    return Math.round(number * 100) / 100
  }

  cancel(){

    this.balances = 0;
    this.debts=0;
    this.devoluciones=0;
    this.credits=0;
    this.cajero = "";
    this.fecha_apertura = "";
    this.caja = "";
    this.cajeroS = "";
    this.fecha_aperturaS = "";
    this.cajaS = "";
    this.myDetails = [];
    this.base = 0;
    this.efectivo = 0;
    this.tarjCred = 0;
    this.tarjDeb = 0;



  }

  getObjects(){

  }


  getData(){
    this.debts = 0;
    this.devoluciones = 0;
    this.credits = 0;
    this.balances = 0;
    this.http2.get(Urlbase.cierreCaja + "/close/openBox?id_store="+this.SelectedStore).subscribe(boxes => {
      //@ts-ignore
     boxes.forEach(element => {
       if(element.id_CIERRE_CAJA == this.SelectedBox){
         this.cajeroS = element.cajero;
         this.cajaS = element.caja;
         this.fecha_aperturaS = element.fecha_APERTURA;
       }
     });
    })
    this.http2.get(Urlbase.cierreCaja+"/close/balance/v2?id_cierre_caja="+this.SelectedBox).subscribe(response=>{
      CPrint("ID_CIERRE_CAJA: ", this.SelectedBox)
      //@ts-ignore
      this.balances = response;
      this.categoriesService.getDetailsById(this.SelectedBox).subscribe((res2)=>{
        CPrint(res2,"los detallitos");
        this.myDetails = res2;
        this.base = res2[0].valor;
        this.getCreds(res2);
        this.getDebts(res2);
        this.getDevoluciones(res2);
        CPrint(res2,"los detallitos");
        this.myDetails = res2;
        this.http2.get(Urlbase.cierreCaja + "/close/ventasPayment?id_cierre_caja="+this.SelectedBox+"&id_payment=1").subscribe(data => {
          //@ts-ignore
          this.efectivo = data;
        });

        this.http2.get(Urlbase.cierreCaja + "/close/ventasPayment?id_cierre_caja="+this.SelectedBox+"&id_payment=3").subscribe(data => {
          //@ts-ignore
          this.tarjCred = data;
        });


        this.http2.get(Urlbase.cierreCaja + "/close/ventasPayment?id_cierre_caja="+this.SelectedBox+"&id_payment=2").subscribe(data => {
          //@ts-ignore
          this.tarjDeb = data;
        })

      })

    })





  }
}
