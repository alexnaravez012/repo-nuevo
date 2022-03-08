import {Injectable} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
/** Files for auth process  */
import {Urlbase} from '../shared/urls';
import {LocalStorage} from './localStorage';
import {Inventory} from '../tienda724/dashboard/business/store724/inventories/models/inventory';
import {InventoryDetail} from '../tienda724/dashboard/business/store724/inventories/models/inventoryDetail';
import {InventoryDetailDTO} from '../tienda724/dashboard/business/store724/inventories/models/inventoryDetailDTO';
import {InventoryDetailSimple} from '../tienda724/dashboard/business/store724/inventories/models/inventoryDetailSimple';
import {InventoryDTO} from '../tienda724/dashboard/business/store724/inventories/models/inventoryDTO';
import {InventoryParameters} from '../tienda724/dashboard/business/store724/inventories/models/inventaryParameter';
import {InventoryQuantityDTO} from '../tienda724/dashboard/business/store724/inventories/models/inventoryQuantityDTO';

import {FilterInventory} from '../tienda724/dashboard/business/store724/inventories/models/filters';
import {InventoryName} from '../tienda724/dashboard/business/billing724/billing/bill-main/bill-main.component';
import {from, Observable} from 'rxjs';

@Injectable({
  providedIn:'root'
})
export class InventoriesService {


  api_uri_inv = Urlbase.tienda + '/inventories';
  api_uri_inv_det = Urlbase.tienda + '/inventories-details';
  api_uri_inv_det_spl = Urlbase.tienda + 'inventories-details/simple';
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

  public getInventoriesList = (state_inventory?: number, id_inventory?: number,
    id_third?: number, id_common_inventory?: number,
    name_inventory?: string, description_inventory?: string,
    id_state_inventory?: number): Observable<{} | Inventory[]> => {

    let params = new HttpParams();
    let Operaciones = [];

    Operaciones.push(['id_inventory', id_inventory ? "" + id_inventory : null]);
    Operaciones.push(['id_third', id_third ? "" + id_third : null]);
    Operaciones.push(['id_common_inventory', id_common_inventory ? "" + id_common_inventory : null]);
    Operaciones.push(['name_inventory', name_inventory ? "" + name_inventory : null]);
    Operaciones.push(['description_inventory', description_inventory ? "" + description_inventory : null]);
    Operaciones.push(['id_state_inventory', id_state_inventory ? "" + id_state_inventory : null]);
    Operaciones.push(['state_inventory', state_inventory ? "" + state_inventory : null]);

    for(let n = 0;n<Operaciones.length;n++){ if(Operaciones[n][1] != null){ params = params.append(Operaciones[n][0],  Operaciones[n][1]); } }
    this.options.params = params;
    let promesa = new Promise((resolve, reject) => {
      this.http.get<Inventory[]>(this.api_uri_inv, this.options).subscribe(value => {resolve(value)},error => {this.handleError(error);reject(error)});
    });
    return from(promesa);
  };


  public getInventoriesParamters = (id_inventory?: number,
    id_third?: number): Observable<{} | InventoryParameters> => {

    let params = new HttpParams();
    let Operaciones = [];

    Operaciones.push(['id_inventory', id_inventory ? "" + id_inventory : null]);
    Operaciones.push(['id_third', id_third ? "" + id_third : null]);

    for(let n = 0;n<Operaciones.length;n++){ if(Operaciones[n][1] != null){ params = params.append(Operaciones[n][0],  Operaciones[n][1]); } }
    this.options.params = params;
    let promesa = new Promise((resolve, reject) => {
      this.http.get<InventoryParameters>(this.api_uri_inv+"/parameters", this.options).subscribe(value => {resolve(value)},error => {this.handleError(error);reject(error)});
    });
    return from(promesa);
  };



  public postInventory = (body: InventoryDTO): Observable<Number | any> => {

    let params = new HttpParams();
    let Operaciones = [];


    for(let n = 0;n<Operaciones.length;n++){ if(Operaciones[n][1] != null){ params = params.append(Operaciones[n][0],  Operaciones[n][1]); } }
    this.options.params = params;

    let promesa = new Promise((resolve, reject) => {
      this.http.post(this.api_uri_inv, body, this.options).subscribe(value => {resolve(value)},error => {this.handleError(error);reject(null)});
    });
    return from(promesa);
  };

