import {Component, OnInit} from '@angular/core';
import {Urlbase} from 'src/app/shared/urls';
import {HttpClient} from '@angular/common/http';
import {LocalStorage} from 'src/app/services/localStorage';
import {MatDialogRef} from '@angular/material';
import { BillingService } from 'src/app/services/billing.service';

@Component({
  selector: 'app-create-planilla',
  templateUrl: './create-planilla.component.html',
  styleUrls: ['./create-planilla.component.css']
})
export class CreatePlanillaComponent implements OnInit {

  constructor(private billingService: BillingService,private http: HttpClient,public locStorage: LocalStorage,public dialogRef: MatDialogRef < CreatePlanillaComponent >) { }

  ngOnInit(): void {
    this.getVehicles();
  }

  postPlanilla(){
    this.billingService.getCajaByIdStatus(localStorage.getItem("id_employee")).subscribe((res)=>{
      this.http.post(Urlbase.facturacion+"/pedidos/CrearPlanillaPedidos?IDVEHICULO="+this.SelectedVehicle+"&IDSTORE="+this.locStorage.getIdStore()+"&IDCIERRECAJA="+res[0],{}).subscribe(response => {
        if(response==1){
          if(localStorage.getItem("SesionExpirada") != "true"){ alert("Se creo su planilla con Exito.")}
          this.dialogRef.close();
        }else{
          if(localStorage.getItem("SesionExpirada") != "true"){ alert("Algo fallo al crear la planilla.")}
        }
      })
    })
  }


  ListVehicles;
  SelectedVehicle;
  getVehicles(){
    this.http.get(Urlbase.tienda+"/pedidos/vehiculos").subscribe(response => {
      this.ListVehicles = response;
      this.SelectedVehicle = response[0].id_VEHICULO;
    })
  }
}
