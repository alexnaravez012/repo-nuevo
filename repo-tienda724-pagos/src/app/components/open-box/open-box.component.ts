import {Component, Inject, OnInit} from '@angular/core';
import {LocalStorage} from '../../services/localStorage';
import {BillingService} from '../../services/billing.service';
import {ThirdService} from '../../services/third.service';
import {Router} from '@angular/router';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {HttpClient} from '@angular/common/http';
import {Urlbase} from '../../shared/urls';

@Component({
  selector: 'app-open-box',
  templateUrl: './open-box.component.html',
  styleUrls: ['./open-box.component.scss']
})
export class OpenBoxComponent implements OnInit {



  constructor(public router: Router,
              private http2: HttpClient,
              public dialogRef: MatDialogRef<OpenBoxComponent>,
              private locStorage: LocalStorage,
              private billingService : BillingService,
              private thirdService : ThirdService,
              @Inject(MAT_DIALOG_DATA) public flag: any ) { }

  nombreEmpleado: any;

  nombreTienda: any;

  myBox: any = 4;

  idThird: any;

  nombreCaja: String;

  nombreTienda2: String;

  boxToPost = {
    id_THIRD_EMPLOYEE: 0,
    notes:"Base Inicial",
    starting_DATE:"2019-03-27",
    balance:0,
    status: "O",
    id_CAJA: this.locStorage.getIdCaja()
  };

  idEmployee;
  notes = "Base Inicial ";
  money = 0;

  initialMoney = {
    valor: 0,
    naturaleza: "D",
    movement_DATE: "2019-03-23",
    notes:"Base Inicial"
  };

  disabledButton(){
    return !(this.money > 0 || this.money == 0);
  }

  ngOnInit() {
    //CPrint("THIS IS FLAG, ",this.flag.flag)
    this.http2.get(Urlbase.cierreCaja + "/close/details?id_caja="+this.locStorage.getIdCaja()).subscribe(data => {
      //@ts-ignore
      this.nombreCaja = data.caja;
      //@ts-ignore
      this.nombreTienda2 = data.store;
    });
    //CPrint("This is Person : ",this.locStorage.getPerson())
    this.nombreEmpleado= this.locStorage.getPerson().first_name +" "+ this.locStorage.getPerson().first_lastname;
    this.nombreTienda= this.locStorage.getThird().info.fullname;
    this.idEmployee = localStorage.getItem("id_employee");
  }


  closeDialog() {
    this.dialogRef.close();
  }


  openBox(){
    this.boxToPost.id_THIRD_EMPLOYEE = this.idEmployee;
    this.boxToPost.notes = this.notes;
    this.billingService.postBox(this.boxToPost).subscribe(res=>{
      localStorage.setItem("currentBox",res);
      localStorage.setItem("movements",'-'+this.money);
      localStorage.setItem("sells",'');
      this.locStorage.setBase(Number(this.money));
      this.initialMoney.valor =  Number(this.money);
      this.initialMoney.notes = this.notes;
      let initialMoneyToPost = '[{"valor": '+String(this.initialMoney.valor)+', "naturaleza": "D", "movement_DATE": "2019-03-23", "notes": "Base Incial"}]';
      //CPrint(initialMoneyToPost)
      this.billingService.postBoxDetail(JSON.parse(initialMoneyToPost),Number(res)).subscribe(res=>{

        this.closeDialog();
      });
    });

  }


  gotoDashboard(){
    this.router.navigateByUrl("/dashboard/business/menu");
    this.closeDialog();
  }

}