  public putInventory = (id: number, body: InventoryDTO): Observable<Boolean | any> => {

    let promesa = new Promise((resolve, reject) => {
      this.http.put(this.api_uri_inv + "/" + id, body, { headers: this.headers })
        .subscribe(value => {resolve(true)},error => {this.handleError(error);reject(false)});
    });
    return from(promesa);
  };

//----------------------------------------------------------------------------------------------------------------------------
  public getInventory = (id: number): Observable<Boolean | any> => {
    let promesa = new Promise((resolve, reject) => {
      console.log(Urlbase.tienda + "/products2/inventoryListActivos?id_store=" + id);
      this.http.get<InventoryName[]>(Urlbase.tienda + "/products2/inventoryListActivos?id_store=" + id, { headers: this.headers })
        .subscribe(value => {resolve(value)},error => {this.handleError(error);reject(error)});
    });
    return from(promesa);
  };
//----------------------------------------------------------------------------------------------------------------------------

  public deleteInventory = (id_inventory: number): Observable<Response | any> => {
    let promesa = new Promise((resolve, reject) => {
      this.http.delete(this.api_uri_inv + '/' + id_inventory, this.options)
        .subscribe(value => {resolve(true)},error => {this.handleError(error);reject(false)});
    });
    return from(promesa);
  };

  public getInventoriesDetailSimpleList = (state_inv_detail?: number, id_inventory_detail?: number,
    id_inventory?: number,
    id_product_third?: number, quantity?: number,
    code?: string, description_inventory?: string,
    id_state_inv_detail?: number): Observable<{} | InventoryDetailSimple[]> => {

    let params = new HttpParams();
    let Operaciones = [];

    Operaciones.push(['id_inventory_detail', id_inventory_detail ? "" + id_inventory_detail : null]);
    Operaciones.push(['id_inventory', id_inventory ? "" + id_inventory : null]);
    Operaciones.push(['id_product_third', id_product_third ? "" + id_product_third : null]);
    Operaciones.push(['quantity', quantity ? "" + quantity : null]);
    Operaciones.push(['code', code ? "" + code : null]);
    Operaciones.push(['id_state_inv_detail', id_state_inv_detail ? "" + id_state_inv_detail : null]);
    Operaciones.push(['state_inv_detail', state_inv_detail ? "" + state_inv_detail : null]);

    for(let n = 0;n<Operaciones.length;n++){ if(Operaciones[n][1] != null){ params = params.append(Operaciones[n][0],  Operaciones[n][1]); } }
    this.options.params = params;
    let promesa = new Promise((resolve, reject) => {
      this.http.get<InventoryDetailSimple[]>(this.api_uri_inv_det_spl, this.options)
        .subscribe(value => {resolve(value)},error => {this.handleError(error);reject(error)});
    });
    return from(promesa);
  };

