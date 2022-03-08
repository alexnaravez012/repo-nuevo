import {Component, OnInit} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import {BillingService} from '../../../../../../../services/billing.service';
import {LocalStorage} from '../../../../../../../services/localStorage';
//import { MatDialogRef } from '@angular/material';
import {Token} from '../../../../../../../shared/token';
import {MatDialog} from '@angular/material';
import {ViewDetailsBoxComponent} from '../view-details-box/view-details-box.component';
import {Router} from '@angular/router';
import {AddNotesCloseBoxComponent} from '../add-notes-close-box/add-notes-close-box.component';
//import { HttpClient } from '@angular/common/http';
import {DatePipe} from '@angular/common';
import {HttpClient} from '@angular/common/http';
import {Urlbase} from '../../../../../../../shared/urls';
import { SelectboxComponent } from 'src/app/components/selectbox/selectbox.component';
import * as jQuery from 'jquery';
import { AuthenticationService } from 'src/app/services/authentication.service';
import { OpenBoxComponent } from 'src/app/components/open-box/open-box.component';
import { InventoriesService } from 'src/app/services/inventories.service';
import { CerrarPlanillasCajaComponent } from '../cerrar-planillas-caja/cerrar-planillas-caja.component';
let $: any = jQuery;
@Component({
  selector: 'app-close-box2',
  templateUrl: './close-box2.component.html',
  styleUrls: ['./close-box2.component.css']
})
export class CloseBox2Component implements OnInit {
  public inventoriesService: InventoriesService
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
  balances = 0;
  efectivo = 0;
  tarjCred = 0;
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
              private http2: HttpClient, public router: Router,
              public dialog: MatDialog, public locStorage: LocalStorage,
              private authService:AuthenticationService,
              private billingService: BillingService) { }

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

  ngOnInit() {
    this.currentBalance = 0;
    this.billingService.getCajaByIdStatus(localStorage.getItem("id_employee")).subscribe((res)=>{
      this.billingService.getDetailsById(res[0]).subscribe((res2)=>{
        CPrint(res2,"los detallitos");
        this.myDetails = res2;
        this.base = res2[0].valor;
        this.getCreds(res2);
        this.getDebts(res2);
        this.getDevoluciones(res2);
      },
      error => {
        let dialogRef = this.dialog.open(SelectboxComponent, {
          width: '60vw',
          data: {},
          disableClose: true
        }).afterClosed().subscribe(response2=> {
          CPrint("this is my boolean, ",response2.open);
          this.locStorage.setDoINav(false);
          if(response2.logout){
            // noinspection JSIgnoredPromiseFromCall
            this.logout();
          }else if(response2.open){
            this.locStorage.setIdCaja(response2.idcaja);

            this.locStorage.setCajaOld(response2.idcaja);
            this.locStorage.setBoxStatus(true);
            this.http2.get(Urlbase.cierreCaja + "/close/myboxes?id_person="+this.locStorage.getPerson().id_person).subscribe(resp => {
              //@ts-ignore
              resp.forEach(element => {
                if(element.id_CAJA==this.locStorage.getIdCaja()){
                  this.locStorage.setIdStore(element.id_STORE);
                  this.http2.get(Urlbase.cierreCaja +"/close/openBox?id_store="+this.locStorage.getIdStore()).subscribe(
                    elements => {
                      //@ts-ignore
                      elements.forEach(thing => {
                        //@ts-ignore
                        if(thing.id_CAJA==element.id_CAJA){
                          //@ts-ignore
                          this.locStorage.setCajaNumber(thing.caja)
                          this.ngOnInit()
                        }

                      });
                    }
                  );
                  this.getLists();
                  this.getStoreType(element.id_STORE);
                }
              });
            });
            dialogRef = this.dialog.open(OpenBoxComponent, {
              width: '60vw',
              data: {flag:false},
              disableClose: true
            }).afterClosed().subscribe(response=> {
              this.http2.post(Urlbase.facturacion+"/pedidos/abrirCajaPlanilla?IDCIERRECAJA="+this.locStorage.getIdCaja(),{}).subscribe(e=> {
                this.locStorage.setBoxStatus(true);
                CPrint("ID CAJA: ",this.locStorage.getIdCaja());
                CPrint("ID STORE: ",this.locStorage.getIdStore());
                CPrint("STORE TYPE: ",this.locStorage.getTipo());
                CPrint("BOX TYPE: ",this.locStorage.getBoxStatus());
                this.SelectedStore=this.locStorage.getIdStore();
                this.locStorage.setCajaOld(this.locStorage.getIdCaja());
                this.ngOnInit()
                // noinspection JSIgnoredPromiseFromCall
                this.getStores2();
                this.firstComponentFunction()
              });
            });
          }else{
            this.locStorage.setIdCaja(response2.idcaja);

            this.locStorage.setCajaOld(response2.idcaja);
            this.getStores3(response2.idcaja);

            this.http2.get(Urlbase.cierreCaja + "/close/myboxes?id_person="+this.locStorage.getPerson().id_person).subscribe(resp => {
              //@ts-ignore
              resp.forEach(element => {
                if(element.id_CAJA==this.locStorage.getIdCaja()){
                  this.locStorage.setIdStore(element.id_STORE);
                  this.http2.get(Urlbase.cierreCaja +"/close/openBox?id_store="+this.locStorage.getIdStore()).subscribe(
                    elements => {
                      //@ts-ignore
                      elements.forEach(thing => {
                        //@ts-ignore
                        if(thing.id_CAJA==element.id_CAJA){
                          //@ts-ignore
                          this.locStorage.setCajaNumber(thing.caja)
                        }

                      });
                    }
                  );
                  this.getLists();
                  this.getStoreType(element.id_STORE);
                  this.getStores2();
                }
              });
            })

          }
        });
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



  getStores3(object) {
    this.billingService.getStoresByThird(this.locStorage.getToken().id_third).subscribe(data => {
      this.getStoreType(data[0].id_STORE);
      CPrint(data);
      this.locStorage.setBoxStatus(false);
      this.Stores = data;
      this.SelectedStore = data[0].id_STORE;
      this.locStorage.setIdStore(data[0].id_STORE);
      this.http2.get(Urlbase.cierreCaja +"/close/openBox?id_store="+data[0].id_STORE).subscribe(
        elements => {
          //@ts-ignore
          elements.forEach(thing => {
            //@ts-ignore
            if(thing.id_CAJA==object){
              //@ts-ignore
              this.locStorage.setCajaNumber(thing.caja)
            }

          });
        }
      );
      this.getLists()
    }      )
  }




  firstComponentFunction(){
    this.billingService.onClick();
  }

  SelectedStore;
  Stores;
  getStores2() {
    this.billingService.getStoresByThird(this.locStorage.getToken().id_third).subscribe(data => {
      CPrint(data);
      this.Stores = data;
      this.SelectedStore = this.locStorage.getIdStore();
      this.locStorage.setDoINav(false);
    })
  }

  getStoreType(id_store){
    //@ts-ignore
    this.http2.get(Urlbase.tienda + "/store/tipoStore?id_store="+id_store).subscribe( response => {
      this.locStorage.setTipo(response);
      CPrint("ID CAJA: ",this.locStorage.getIdCaja());
      CPrint("ID STORE: ",this.locStorage.getIdStore());
      CPrint("STORE TYPE: ",this.locStorage.getTipo());
      CPrint("BOX TYPE: ",this.locStorage.getBoxStatus());
      this.getStores();
    })
  }

  storeName=" ";

  getStores() {
    this.billingService.getStoresByThird(this.locStorage.getToken().id_third).subscribe(data => {
      data.forEach(element => {
        if(element.id_STORE==this.locStorage.getIdStore()){
          this.storeName = element.store_NAME;
        }
      });
    })
  }



  getLists(){

    this.locStorage.setOnline(true);
    this.locStorage.getStores();
    this.locStorage.getBoxes();



    this.http2.get(Urlbase.tienda+"/price-list/priceList?idstore="+this.locStorage.getIdStore()).subscribe(response => {
      this.locStorage.setPriceList(response);
      // this.inventoriesService.getInventory(this.locStorage.getIdStore()).subscribe(res => {
      //   this.locStorage.setInventoryList(res);
      // })
      //this.getInventoryList(this.locStorage.getIdStore());
    })

  }


  getInventoryList(store){
    this.http2.get(Urlbase.tienda+"/products2/inventoryListActivos?id_store="+this.locStorage.getIdStore()).subscribe(data => {
      this.locStorage.setInventoryList(data);  
    });

  }



  goIndex() {
    let link = ['/'];
    // noinspection JSIgnoredPromiseFromCall
    this.router.navigate(link);
  }

  token:Token;

  async logout() {
    if(!this.locStorage.isSession()){
      this.token=null;
      localStorage.setItem("Logo","-1");
      this.goIndex();
      return;
    }
    let promesa = await this.authService.logout();
    if(promesa[0] == 1){
      this.token=null;
      localStorage.setItem("Logo","-1");
      this.goIndex();

      this.showNotification('top','right');
    }else{
      CPrint("promesa");
      CPrint(promesa);

      this.showNotification('top','right',promesa[1]);
    }

  }

  showNotification(from, align,text = "Usted <b>Cerro Sesión</b> de forma satisfactoria."){
    const type = ['','info','success','warning','danger'];

    const color = Math.floor((Math.random() * 4) + 1);

    $.notify({
      icon: "notifications",
      message: text

    },{
      type: type[2],
      timer: 200,
      placement: {
        from: from,
        align: align
      }
    });
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
        this.router.navigateByUrl("/dashboard/business/menu");
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
            movementToPost = '[{"valor": ' + String(this.efectivo+this.tarjCred+this.tarjDeb) + ', "naturaleza": "D", "movement_DATE": "2019-03-23", "notes": "Total de ventas"}]';
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
              })
            })
          })
            })
          })
        })
      })
    })})})
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
        balance: Number(this.pdfJson.balance),
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
          balance: Number(this.pdfJson.balance),
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


  closeBox() {
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

}