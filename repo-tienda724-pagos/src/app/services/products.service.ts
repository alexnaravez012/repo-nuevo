import {Injectable} from '@angular/core';

import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
/** Files for auth process  */
import {Urlbase} from '../shared/urls';
import {LocalStorage} from './localStorage';
import {Product} from '../tienda724/dashboard/business/store724/products/models/product';
import {ProductDTO} from '../tienda724/dashboard/business/store724/products/models/productDTO';
import {from, Observable} from 'rxjs';

@Injectable({
  providedIn:'root'
})
export class ProductsService {


  api_uri = Urlbase.tienda + '/products';
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


  public getProductList = (state_product?:number,id_product?:number,id_category?:number,stock?:number,stock_min?:number,
    img_url?:string,code?:string,id_tax?:number,id_common_product?:number,name_product?:number,
    description_product?:string,id_state_product?:number ): Observable<{}|Product[]> => {
      let params = new HttpParams();
      let Operaciones = [];

      Operaciones.push(['id_product',  id_product?""+id_product:null]);
      Operaciones.push(['id_category',  id_category?""+id_category:null]);
      Operaciones.push(['stock', stock?""+stock:null]);
      Operaciones.push(['stock_min', stock_min?""+stock_min:null]);
      Operaciones.push(['img_url', img_url?""+img_url:null]);
      Operaciones.push(['code', code?""+code:null]);
      Operaciones.push(['id_tax', id_tax?""+id_tax:null]);
      Operaciones.push(['id_common_product', id_common_product?""+id_common_product:null]);
      Operaciones.push(['name_product', name_product?""+ name_product:null]);
      Operaciones.push(['description_product', description_product?""+description_product:null]);

      Operaciones.push(['id_state_product', id_state_product?""+id_state_product:null]);
      Operaciones.push(['state_product', state_product?""+state_product:null]);




      for(let n = 0;n<Operaciones.length;n++){ if(Operaciones[n][1] != null){ params = params.append(Operaciones[n][0],  Operaciones[n][1]); } }
      this.options.params = params;
      let promesa = new Promise((resolve, reject) => {
        this.http.get<Product[]>(this.api_uri, this.options )
          .subscribe(value => {resolve(value)},error => {this.handleError(error);reject(error)});
      });
      return from(promesa);
    };

    public Delete = (id_product: number): Observable<Response|any> => {
      let promesa = new Promise((resolve, reject) => {
        this.http.delete(this.api_uri +'/'+ id_product,this.options)
          .subscribe(value => {resolve(true)},error => {this.handleError(error);reject(false)});
      });
      return from(promesa);
    };

    public postProduct = (body: ProductDTO): Observable<Boolean|any> => {
      let promesa = new Promise((resolve, reject) => {
        this.http.post(this.api_uri , body, { headers: this.headers })
          .subscribe(value => {resolve(true)},error => {this.handleError(error);reject(false)});
      });
      return from(promesa);
    };

    public putProduct = (id:number,body: ProductDTO): Observable<Boolean|any> => {
      let promesa = new Promise((resolve, reject) => {
        this.http.put(this.api_uri +"/"+ id, body, { headers: this.headers })
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