      /**
   *
   * @param error
   */
  public getInventoriesDetailList = (state_inv_detail?:number,state_product?:number,id_inventory_detail?:number,
              id_inventory?:number, quantity?:number,id_state_inv_detail?:number,
              id_product?:number,id_category?:number,stock?:number,
              stock_min?:number,img_url?:string,id_tax?:number,
              id_common_product?:number,name_product?:string,
              description_product?:string,id_state_product?:number,
              id_product_third?:number,location?:number,
              id_third?:number,id_category_third?:number,

              id_state_prod_third?:number,state_prod_third?:number,
              id_measure_unit?:number,id_measure_unit_father?:number,
              id_common_measure_unit?:number,name_measure_unit?:string,
              description_measure_unit?:string,id_state_measure_unit?:number,
              state_measure_unit?:number,id_code?:number,
              code?:number,img?:string,
              id_attribute_list?:number,
              id_state_cod?:number,state_cod?:number): Observable<{} | InventoryDetail[]> => {

    let params = new HttpParams();
    let Operaciones = [];

    Operaciones.push(['state_inv_detail', state_inv_detail ? "" + state_inv_detail : null]);

    Operaciones.push(['id_inventory_detail', id_inventory_detail ? "" + id_inventory_detail : null]);
    Operaciones.push(['id_inventory', id_inventory ? "" + id_inventory : null]);
    Operaciones.push(['quantity', quantity ? "" + quantity : null]);
    Operaciones.push(['id_state_inv_detail', id_state_inv_detail? "" + id_state_inv_detail : null]);

    Operaciones.push(['id_product',  id_product? "" + id_product : null]);
    Operaciones.push(['id_category', id_category? "" + id_category: null]);
    Operaciones.push(['stock', stock? "" + stock : null]);
    Operaciones.push(['stock_min', stock_min? "" + stock_min : null]);
    Operaciones.push(['img_url', img_url? "" + img_url: null]);
    Operaciones.push(['id_tax',  id_tax? "" + id_tax: null]);
    Operaciones.push(['id_common_product', id_common_product? "" + id_common_product: null]);
    Operaciones.push(['name_product', name_product? "" + name_product: null]);
    Operaciones.push(['description_product', description_product? "" + description_product: null]);
    Operaciones.push(['id_state_product', id_state_product? "" + id_state_product : null]);
    Operaciones.push(['state_product', state_product? "" + state_product : null]);

    Operaciones.push(['id_product_third', id_product_third ? "" + id_product_third : null]);

    Operaciones.push(['id_third', id_third ? "" + id_third : null]);
    Operaciones.push(['id_category_third', id_category_third ? "" + id_category_third : null]);
    Operaciones.push(['location', location ? "" + location : null]);
    Operaciones.push(['id_state_prod_third', id_state_prod_third ? "" + id_state_prod_third : null]);
    Operaciones.push(['state_prod_third', state_prod_third ? "" + state_prod_third : null]);

    Operaciones.push(['id_measure_unit', id_measure_unit ? "" + id_measure_unit : null]);
    Operaciones.push(['id_measure_unit_father', id_measure_unit_father ? "" + id_measure_unit_father : null]);
    Operaciones.push(['id_common_measure_unit', id_common_measure_unit ? "" + id_common_measure_unit : null]);
    Operaciones.push(['name_measure_unit', name_measure_unit ? "" + name_measure_unit : null]);
    Operaciones.push(['description_measure_unit', description_measure_unit ? "" + description_measure_unit : null]);
    Operaciones.push(['id_state_measure_unit', id_state_measure_unit ? "" + id_state_measure_unit : null]);
    Operaciones.push(['state_measure_unit', state_measure_unit ? "" + state_measure_unit : null]);

    Operaciones.push(['id_code', id_code ? "" + id_code : null]);
    Operaciones.push(['code', code ? "" + code : null]);
    Operaciones.push(['id_attribute_list', id_attribute_list ? "" + id_attribute_list : null]);

    Operaciones.push(['id_state_cod', id_state_cod ? "" + id_state_cod : null]);
    Operaciones.push(['state_cod', state_cod ? "" + state_cod : null]);




    for(let n = 0;n<Operaciones.length;n++){ if(Operaciones[n][1] != null){ params = params.append(Operaciones[n][0],  Operaciones[n][1]); } }
    this.options.params = params;
    let promesa = new Promise((resolve, reject) => {
      this.http.get<InventoryDetail[]>(this.api_uri_inv_det, this.options)
        .subscribe(value => {resolve(value)},error => {this.handleError(error);reject(error)});
    });
    return from(promesa);
  };
  public postInventoryDetail = (id_inventory:number,body: InventoryDetailDTO[]): Observable<Boolean | any> => {

    let params = new HttpParams();
    let Operaciones = [];

    if((id_inventory ? "" + id_inventory : null) != null){
      params = params.append('id_inventory',  id_inventory ? "" + id_inventory : null);
    }
    this.options.params = params;

    let promesa = new Promise((resolve, reject) => {
      this.http.post(this.api_uri_inv_det, body, this.options)
        .subscribe(value => {resolve(true)},error => {this.handleError(error);reject(false)});
    });
    return from(promesa);
  };

