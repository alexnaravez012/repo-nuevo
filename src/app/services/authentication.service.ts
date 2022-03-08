import {Injectable} from '@angular/core';
//import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/catch';
import {from, Observable} from 'rxjs';
/** Files for auth process  */
import {Urlbase} from '../shared/urls';
import {LocalStorage} from './localStorage';
import {Auth} from '../authentication/auth';
import {UsuarioDTO} from '../shared/models/auth/UsuarioDTO';

import {Token} from '../shared/token';
import {Session} from '../shared/session';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {CPrint} from '../shared/util/CustomGlobalFunctions';
import {FCMservice} from './fcmservice.service';

//import { Http, Headers, Response, URLSearchParams } from '@angular/http';


@Injectable({
  providedIn:'root'
})
export class AuthenticationService {
  username: string;
  loggedIn: boolean;
  token: Token;
  session: Session;
  FullLogin:{
    id_usuario:number,
    id_aplicacion:number,
    usuario:string,
    menus:[],
    roles: [],
    id_third:number,
    third:{
      fist_name:string,
      second_name:string,
      last_name:string,
      second_last_name:string,
      fullname:string,
      document_type:string,
      document:string,
      id_third_father:number,
      id_person:number,
      img:string
    },
    third_father:{
      document:string,
      document_type:string,
      fullname:string
    }
  } = null;
  urlAuth = Urlbase.auth + '/usuarios';
  private options;
  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient, private locStorage: LocalStorage,private fcmService:FCMservice) { }

  public login = (auth: Auth): Observable<{}|Boolean> => {
    let promesa = new Promise((resolve, reject) => {
      this.http.post<any>(Urlbase.auth + '/login?id_aplicacion=' + 21 + '&dispositivo=WEB', auth, { headers: this.headers})
        .subscribe((value) => {
          console.log("value: ", value);
          this.token = value;
          this.session = value;
          this.FullLogin = value;

          localStorage.setItem('currentUserSessionStore724', JSON.stringify(this.session));

          localStorage.setItem('currentUserTokenStore724', JSON.stringify(this.token));
          localStorage.setItem('currentUserMenuStore724', JSON.stringify(this.session['menus']));
          localStorage.setItem('currentUserRolStore724', JSON.stringify(this.session['roles']));

          this.loggedIn = true;

          resolve(true)
        },error => {
          //if(localStorage.getItem("SesionExpirada") != "true"){ alert("Usuario o Contraseña Incorrecto");}
          this.loggedIn = false;
          reject(false);
        });
    });
    return from(promesa);
  };

  public postUserAUTH = (auth: UsuarioDTO): Observable<Number|any> => {
    let promesa = new Promise((resolve, reject) => {
      this.http.post(this.urlAuth, auth, { headers: this.headers,withCredentials:true })
        .subscribe(value => {
          resolve(value)
        },error => {
          this.handleError(error);reject(null)
        });
    });
    return from(promesa);
  };

  public register = (auth: Auth): Observable<{}|Boolean> => {
    let promesa = new Promise((resolve, reject) => {
      this.http.post(this.urlAuth, auth, { headers: this.headers })
        .subscribe(value => {resolve(true)},error => {this.handleError(error);reject(false)});
    });
    return from(promesa);
  };

  public logout() {
    console.log("TOKEN");
    console.log({token:this.fcmService.Token});
      return new Promise((resolve, reject) => {
        //this.http.delete(this.urlAuth, this.options)ç

        this.http.post(Urlbase.auth+"/logout", {token:this.fcmService.Token},{headers:this.headers})
          .subscribe(value => {
            console.log("VALUE");
            console.log(value);
            this.locStorage.cleanSession();
            resolve([1,value])},error => {
            this.locStorage.cleanSession();this.handleError(error);reject([-1,error])});
      });
  };

  isLoggedIn() {
    return this.loggedIn;
  }

  private handleError(error: Response | any): Observable<Boolean> {
    // In a real world app, we might use a remote logging infrastructure
    let errMsg: string;
    if (error instanceof Response) {
      const body = error.json() || '';
      // @ts-ignore
      const err = body.error || JSON.stringify(body);
      errMsg = `${error.status} - ${error.statusText || ''} ${err}`;

    } else {
      errMsg = error.message ? error.message : error.toString();
    }
    if(localStorage.getItem("SesionExpirada") != "true"){ alert("Usuario o Contraseña Erroneos.");}
    CPrint("errMsg");
    CPrint(errMsg);
    return Observable.throw(false);
    //return Observable.throw(errMsg);
  }
}
