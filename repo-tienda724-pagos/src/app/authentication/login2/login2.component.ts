import {ChangeDetectorRef, Component, OnInit} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import {ActivatedRoute, Router} from '@angular/router';
import {Location} from '@angular/common';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import * as jQuery from 'jquery';
import 'bootstrap-notify';
import {Token} from '../../shared/token';
import {Person} from '../../shared/models/person';
import {Third} from '../../tienda724/dashboard/business/thirds724/third/models/third';
import {CommonThird} from '../../tienda724/dashboard/business/commons/CommonThird';

import {Auth} from '../auth';
/*
*     services of  your component
*/
import {LocalStorage} from '../../services/localStorage';
import {AuthenticationService} from '../../services/authentication.service';
import {UserThirdService} from '../../services/user-third.service';
import {ThirdService} from '../../services/third.service';

let $: any = jQuery;
@Component({
  selector: 'app-login2',
  templateUrl: './login2.component.html',
  styleUrls: ['./login2.component.css']
})
export class Login2Component implements OnInit {

  title: string = 'Iniciar Session';
  isLoggedIn: boolean = false;
  error: string = '';
  form: FormGroup;
  action: string = 'Iniciar Sesion';
  auth: Auth;

  token:Token;
  UUID:string;

  person:Person;
  thirdFather:Third;
  commonThird:CommonThird;


  AppID = -1;


  constructor(public location: Location,
              private _router: Router,
              private userThirdService: UserThirdService,
              public thirdService:ThirdService,
              private route: ActivatedRoute,
              private router: Router,
              private fb: FormBuilder,
              public locStorage: LocalStorage,
              private authService: AuthenticationService) {

    this.auth = new Auth(null, null);
    this.commonThird= new CommonThird(null,null,null,null);
    this.person= new Person(null,null,null,null,null,null,null,this.commonThird,null,null,null);

  }

  isNan(){
    return isNaN(this.AppID);
  }

  ngOnInit() {
    this.AppID = parseInt(this.route.snapshot.queryParamMap.get("appid"));//de momento null es normal y "30" es motor 1a, "40" es para maskotas
    if(this.locStorage.getAppId()!=-1){
      this.AppID = this.locStorage.getAppId();
    }
    this.locStorage.setAppID(this.AppID);
    console.log("AppID es ")
    console.log(this.AppID)
    this.controlsCreate();

    let session=this.locStorage.getSession();
    if(!session){
      /**
      @todo Eliminar comentario para
      */
    }else{
      CPrint("Sesión previa, redireccionando");
      this.router.navigate(['/dashboard/business']);
    }
  }

  // start controls from from
  controlsCreate() {
    this.form = this.fb.group({
      usuario: ['', Validators.required],
      clave: ['', Validators.required],
    });
  }

  public IsMobile(){
    return window.innerWidth < 700;
  }

  logout(){
    this.authService.logout()
  }

  loginEnCurso = false;
  login() {
    if(this.loginEnCurso){
      return;
    }
    this.showNotification('top','center',3,"<p> Procesando datos, por favor espere  <p> <br> ",'info');
    this.loginEnCurso = true;
    this.locStorage.cleanSession();
    this.auth.usuario = this.form.value['usuario'];
    this.auth.clave = this.form.value['clave'];
    localStorage.setItem("SesionExpirada","false");
    this.authService.login(this.auth)
      .subscribe(
      async (result) => {
        try {

          this.token=this.locStorage.getToken();
          this.UUID=""+this.token.id_usuario;

          CPrint("this.authService.FullLogin: ", this.authService.FullLogin);
          CPrint("this.locStorage.getPerson(): ", this.locStorage.getPerson());

          this.person = {
            birthday:null,
            directoryDTO:null,
            employee:null,
            first_lastname: this.authService.FullLogin.third.last_name,
            first_name: this.authService.FullLogin.third.fist_name,
            second_lastname: this.authService.FullLogin.third.second_last_name,
            second_name: this.authService.FullLogin.third.second_name,
            info: {
              document_number:this.authService.FullLogin.third.document,
              fullname:this.authService.FullLogin.third.fullname,
              id_common_basicinfo:null,
              id_document_type:null,
              img:null,
              type_document:this.authService.FullLogin.third.document_type
            },
            id_person:this.authService.FullLogin.third.id_person,
            uuid:{
              id_person:this.authService.FullLogin.third.id_person,
              id_user_third:this.authService.FullLogin.id_third,
              state:null,
              UUID:this.authService.FullLogin.id_usuario+""
            },
            common_thirdDTO:null
          };

          this.token.id_third=this.authService.FullLogin.id_third;
          this.token.id_third_father=this.authService.FullLogin.third.id_third_father;
          localStorage.setItem('currentUserPersonStore724', JSON.stringify(this.person));
          localStorage.setItem('currentUserTokenStore724',JSON.stringify(this.token));
          let father:Third = {
            directory:null,
            id_third:this.authService.FullLogin.id_third,
            id_third_father:null,
            info:{
              type_document:this.authService.FullLogin.third_father.document_type,
              fullname:this.authService.FullLogin.third_father.fullname,
              document_number:this.authService.FullLogin.third_father.document,
              img:null,
              id_document_type:null,
              id_common_basicinfo:null
            },
            profile:0,
            state:null,
            type:null
          }
          localStorage.setItem('currentThirdFatherStore724',JSON.stringify(father));
          this.cargarPerfil();
        }catch (e) {
          CPrint("e",e);
          this.loginEnCurso = false;
        }
      },error1 => {
        this.loginEnCurso = false;
        this.showNotification('top','right',3,"<p>Usuario y/o clave incorrectos</p>",'warning');
      })
  }

  cargarPerfil() {

    if(this.person['info']['fullname']!=null && this.person['info']['fullname']!=undefined && this.person['info']['fullname']!=""){
      this.showNotification('top','center',3,"<h3> Bienvenido!  <h3> "+this.person['info']['fullname'],'success');
    }else{
      this.showNotification('top','center',3,"<h3> Bienvenido!  <h3> "+this.person['first_name']+" "+this.person['first_lastname'],'success');
    }
    this.router.navigate(['/dashboard/business']);
  }

  // Notification
  showNotification(from, align,id_type?, msn?, typeStr?){
    const type = ['','info','success','warning','danger'];

    const color = Math.floor((Math.random() * 4) + 1);

    $.notify({
        icon: "notifications",
        message: msn?msn:"<b>Noficación automatica </b>"

    },{
        type: typeStr? typeStr:type[id_type?id_type:2],
        timer: 200,
        placement: {
            from: from,
            align: align
        }
    });
  }
  // services

  logins(){

  }

}
