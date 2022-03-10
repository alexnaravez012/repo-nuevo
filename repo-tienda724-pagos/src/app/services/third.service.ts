import {Injectable} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';

import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
/** Files for auth process  */
import {Urlbase} from '../shared/urls';
import {LocalStorage} from './localStorage';
import {Third} from '../tienda724/dashboard/business/thirds724/third/models/third';

import {ThirdDTO} from '../tienda724/dashboard/business/thirds724/third/models/thirdDTO';
import {from, Observable} from 'rxjs';
import * as jQuery from 'jquery';
import 'bootstrap-notify';

let $: any = jQuery;

@Injectable({
  providedIn:'root'
})
export class ThirdService {


  third: Third;
  api_uri = Urlbase.tercero + '/thirds';
  persons = Urlbase.tercero + '/persons';
  api_uri_legal_data = Urlbase.tienda + '/legaldata';
  private options;
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private locStorage: LocalStorage) {


    this.headers = new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization':  this.locStorage.getTokenValue(),
    });

    let token = localStorage.getItem('currentUser');

    this.options = { headers: this.headers };


  }

  // public getThirdList = (id_third?:number,id_third_father?:number,document_type?:number,document_number?:string
  //   ,id_doctype_person?:number,doc_person?:string,id_third_type?:number,state_third?:number,id_person?:number): Observable<{}|Third[]> => {

  //   let params = new HttpParams();
  //   let Operaciones = [];

  //   Operaciones.push(['id_third',  id_third?""+id_third:null]);
  //   Operaciones.push(['id_third_father',  id_third_father?""+id_third_father:null]);

  //   Operaciones.push(['id_typedoc_third', document_type?""+document_type:null]);
  //   Operaciones.push(['doc_third', document_number?""+document_number:null]);
  //   Operaciones.push(['id_third_type', id_third_type?""+id_third_type:null]);
  //   Operaciones.push(['id_doctype_person', id_doctype_person?""+id_doctype_person:null]);
  //   Operaciones.push(['state_third', state_third?""+state_third:null]);
  //   Operaciones.push(['doc_person', doc_person?""+doc_person:null]);
  //   Operaciones.push(['id_person',id_person?""+id_person:null]);

  //   for(let n = 0;n<Operaciones.length;n++){ if(Operaciones[n][1] != null){ params = params.append(Operaciones[n][0],  Operaciones[n][1]); } }
  //   this.options.params = params;
  //   CPrint("this.options es");
  //   CPrint(this.options);
  //   // return this.http.get(this.api_uri, this.options )
  //   //   .map((response: Response) => <Third[]>response.json())
  //   //   .catch(this.handleError);
  //   let promesa = new Promise((resolve, reject) => {
  //     this.http.get<Third[]>(this.api_uri, this.options).subscribe(value => {resolve(value)},error => {this.handleError(error);reject(error)});
  //   });
  //   return from(promesa);
  // };

  public getPersonList = (id_doctype_person?:number,doc_person?:string): Observable<{}|any[]> => {


    let params = new HttpParams();
    let Operaciones = [];
    if((id_doctype_person?""+id_doctype_person:null) != null){
      params = params.append('id_doctype_person',  id_doctype_person?""+id_doctype_person:null);
    }
    if((doc_person?""+doc_person:null) != null){
      params = params.append('doc_person', doc_person?""+doc_person:null);
    }
    this.options.params = params;

    let promesa = new Promise((resolve, reject) => {
      this.http.get<any[]>(this.persons, this.options).subscribe(value => {resolve(value)},error => {this.handleError(error);reject(error)});
    });
    return from(promesa);
  };

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


  public postThird = (body: ThirdDTO): Observable<Boolean|any> => {

    //CPrint('this is body',JSON.stringify(body));

    // return this.http.post(this.api_uri , body, { headers: this.headers })
      //CPrint("this is header: ", this.headers);
    let promesa = new Promise((resolve, reject) => {
      this.http.post<any>(this.api_uri, body, { headers: this.headers }).subscribe(value => {resolve({third_id: value})},error => {this.handleError(error);reject(error)});
    });
    return from(promesa);
  };

  public Delete = (id_third: number): Observable<Response|any> => {
    let promesa = new Promise((resolve, reject) => {
      this.http.delete(this.api_uri +'/'+ id_third,this.options).subscribe(value => {resolve(value ? true:false)},error => {this.handleError(error);reject(error)});
    });
    return from(promesa);
};

  private handleError(error: Response | any) {
    CPrint("[SE EJECUTA HANDLEERROR]");
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
    if(localStorage.getItem("SesionExpirada") != "true"){ alert(errMsg);}
    return null;//Observable.throw(errMsg);
  }

  public asignLegalDataToThird = (id_third,id_legal_data): Observable<any> => {
    let promesa = new Promise((resolve, reject) => {
      this.http.put(this.api_uri_legal_data+"/third?id_third="+String(id_third)+"&id_legal_data="+String(id_legal_data),null,{headers:this.headers}).subscribe(value => {resolve(value)},error => {this.handleError(error);reject(error)});
    });
    return from(promesa);
  };

  public postLegalData = (body): Observable<any> => {
    let promesa = new Promise((resolve, reject) => {
      this.http.post(this.api_uri_legal_data,body,{headers:this.headers}).subscribe(value => {resolve(value)},error => {this.handleError(error);reject(error)});
    });
    return from(promesa);
  };

  public getLegalData = (id_legal_data): Observable<any> => {
    let promesa = new Promise((resolve, reject) => {
      this.http.get(this.api_uri_legal_data+"?id_legal_data="+String(id_legal_data),this.options).subscribe(value => {resolve(value)},error => {this.handleError(error);reject(error)});
    });
    return from(promesa);
  };

  public getIdLegalDataByThird = (id_third): Observable<any> => {
    let promesa = new Promise((resolve, reject) => {
      this.http.get("http://10.10.11.52:8447/v1/legaldata/third?id_third="+String(id_third),this.options).subscribe(value => {resolve(value)},error => {this.handleError(error);reject(error)});
    });
    return from(promesa);
  };

  public putLegalData = (id_legal_data,body): Observable<any> => {
    let promesa = new Promise((resolve, reject) => {
      this.http.put(this.api_uri_legal_data+"?id_legal_data="+String(id_legal_data),body,{headers:this.headers}).subscribe(value => {resolve(value)},error => {this.handleError(error);reject(error)});
    });
    return from(promesa);
  }

}