  public postInventoriesDetailListFilters = (CURRENT_ID_THIRD_PATHER,ID_INVENTORY,body: FilterInventory): Observable<InventoryDetail[] | any> => {

    let params = new HttpParams();
    let Operaciones = [];
    if((ID_INVENTORY ? "" + ID_INVENTORY : null) != null){
      params = params.append('id_inventory',  ID_INVENTORY ? "" + ID_INVENTORY : null);
    }
    if((CURRENT_ID_THIRD_PATHER ? "" + CURRENT_ID_THIRD_PATHER : null) != null){
      params = params.append('id_third', CURRENT_ID_THIRD_PATHER ? "" + CURRENT_ID_THIRD_PATHER : null);
    }
    this.options.params = params;

    let InvDetTemp:InventoryDetail[];

    let promesa = new Promise((resolve, reject) => {
      this.http.post<InventoryDetail[]>(this.api_uri_inv+"/filters", body, this.options)
        .subscribe(value => {resolve(value)},error => {this.handleError(error);reject(error)});
    });
    return from(promesa);
  };





  public putInventoryDetail = (id_inventory: number, body: InventoryDTO[]): Observable<Boolean | any> => {

    let promesa = new Promise((resolve, reject) => {
      this.http.put(this.api_uri_inv_det + "/" + id_inventory, body, { headers: this.headers })
        .subscribe(value => {resolve(true)},error => {this.handleError(error);reject(false)});
    });
    return from(promesa);
  };

  public deleteInventoryDetail = (id_inventory_detail?: number, id_inventory?: number): Observable<Response | any> => {
    let params = new HttpParams();
    if((id_inventory ? "" + id_inventory : null) != null){
      params = params.append('id_inventory',  id_inventory ? "" + id_inventory : null);
    }
    this.options.params = params;

    let promesa = new Promise((resolve, reject) => {
      this.http.delete(this.api_uri_inv_det + '/' + id_inventory_detail, this.options)
        .subscribe(value => {resolve(true)},error => {this.handleError(error);reject(false)});
    });
    return from(promesa);
  };

  public putPlusInventory = (id_inventory: number, body: InventoryQuantityDTO[]): Observable<Boolean | any> => {

    let promesa = new Promise((resolve, reject) => {
      this.http.put(this.api_uri_inv + "/plus/" + id_inventory, body, { headers: this.headers })
        .subscribe(value => {resolve(true)},error => {this.handleError(error);reject(false)});
    });
    return from(promesa);
  };

  public putQuantity = (id_Store: number, quantity: number, code: string ,body: InventoryQuantityDTO[], disc, id_storage): Observable<Boolean | any> => {
    //CPrint("this is disc", disc)
    if(disc == 1){
      let promesa = new Promise((resolve, reject) => {
        let params = new HttpParams();
        params = params.append('quantity', quantity+"");
        params = params.append('id_store', id_Store+"");
        params = params.append('code', code+"");
        CPrint("putQuantity body es "+body);
        this.http.put(Urlbase.facturacion + "/billing-state/quantity", body, {
          params:params,
          responseType: 'text'
        })
          .subscribe(value => {resolve(true)},error => {this.handleError(error);reject(false)});
      });
      return from(promesa);
    }else{
      let promesa = new Promise((resolve, reject) => {
        let params = new HttpParams();
        params = params.append('quantity', quantity+"");
        params = params.append('id_store', id_Store+"");
        params = params.append('code', code+"");
        params = params.append('id_storage', id_storage+"");
        this.http.put(Urlbase.facturacion + "/billing-state/quantity", body, {
          params:params,
          responseType: 'text'
        })
          .subscribe(value => {resolve(true)},error => {this.handleError(error);reject(false)});
      });
      return from(promesa);
    }
  };

  public putDiscountInventory = (id_inventory: number, body: InventoryQuantityDTO[]): Observable<Boolean | any> => {

    let promesa = new Promise((resolve, reject) => {
      this.http.put(this.api_uri_inv + "/discount/" + id_inventory, body, { headers: this.headers })
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
