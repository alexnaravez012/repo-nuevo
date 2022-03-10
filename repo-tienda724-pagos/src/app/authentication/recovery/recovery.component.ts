import { Component, OnInit } from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ToastrService} from 'ngx-toastr';
import {HttpClient} from '@angular/common/http';
import {Urlbase} from '../../shared/urls';
import {Platform} from '@angular/cdk/platform';

@Component({
  selector: 'app-recovery',
  templateUrl: './recovery.component.html',
  styleUrls: ['./recovery.component.scss']
})
export class RecoveryComponent implements OnInit {

  form: FormGroup;
  ocupado = true;

  public ngxLoadingAnimationTypes = {
    chasingDots: 'chasing-dots',
    circle: 'sk-circle',
    circleSwish: 'circleSwish',
    cubeGrid: 'sk-cube-grid',
    doubleBounce: 'double-bounce',
    none: 'none',
    pulse: 'pulse',
    rectangleBounce: 'rectangle-bounce',
    rotatingPlane: 'rotating-plane',
    threeBounce: 'three-bounce',
    wanderingCubes: 'wandering-cubes'
  };

  Token = "";

  MostrarPass = false;
  ChangePassMode(){this.MostrarPass = !this.MostrarPass;}

  public ancho:number = 1;
  constructor(private route: ActivatedRoute,private fb: FormBuilder,private toastr: ToastrService,public router: Router,private http:HttpClient) {
    this.ancho = window.innerWidth;
    console.log("ancho ",this.ancho)
    this.form = this.fb.group({
      newPass: ['', Validators.required],
      confirmNewPass: ['', Validators.required],
    }); }

  async ngOnInit() {
    try {
      this.Token = this.route.snapshot.queryParamMap.get("token");
      console.log("Token es ")
      console.log(this.Token)
      let TokenValido = await this.CheckToken(this.Token);
      if(TokenValido){
        this.ocupado = false;
      }else{ throw "Error";}
    }catch (e) {
      this.toastr.error("Token Inválido o Expirado");
      //this.GoToIndex();
    }
  }

  async CambiarClave(){
    if(!this.form.valid){return;}
    if(this.form.controls.newPass.value != this.form.controls.confirmNewPass.value){ this.toastr.error("Las Contraseñas Son Diferentes"); return;}
    if(this.ocupado){return;}
    this.ocupado = true;
    try {
      let Resultado = await this.UsePasswordRecoveryToken(
        this.Token,
        this.form.controls.newPass.value
      );
      if(Resultado){
        this.ocupado = false;
        this.toastr.success("Contraseña cambiada exitosamente");
        this.GoToIndex();
      }else{ throw "Error";}
    }catch (e) {
      this.toastr.error("Token Inválido");
    }
  }

  GoToIndex(){
    this.router.navigateByUrl("/");
  }

  public async UsePasswordRecoveryToken(token:string,pass:string){
    return new Promise((resolve,reject) => {
      this.http.post(Urlbase.auth + "/userecoverytoken", {
        id: token,
        pass: pass
      }).subscribe(value => {
        resolve(true);
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }

  public async CheckToken(token:string){
    return new Promise((resolve,reject) => {
      this.http.post(Urlbase.auth + "/CheckRecoveryToken", {
        id: token
      }).subscribe(value => {
        resolve(true);
      }, error => {
        console.log(error);
        reject(error);
      });
    });
  }
}
