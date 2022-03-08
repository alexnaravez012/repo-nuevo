import {Component, Inject, OnInit} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import {BillingService} from '../../../../../../../services/billing.service';
import {LocalStorage} from '../../../../../../../services/localStorage';
//import { MatDialogRef } from '@angular/material';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {ViewDetailsBoxComponent} from '../view-details-box/view-details-box.component';
import {Router} from '@angular/router';
import {AddNotesCloseBoxComponent} from '../add-notes-close-box/add-notes-close-box.component';
//import { HttpClient } from '@angular/common/http';
import {DatePipe} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {Urlbase} from '../../../../../../../shared/urls';
import { CerrarPlanillasCajaComponent } from '../cerrar-planillas-caja/cerrar-planillas-caja.component';

@Component({
  selector: 'app-close-box',
  templateUrl: './close-box.component.html',
  styleUrls: ['./close-box.component.scss']
})
export class CloseBoxComponent implements OnInit {
  boxDisabled = false;
  currentDate = new Date();
  movementType: string = "d";
  movementMoney = 0;
  movementNotes: string = "";
  balance: number = 0;
  total: number = 0;
  caja: string = localStorage.getItem("currentBox");
  nombreEmployee: string;
  movementBill = 0;
  movementCoin = 0;
  movementTrans = 0;
  movementNotas = "";
  nombreCaja: String;
  nombreTienda: String;
  total2 = 0;
  closeboxinfo = {
    balance: 0,
    caja: "",
    cajero: "",
    notes: null,
    starting_DATE: "",
    store: ""
  };
  devoluciones=0;
  devolucionesCred = 0;
  devolucionesDebt = 0;
  currentBalance = 0;
  devolucionesTransf = 0;
  balances = 0;
  efectivo = 0;
  tarjCred = 0;
  transferencias = 0;
  tarjDeb = 0;
  pdfBox: any;
  idOfOpenBox;
  detailList;
  consecutive = 0;
  myDetails;
  base=0;
  credits=0;
  debts=0;
  pdfJson;
  constructor(public datePipe: DatePipe,
              public dialogRef: MatDialogRef<CloseBoxComponent>,
              private http2: HttpClient, public router: Router,
              public dialog: MatDialog, public locStorage: LocalStorage,
              private billingService: BillingService,
              @Inject(MAT_DIALOG_DATA) public flag: any) { }

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
      if(list[i].notes.includes("TR - Devolución factura")){
        this.devolucionesTransf+=list[i].valor;
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

  ngOnInit() {
    this.currentBalance = 0;
    this.billingService.getCajaByIdStatus(localStorage.getItem("id_employee")).subscribe((res)=>{
      this.http2.get(Urlbase.facturacion+"/pedidos/getPlanillasData/cierreCaja?id_cierre_caja="+res[0]+"&status=C").subscribe(resp => {
        //@ts-ignore
        if(resp.length>0){
          const dialogRef = this.dialog.open(CerrarPlanillasCajaComponent, {
            width: '60vw',
            height: '80vh',
            data: { resp, id_cierre_caja: res[0] },
            disableClose: true
          });

          dialogRef.afterClosed().subscribe(result => {

          });
        }
      })
      this.billingService.getDetailsById(res[0]).subscribe((res2)=>{
        CPrint(res2,"los detallitos");
        this.myDetails = res2;
        this.base = res2[0].valor;
        this.getCreds(res2);
        this.getDebts(res2);
        this.getDevoluciones(res2);
      })
    });
    // balance: 170400
    // caja: "Caja uno"
    // cajero: "Carolina Vargas"
    // notes: null
    // starting_DATE: "2019-03-26 20:00:00"
    // store: "El Limonar"
    this.nombreEmployee = this.locStorage.getPerson().first_name + " " + this.locStorage.getPerson().first_lastname;
    this.calculateBalance();
    this.billingService.getCajaByIdStatus(localStorage.getItem("id_employee")).subscribe(res => {
      this.idOfOpenBox = res;
    this.http2.get(Urlbase.cierreCaja + "/close/ventasPayment?id_cierre_caja="+res+"&id_payment=1").subscribe(data => {
      //@ts-ignore
      this.efectivo = data;
    });

    this.http2.get(Urlbase.cierreCaja + "/close/ventasPayment?id_cierre_caja="+res+"&id_payment=3").subscribe(data => {
      //@ts-ignore
      this.tarjCred = data;
    });


    this.http2.get(Urlbase.cierreCaja + "/close/ventasPayment?id_cierre_caja="+res+"&id_payment=2").subscribe(data => {
      //@ts-ignore
      this.tarjDeb = data;
    });

    this.http2.get(Urlbase.cierreCaja + "/close/ventasPayment?id_cierre_caja="+res+"&id_payment=4").subscribe(data => {
      //@ts-ignore
      this.transferencias = data;
    });

      this.billingService.getSalesSum(res[0]).subscribe(res2 =>{
        this.total2 = res2;
        this.billingService.getBoxDetail(res).subscribe(res3=>{
          this.billingService.getBoxMaster(res).subscribe(res4=>{
            this.closeboxinfo = res4;
            this.currentBalance = res4.balance;
            this.balances = this.currentBalance;
            this.closeboxinfo.cajero = this.locStorage.getPerson().first_name + " " + this.locStorage.getPerson().first_lastname;
            this.closeboxinfo.caja = String(this.locStorage.getIdCaja());
            this.closeboxinfo.store = String(this.locStorage.getIdStore());
            CPrint(res4);
          })
        })
      })
    });
    this.http2.get(Urlbase.cierreCaja + "/close/details?id_caja="+this.locStorage.getIdCaja()).subscribe(data => {
        CPrint("THIS IS DATA FOR ME: ",data);
      //@ts-ignore
      this.nombreCaja = data.caja;
      //@ts-ignore
      this.nombreTienda = data.store;
    })
  }

  closeDialog() {
    this.dialogRef.close();
  }

  buttonoff = false;
  async openBox() {
    this.buttonoff = true;
    // var boxId = localStorage.getItem("currentBox");
    this.billingService.getCajaByIdStatus(localStorage.getItem("id_employee")).subscribe(res => {
      const currentMovements = localStorage.getItem('movements');

      if (this.movementType === "d") {
        // noinspection ES6ConvertVarToLetConst
        var movementToPost = '[{"valor": ' + String(this.movementMoney) + ', "naturaleza": "D", "movement_DATE": "2019-03-23", "notes": "' + this.movementNotes + '"}]';
        // noinspection ES6ConvertVarToLetConst
        var movementMoney = '-' + String(this.movementMoney)
      }

      if (this.movementType === "c") {
        // noinspection ES6ConvertVarToLetConst
        var movementToPost = '[{"valor": ' + String(this.movementMoney) + ', "naturaleza": "C", "movement_DATE": "2019-03-23", "notes": "' + this.movementNotes + '"}]';
        // noinspection ES6ConvertVarToLetConst
        var movementMoney = String(this.movementMoney)
      }

      this.billingService.postBoxDetail(movementToPost, res[0]).subscribe(res => {
        localStorage.setItem("movements", currentMovements + ',' + movementMoney);
        CPrint(localStorage.getItem("movements"));
        this.movementMoney = 0;
        this.movementNotes = '';
        this.movementType = '';

        this.closeDialog();
      })
    })
  }

  calculateaux1(){
    this.currentBalance = this.closeboxinfo.balance + Number(this.movementBill);
  }
  calculateaux2(){
    this.currentBalance = this.closeboxinfo.balance + Number(this.movementCoin);
  }

  calculateBalance() {
    this.currentBalance = this.closeboxinfo.balance + Number(this.movementTrans);
  }

  // async addSalesAux(total,total2){
  //   total.forEach((element)=>{
  //     this.balance -= Number(element);
  //     total2 -= Number(element);
  //     this.total += Number(element);
  //   })


  // }



  openDetailsDialog() {
    let dialogRef = this.dialog.open(ViewDetailsBoxComponent, {
      width: '60vw',
      data: {}
    });
  }




  async printPdf(id){
    CPrint("THIS IS ID, ", id);
    CPrint("CAJA NOMBRE: ", this.nombreCaja);
    CPrint("CAJA TIENDA: ", this.nombreTienda);
    CPrint("/----BANDERA 1----/");
    this.http2.get(Urlbase.cierreCaja + "/close/consecutive?id_cierre_caja="+id).subscribe(respi => {
      CPrint("/----BANDERA 2----/");
      CPrint(respi);

      this.http2.get(Urlbase.cierreCaja + "/close/consecutive2?id="+id,{responseType: 'text'}).subscribe(resp => {
        CPrint("/----BANDERA 3----/");
        CPrint(resp);
        this.http2.post(Urlbase.cierreCaja + "/close/pdf",{
        codigo: "-"+this.locStorage.getIdStore()+"-"+this.locStorage.getIdCaja()+"-",
        nombre_empresa: this.locStorage.getThird().info.fullname,
        nit: this.locStorage.getThird().info.type_document+" "+this.locStorage.getThird().info.document_number,
        numero_documento: (this.locStorage.getThird().info.fullname+"_cc"+"_"+respi).split(" ").join("_"),
        nombre_cajero: this.locStorage.getPerson().first_name+" "+this.locStorage.getPerson().first_lastname,
        nombre_caja: this.nombreCaja,
        nombre_tienda: this.nombreTienda,
        fecha_inicio: this.datePipe.transform(new Date(this.closeboxinfo.starting_DATE),"dd/MM/yyyy HH:mm"),
        //@ts-ignore
        fecha_finalizacion: this.datePipe.transform(new Date(resp),"dd/MM/yyyy HH:mm"),
        //balance: (this.balances - this.total2 + this.movementBill + this.movementCoin + this.tarjCred + this.tarjDeb + this.devoluciones),
        balance: Number(this.pdfJson),
        detalles: this.detailList
      },{responseType: 'text'}).subscribe(res=> {
          CPrint("/----BANDERA 4----/");
          CPrint(res);
          CPrint("THE PDF TO BOX IS: ",JSON.stringify({
          codigo: "-"+this.locStorage.getIdStore()+"-"+this.locStorage.getIdCaja()+"-",
          nombre_empresa: this.locStorage.getThird().info.fullname,
          nit: this.locStorage.getThird().info.type_document+" "+this.locStorage.getThird().info.document_number,
          numero_documento: (this.locStorage.getThird().info.fullname+"_cc"+"_"+respi).split(" ").join("_"),
          nombre_cajero: this.locStorage.getPerson().first_name+" "+this.locStorage.getPerson().first_lastname,
          nombre_caja: this.nombreCaja,
          nombre_tienda: this.nombreTienda,
          fecha_inicio: this.datePipe.transform(new Date(this.closeboxinfo.starting_DATE),"dd/MM/yyyy HH:mm"),
          //@ts-ignore
          fecha_finalizacion: this.datePipe.transform(new Date(resp),"dd/MM/yyyy HH:mm"),
          //balance: (this.balances - this.total2 + this.movementBill + this.movementCoin + this.tarjCred + this.tarjDeb + this.devoluciones),
          balance: Number(this.pdfJson),
          detalles: this.detailList
        }));
        this.http2.post(Urlbase.cierreCaja + "/close/url",{ iddoc: id, url: Urlbase.root+"docscaja/"+res }).subscribe(responc => {
          CPrint("/----BANDERA 5----/");
          CPrint(responc);
        });
        window.open(Urlbase.root+"docscaja/"+res, "_blank");
        })
      })
    })
  }

   convertTime12to24 (time12h) {
    const [time, modifier] = time12h.split(' ');

    let [hours, minutes] = time.split(':');

    if (hours === '12') {
      hours = '00';
    }

    if (modifier === 'PM') {
      hours = parseInt(hours, 10) + 12;
    }

    return `${hours}:${minutes}`;
  }

  async generateDetailList(res){
    let list = [];
    let miniList: String[] = [];
    let counter = 0;
    res.forEach(element => {
      counter++;
      miniList = [];
      miniList.push(String(element.movement_DATE));
      miniList.push(element.naturaleza);
      miniList.push(element.notes);
      miniList.push(element.valor);
      list.push(miniList);
      if(counter===res.length) {
        this.detailList = list;
      }

    })
  }


  saveCloseBox(notes){
    this.http2.get(Urlbase.cierreCaja + "/close/details?id_caja="+this.locStorage.getIdCaja()).subscribe(data => {
        CPrint("THIS IS DATA FOR ME: ",data);
      //@ts-ignore
      this.nombreCaja = data.caja;
      //@ts-ignore
      this.nombreTienda = data.store;

    this.billingService.getCajaByIdStatus(localStorage.getItem("id_employee")).subscribe(res => {
      let movementToPost = '[{"valor": ' + String(this.tarjDeb - this.devolucionesDebt) + ', "naturaleza": "C", "movement_DATE": "2019-03-23", "notes": "Tarjeta Debito"}]';
      this.billingService.postBoxDetail(movementToPost, res[0]).subscribe(res6 => {
        let movementToPost = '[{"valor": ' + String(this.movementBill) + ', "naturaleza": "C", "movement_DATE": "2019-03-23", "notes": "Billetes"}]';
        this.billingService.postBoxDetail(movementToPost, res[0]).subscribe(res2 => {
        movementToPost = '[{"valor": ' + String(this.movementCoin) + ', "naturaleza": "C", "movement_DATE": "2019-03-23", "notes": "Monedas"}]';
        this.billingService.postBoxDetail(movementToPost, res[0]).subscribe(res3 => {
          movementToPost = '[{"valor": ' + String(this.tarjCred-this.devolucionesCred) + ', "naturaleza": "C", "movement_DATE": "2019-03-23", "notes": "Tarjeta Credito"}]';
          this.billingService.postBoxDetail(movementToPost, res[0]).subscribe(res4 => {
            movementToPost = '[{"valor": ' + String(this.transferencias-this.devolucionesTransf) + ', "naturaleza": "C", "movement_DATE": "2019-03-23", "notes": "Transferencia"}]';
            this.billingService.postBoxDetail(movementToPost, res[0]).subscribe(res6 => {
            movementToPost = '[{"valor": ' + String(this.efectivo+this.tarjCred+this.tarjDeb+this.transferencias) + ', "naturaleza": "D", "movement_DATE": "2019-03-23", "notes": "Total de ventas"}]';
            this.billingService.postBoxDetail(movementToPost, res[0]).subscribe(res5 => {
              this.billingService.getCajaByIdStatus(localStorage.getItem("id_employee")).subscribe(res => {
                this.billingService.getBoxMaster(res).subscribe(resp4=>{
                  this.pdfJson = resp4;
                  const closing = {status: 'C', notes: notes};
                  this.billingService.closeBox(res, closing).subscribe(res6 => {
                  this.billingService.getDetailsById(this.idOfOpenBox).subscribe(res2=>{
                    this.generateDetailList(res2).then(elemente=>{
                      this.printPdf(this.idOfOpenBox[0]).then(element=>{
                        this.locStorage.setBoxStatus(false);
                        this.boxDisabled = false;
                      })
                    })


                });
                // noinspection JSIgnoredPromiseFromCall
                this.router.navigateByUrl("/dashboard/business/menu");
                this.closeDialog();
              })})
            })
          })
            })
          })
        })
      })
    })})})
  }


  closeBoxOG() {
    let notes;
    this.boxDisabled = true;
    // if((this.balances - this.total2 + this.movementBill + this.movementCoin + this.tarjCred + this.tarjDeb + this.devoluciones)=== 0){
    //   notes = "Cierre de caja"
    //   this.locStorage.setBoxStatus(false);
    //   this.saveCloseBox(notes)
    // }else{
      let dialogRef = this.dialog.open(AddNotesCloseBoxComponent, {
        height: '450px',
        width: '600px',
        data: {},
        disableClose: true
      });
      CPrint("ID_CIERRE_CAJA: ");
      CPrint(this.idOfOpenBox[0]);
      this.http2.post(Urlbase.facturacion+"/pedidos/cierreCajaPlanilla?IDCIERRECAJA="+this.idOfOpenBox[0],{}).subscribe(e=> {
        dialogRef.afterClosed().subscribe(res=>{
          this.locStorage.setBoxStatus(false);
          CPrint(res);
          if(res !== null){
            notes = res;
            this.saveCloseBox(notes)
          }
        })
      })
    // }
  }


  closeBox() {
    let notes;
    this.boxDisabled = true;
    let dialogRef = this.dialog.open(AddNotesCloseBoxComponent, {
      height: '450px',
      width: '600px',
      data: {},
      disableClose: true
    });
    dialogRef.afterClosed().subscribe(res=>{
      this.locStorage.setBoxStatus(false);
      if(res !== null){
        this.http2.post(Urlbase.cierreCaja+"/close/cierre_de_caja?idCaja="+this.locStorage.getIdCaja()+"&billetes="+this.movementBill+"&monedas="+this.movementCoin+"&notas="+notes,{},).subscribe(e=>{
          notes = res;
          this.http2.get(Urlbase.cierreCaja + "/close/details?id_caja="+this.locStorage.getIdCaja()).subscribe(data => {
            //@ts-ignore
            this.nombreCaja = data.caja;
            //@ts-ignore
            this.nombreTienda = data.store;
            this.http2.get(Urlbase.cierreCaja + "/close/balance/v2?id_cierre_caja="+this.idOfOpenBox[0]).subscribe(resp4 => {
              this.pdfJson = resp4;
              console.log("E: "+e)
              if (e==1){
                this.billingService.getDetailsById(this.idOfOpenBox).subscribe(res2=>{
                  this.generateDetailList(res2).then(elemente=>{
                    this.printPdf(this.idOfOpenBox[0]).then(element=>{
                      this.locStorage.setBoxStatus(false);
                      this.boxDisabled = false;
                    })
                      this.router.navigateByUrl("/dashboard/business/menu");
                      this.closeDialog();
                    })
                  });
                }
              })
            })
        })
      }
    })
  }
}
