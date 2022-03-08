import {Injectable} from '@angular/core';
//import { Http, Headers, Response, URLSearchParams } from '@angular/http';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
//import 'rxjs/add/operator/map';
//import 'rxjs/add/operator/catch';
import {from, Observable} from 'rxjs';
/** Files for auth process  */
import {Urlbase} from '../../../../../shared/urls';
import {LocalStorage} from '../../../../../services/localStorage';
import {Category} from './models/category';
import {CategoryDTO} from './models/categoryDTO';

@Injectable()
export class CategoriesService {

  category: Category;
  api_uri = Urlbase.tienda + '/categories';
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

  getFiles() {
    let promesa = new Promise((resolve, reject) => {
      this.http.get<any>('assets/files.json')
        .subscribe(value => {resolve(value.data)},error => {this.handleError(error);reject(error)});
    });
    return promesa;
}


  public getCategoryList = (state?: number,id_category?:number,id_common?:number, id_category_father?: number, img_url?:string, name?: string,
    description?:string, id_state?:number, creation_attribute?: Date, modify_attribute?:Date): Observable<{}|Category[]> => {

      //CPrint("id_category")
      let params = new HttpParams();
let Operaciones = [];

      Operaciones.push(['id_category',  id_category?""+id_category:null]);
      Operaciones.push(['id_common',  id_common?""+id_common:null]);
      Operaciones.push(['id_category_father', id_category_father?""+id_category_father:null]);
      Operaciones.push(['img_url', img_url?""+img_url:null]);
      Operaciones.push(['name', name?""+name:null]);
      Operaciones.push(['description', description?""+description:null]);
      Operaciones.push(['id_state', id_state?""+id_state:null]);
      Operaciones.push(['state', state?""+state:null]);
      Operaciones.push(['creation_attribute', creation_attribute?""+creation_attribute:null]);
      Operaciones.push(['modify_attribute', modify_attribute?""+modify_attribute:null]);

      for(let n = 0;n<Operaciones.length;n++){ if(Operaciones[n][1] != null){ params = params.append(Operaciones[n][0],  Operaciones[n][1]); } }
      this.options.params = params;
      let promesa = new Promise((resolve, reject) => {
        this.http.get<Category[]>(this.api_uri, this.options )
          .subscribe(value => {resolve(value)},error => {this.handleError(error);reject(error)});
      });
      return from(promesa);
    };


    public putMeasureUnit = (id:number,body: CategoryDTO): Observable<Boolean|any> => {
      let promesa = new Promise((resolve, reject) => {
        this.http.put(this.api_uri +"/"+ id, body, { headers: this.headers })
          .subscribe(value => {resolve(true)},error => {this.handleError(error);reject(false)});
      });
      return from(promesa);
    };

    public Delete = (id_category: number): Observable<Response|any> => {
      let promesa = new Promise((resolve, reject) => {
        this.http.delete(this.api_uri +'/'+ id_category,this.options)
          .subscribe(value => {resolve(true)},error => {this.handleError(error);reject(false)});
      });
      return from(promesa);
    };

    public postCategory = (body: CategoryDTO): Observable<Boolean|any> => {
      let promesa = new Promise((resolve, reject) => {
        this.http.post(this.api_uri , body, { headers: this.headers })
          .subscribe(value => {resolve(true)},error => {this.handleError(error);reject(false)});
      });
      return from(promesa);
    };

    private handleError(error: Response | any) {
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

}
