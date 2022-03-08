import {EventEmitter, Injectable} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import {from, Observable, Subscription} from 'rxjs';
/** Files for auth process  */
import {Urlbase} from '../shared/urls';
import {LocalStorage} from './localStorage';
/** Import Model Data */
import {Bill} from '../tienda724/dashboard/business/billing724/billing/models/bill';
import {BillComplete} from '../tienda724/dashboard/business/billing724/billing/models/billComplete';
/** Import Model Data Transfer Object */
import {BillDTO} from '../tienda724/dashboard/business/billing724/billing/models/billDTO';
import {BillDetailIDDTO} from '../tienda724/dashboard/business/billing724/billing/models/billDetailIdDTO';


@Injectable({
  providedIn:'root'
})
export class BillingService {

  api_uri_bill = Urlbase.facturacion + '/billing';
  api_uri_caja = Urlbase.cierreCaja + '/close';
  api_uri_caja_detail = Urlbase.cierreCaja + '/detail-close';
  api_uri_inv = Urlbase.tienda + "/categories2";
  //api_uri_inv = Urlbase.tienda + "" + "/categories2";
  api_uri_products = Urlbase.tienda + "/products2";
  api_uri_brand = Urlbase.tienda + "/mun";
  api_uri_store = Urlbase.tienda + "/store";

  invokeFirstComponentFunction = new EventEmitter();
  subsVar: Subscription;

  onClick() {
    this.invokeFirstComponentFunction.emit();
  }

  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient, private locStorage: LocalStorage) {
    this.headers = new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization':  this.locStorage.getTokenValue(),
    });
  }
  public getBillResource = (state_bill ? : number, id_bill ? : number, id_bill_father ? : number,
                            id_third_employee ? : number,
                            id_third ? : number,
                            id_payment_state ? : number,
                            id_bill_state ? : number,
                            id_bill_type ? : number,
                            consecutive ? : string,
                            purchase_date ? : Date,
                            subtotal ? : number,
                            tax ? : number,
                            discount ? : number,
                            totalprice ? : number,
                            id_state_bill ? : number,

                            creation_bill ? : Date,
                            update_bill ? : Date): Observable < {} | any[] > => {

    let params = new HttpParams();
    let Operaciones = [];

    Operaciones.push(['id_bill', id_bill ? "" + id_bill : null]);
    Operaciones.push(['id_bill_father', id_bill_father ? "" + id_bill_father : null]);
    Operaciones.push(['id_third_employee', id_third_employee ? "" + id_third_employee : null]);
    Operaciones.push(['id_third', id_third ? "" + id_third : null]);
    Operaciones.push(['id_payment_state', id_payment_state ? "" + id_payment_state : null]);
    Operaciones.push(['id_bill_state', id_bill_state ? "" + id_bill_state : null]);
    Operaciones.push(['id_bill_type', id_bill_type ? "" + id_bill_type : null]);
    Operaciones.push(['consecutive', consecutive ? "" + consecutive : null]);
    Operaciones.push(['purchase_date', purchase_date ? "" + purchase_date : null]);
    Operaciones.push(['subtotal', subtotal ? "" + subtotal : null]);
    Operaciones.push(['tax', tax ? "" + tax : null]);
    Operaciones.push(['discount', discount ? "" + discount : null]);
    Operaciones.push(['totalprice', totalprice ? "" + totalprice : null]);
    Operaciones.push(['id_state_bill', id_state_bill ? "" + id_state_bill : null]);
    Operaciones.push(['state_bill', state_bill ? "" + state_bill : null]);
    Operaciones.push(['creation_bill', creation_bill ? "" + creation_bill : null]);
    Operaciones.push(['update_bill', update_bill ? "" + update_bill : null]);


    for (let n = 0; n < Operaciones.length; n++) {
      if (Operaciones[n][1] != null) {
        params = params.append(Operaciones[n][0], Operaciones[n][1]);
      }
    }
    let promesa = new Promise((resolve, reject) => {
      this.http.get <any[]> (this.api_uri_bill + "/details", {headers: this.headers,params: params})
        .subscribe(value => {
          resolve(value)
        }, error => {
          BillingService.handleError(error);
          reject(error)
        });
    });
    return from(promesa);
  };

  public getBillDetailsResource = (state_bill ? : number, id_bill ? : number, id_bill_father ? : number,
                                   id_third_employee ? : number,
                                   id_third ? : number,
                                   id_payment_state ? : number,
                                   id_bill_state ? : number,
                                   id_bill_type ? : number,
                                   consecutive ? : string,
                                   purchase_date ? : Date,
                                   subtotal ? : number,
                                   tax ? : number,
                                   discount ? : number,
                                   totalprice ? : number,
                                   id_state_bill ? : number,

                                   creation_bill ? : Date,
                                   update_bill ? : Date): Observable < {} | Bill[] > => {

    let params = new HttpParams();
    let Operaciones = [];

    Operaciones.push(['id_bill', id_bill ? "" + id_bill : null]);
    Operaciones.push(['id_bill_father', id_bill_father ? "" + id_bill_father : null]);
    Operaciones.push(['id_third_employee', id_third_employee ? "" + id_third_employee : null]);
    Operaciones.push(['id_third', id_third ? "" + id_third : null]);
    Operaciones.push(['id_payment_state', id_payment_state ? "" + id_payment_state : null]);
    Operaciones.push(['id_bill_state', id_bill_state ? "" + id_bill_state : null]);
    Operaciones.push(['id_bill_type', id_bill_type ? "" + id_bill_type : null]);
    Operaciones.push(['consecutive', consecutive ? "" + consecutive : null]);
    Operaciones.push(['purchase_date', purchase_date ? "" + purchase_date : null]);
    Operaciones.push(['subtotal', subtotal ? "" + subtotal : null]);
    Operaciones.push(['tax', tax ? "" + tax : null]);
    Operaciones.push(['discount', discount ? "" + discount : null]);
    Operaciones.push(['totalprice', totalprice ? "" + totalprice : null]);
    Operaciones.push(['id_state_bill', id_state_bill ? "" + id_state_bill : null]);
    Operaciones.push(['state_bill', state_bill ? "" + state_bill : null]);
    Operaciones.push(['creation_bill', creation_bill ? "" + creation_bill : null]);
    Operaciones.push(['update_bill', update_bill ? "" + update_bill : null]);


    for (let n = 0; n < Operaciones.length; n++) {
      if (Operaciones[n][1] != null) {
        params = params.append(Operaciones[n][0], Operaciones[n][1]);
      }
    }
    let promesa = new Promise((resolve, reject) => {
      this.http.get < Bill[] > (this.api_uri_bill, {headers: this.headers,params: params})
        .subscribe(value => {
          resolve(value)
        }, error => {
          BillingService.handleError(error);
          reject(error)
        });
    });
    return from(promesa);
  };

  public getBillCompleteResource = (state_bill ? : number, id_bill ? : number, id_bill_father ? : number,
                                    id_third_employee ? : number,
                                    id_third ? : number,
                                    id_payment_state ? : number,
                                    id_bill_state ? : number,
                                    id_bill_type ? : number,
                                    consecutive ? : string,
                                    purchase_date ? : Date,
                                    subtotal ? : number,
                                    tax ? : number,
                                    discount ? : number,
                                    totalprice ? : number,
                                    id_state_bill ? : number,

                                    creation_bill ? : Date,
                                    update_bill ? : Date): Observable < {} | BillComplete[] > => {

    let params = new HttpParams();
    let Operaciones = [];

    Operaciones.push(['id_bill', id_bill ? "" + id_bill : null]);
    Operaciones.push(['id_bill_father', id_bill_father ? "" + id_bill_father : null]);
    Operaciones.push(['id_third_employee', id_third_employee ? "" + id_third_employee : null]);
    Operaciones.push(['id_third', id_third ? "" + id_third : null]);
    Operaciones.push(['id_payment_state', id_payment_state ? "" + id_payment_state : null]);
    Operaciones.push(['id_bill_state', id_bill_state ? "" + id_bill_state : null]);
    Operaciones.push(['id_bill_type', id_bill_type ? "" + id_bill_type : null]);
    Operaciones.push(['consecutive', consecutive ? "" + consecutive : null]);
    Operaciones.push(['purchase_date', purchase_date ? "" + purchase_date : null]);
    Operaciones.push(['subtotal', subtotal ? "" + subtotal : null]);
    Operaciones.push(['tax', tax ? "" + tax : null]);
    Operaciones.push(['discount', discount ? "" + discount : null]);
    Operaciones.push(['totalprice', totalprice ? "" + totalprice : null]);
    Operaciones.push(['id_state_bill', id_state_bill ? "" + id_state_bill : null]);
    Operaciones.push(['state_bill', state_bill ? "" + state_bill : null]);
    Operaciones.push(['creation_bill', creation_bill ? "" + creation_bill : null]);
    Operaciones.push(['update_bill', update_bill ? "" + update_bill : null]);


    for (let n = 0; n < Operaciones.length; n++) {
      if (Operaciones[n][1] != null) {
        params = params.append(Operaciones[n][0], Operaciones[n][1]);
      }
    }
    let promesa = new Promise((resolve, reject) => {
      this.http.get < BillComplete[] > (this.api_uri_bill + "/completes", {headers: this.headers,params: params})
        .subscribe(value => {
          resolve(value)
        }, error => {
          BillingService.handleError(error);
          reject(error)
        });
    });
    return from(promesa);
  };

  public getBillCompleteDeatilsResource = (state_bill ? : number, id_bill ? : number, id_bill_father ? : number,
                                           id_third_employee ? : number,
                                           id_third ? : number,
                                           id_payment_state ? : number,
                                           id_bill_state ? : number,
                                           id_bill_type ? : number,
                                           consecutive ? : string,
                                           purchase_date ? : Date,
                                           subtotal ? : number,
                                           tax ? : number,
                                           discount ? : number,
                                           totalprice ? : number,
                                           id_state_bill ? : number,

                                           creation_bill ? : Date,
                                           update_bill ? : Date): Observable < {} | any[] > => {

    let params = new HttpParams();
    let Operaciones = [];

    Operaciones.push(['id_bill', id_bill ? "" + id_bill : null]);
    Operaciones.push(['id_bill_father', id_bill_father ? "" + id_bill_father : null]);
    Operaciones.push(['id_third_employee', id_third_employee ? "" + id_third_employee : null]);
    Operaciones.push(['id_third', id_third ? "" + id_third : null]);
    Operaciones.push(['id_payment_state', id_payment_state ? "" + id_payment_state : null]);
    Operaciones.push(['id_bill_state', id_bill_state ? "" + id_bill_state : null]);
    Operaciones.push(['id_bill_type', id_bill_type ? "" + id_bill_type : null]);
    Operaciones.push(['consecutive', consecutive ? "" + consecutive : null]);
    Operaciones.push(['purchase_date', purchase_date ? "" + purchase_date : null]);
    Operaciones.push(['subtotal', subtotal ? "" + subtotal : null]);
    Operaciones.push(['tax', tax ? "" + tax : null]);
    Operaciones.push(['discount', discount ? "" + discount : null]);
    Operaciones.push(['totalprice', totalprice ? "" + totalprice : null]);
    Operaciones.push(['id_state_bill', id_state_bill ? "" + id_state_bill : null]);
    Operaciones.push(['state_bill', state_bill ? "" + state_bill : null]);
    Operaciones.push(['creation_bill', creation_bill ? "" + creation_bill : null]);
    Operaciones.push(['update_bill', update_bill ? "" + update_bill : null]);


    for (let n = 0; n < Operaciones.length; n++) {
      if (Operaciones[n][1] != null) {
        params = params.append(Operaciones[n][0], Operaciones[n][1]);
      }
    }
    let promesa = new Promise((resolve, reject) => {
      this.http.get<any[]>(this.api_uri_bill + "/completes/details", {headers: this.headers,params: params})
        .subscribe(value => {resolve(value)},error => {BillingService.handleError(error);reject(error)});
    });
    return from(promesa);
  };

  public getDetailsById = (id): Observable < any > => {
    let promesa = new Promise((resolve, reject) => {
      this.http.get(this.api_uri_caja_detail + "?id_cierre_caja=" + String(id), {headers: this.headers})
        .subscribe(value => {resolve(value)},error => {BillingService.handleError(error);reject(error)});
    });
    return from(promesa);
  };

  public postPaymentDetail = (body, id): Observable < number[] | any > => {
    //CPrint("---------------------------------------------------")
    //CPrint("this is the payment detail: ",JSON.stringify(body));
    //CPrint("---------------------------------------------------")

    let params = new HttpParams();
    if ((id) != null) {
      params = params.append('id_bill', id);
    }
    let promesa = new Promise((resolve, reject) => {
      this.http.post(Urlbase.facturacion + "/payments-details", body, {headers: this.headers,params: params})
        .subscribe(value => {resolve(value)},error => {BillingService.handleError(error);reject(null)});
    });
    return from(promesa);
  };



  public getDirectoryById = (id): Observable < number[] | any > => {
    let params = new HttpParams();
    if (id != null) {
      params = params.append('id_directory', id);
    }
    let promesa = new Promise((resolve, reject) => {
      this.http.get<any[]>(Urlbase.tercero + "/directories", {headers: this.headers,params: params})
        .subscribe(value => {resolve(value)},error => {BillingService.handleError(error);reject(error)});
    });
    return from(promesa);
  };



  public postBillResource = (body: BillDTO, disc): Observable < number[] | any > => {
    CPrint("this is my body: ", body);

    let params = new HttpParams();
    ///
    if(disc == 1){
      if(String(this.locStorage.getIdCaja()) != null){
        params = params.append('id_caja',  String(this.locStorage.getIdCaja()));
      }
    }
    //
    let promesa = new Promise((resolve, reject) => {
      this.http.post<any>(Urlbase.facturacion + "/billing", body, {headers: this.headers,params: params})
        .subscribe(value => {resolve(value)},error => {BillingService.handleError(error);reject(null)});
    });
    return from(promesa);
  };



  public putInventoryDetail = (id_bill: number, body: BillDetailIDDTO): Observable < number | any > => {

    let promesa = new Promise((resolve, reject) => {
      this.http.put<any>(this.api_uri_bill + "/" + id_bill, body, {
        headers: this.headers
      })
        .subscribe(value => {resolve(value)},error => {BillingService.handleError(error);reject(null)});
    });
    return from(promesa);
  };

  public deleteInventoryDetail = (id_bill ? : number, id_inventory ? : number): Observable < Response | any > => {
    let promesa = new Promise((resolve, reject) => {
      this.http.delete(this.api_uri_bill + '/' + id_bill, {headers: this.headers})
        .subscribe(value => {resolve(true)},error => {BillingService.handleError(error);reject(false)});
    });
    return from(promesa);
  };

  //----------------------------------------------------------------------------------------------
  //METODOS PARA CIERRE DE CAJA
  //----------------------------------------------------------------------------------------------

  public getCajaByIdStatus = (id): Observable < any > => {
    const state = 'O';
    let promesa = new Promise((resolve, reject) => {
      this.http.get(Urlbase.cierreCaja + "/close" + "/boxes?id_third_employee=" + id + "&status=" + state, {headers: this.headers})
        .subscribe(value => {resolve(value)},error => {BillingService.handleError(error);reject(error)});
    });
    return from(promesa);
  };

  public getCajaByIdStatus2 = (id): Observable < any > => {
    const state = 'O';
    //CPrint("idEMPLOYEE: ",id)
    let promesa = new Promise((resolve, reject) => {
      this.http.get(Urlbase.cierreCaja + "/close" + "/boxes2?id_third_employee=" + id + "&status=" + state, {headers: this.headers})
        .subscribe(value => {resolve(value)},error => {BillingService.handleError(error);reject(error)});
    });
    return from(promesa);
  };

  public postBox = (box): Observable < any > => {
    //CPrint("this is box: ",box)
    let promesa = new Promise((resolve, reject) => {
      this.http.post(this.api_uri_caja, box, {
        headers: this.headers
      }).subscribe(value => {resolve(value)},error => {BillingService.handleError(error);reject(error)});
    });
    return from(promesa);
  };

  public postBoxDetail = (boxDetail, id): Observable < any > => {
    let params = new HttpParams();
    if (id != null) {
      params = params.append('id_cierre_caja', id);
    }
    let promesa = new Promise((resolve, reject) => {
      this.http.post(this.api_uri_caja_detail, boxDetail, {headers: this.headers,params: params})
        .subscribe(value => {resolve(value)},error => {BillingService.handleError(error);reject(error)});
    });
    return from(promesa);
  };

  public closeBox = (id, body): Observable < any > => {
    let promesa = new Promise((resolve, reject) => {
      this.http.put(this.api_uri_caja + "/state/" + id, body, {headers: this.headers,responseType: 'text'})
        .subscribe(value => {resolve(value)},error => {BillingService.handleError(error);reject(error)});
    });
    return from(promesa);
  };

  public getSalesSum = (id_cierre_caja): Observable < any > => {
    let promesa = new Promise((resolve, reject) => {
      this.http.get(Urlbase.cierreCaja + "/close/ventasCaja?id_cierre_caja=" + String(id_cierre_caja), {
        headers: this.headers
      })
        .subscribe(value => {resolve(value)},error => {BillingService.handleError(error);reject(error)});
    });
    return from(promesa);
  };



  //----------------------------------------------------------------------------------------------
  //METODOS PARA MUN, BRAND, CATEGORIES AND PRODUCTS
  //----------------------------------------------------------------------------------------------


  public getGeneralCategories = (): Observable < any > => {
    const lista = this.locStorage.getTipo();

    const body = {
      'listaTipos': lista
    };
    //CPrint("asd",body)
    let promesa = new Promise((resolve, reject) => {
      this.http.post(this.api_uri_inv + "/get", body)
        .subscribe(value => {resolve(value)},error => {BillingService.handleError(error);reject(error)});
    });
    return from(promesa);
  };

  public getCategoryByThird = (id_third): Observable < any > => {
    let promesa = new Promise((resolve, reject) => {
      this.http.get(this.api_uri_inv + "/byThird?id_third=" + String(id_third), {headers: this.headers})
        .subscribe(value => {resolve(value)},error => {BillingService.handleError(error);reject(error)});
    });
    return from(promesa);
  };

  public getCategoryByThirdCategory = (id_third, category): Observable < any > => {
    let promesa = new Promise((resolve, reject) => {
      this.http.get(this.api_uri_inv + "/children/byThird?id_category_father=" + String(category) + "&id_third=" + String(id_third), {headers: this.headers})
        .subscribe(value => {resolve(value)},error => {BillingService.handleError(error);reject(error)});
    });
    return from(promesa);
  };

  public getCategoryByFather = (id_category): Observable < any > => {
    let promesa = new Promise((resolve, reject) => {
      this.http.get(this.api_uri_inv + "/children?id_category_father=" + String(id_category), {headers: this.headers})
        .subscribe(value => {resolve(value)},error => {BillingService.handleError(error);reject(error)});
    });
    return from(promesa);
  };

  public getProductsByCategory = (id_category): Observable < any > => {
    let promesa = new Promise((resolve, reject) => {
      this.http.get(this.api_uri_products + "?id_category=" + String(id_category), {headers: this.headers})
        .subscribe(value => {resolve(value)},error => {BillingService.handleError(error);reject(error)});
    });
    return from(promesa);
  };


  public getSubproductsByCategory = (id_product): Observable < any > => {
    let promesa = new Promise((resolve, reject) => {
      this.http.get(this.api_uri_products + "/code?id_product=" + String(id_product), {headers: this.headers})
        .subscribe(value => {resolve(value)},error => {BillingService.handleError(error);reject(error)});
    });
    return from(promesa);
  };

  public getGenericMeassureUnits = (): Observable < any > => {
    let promesa = new Promise((resolve, reject) => {
      this.http.get(this.api_uri_brand, {headers: this.headers})
        .subscribe(value => {resolve(value)},error => {BillingService.handleError(error);reject(error)});
    });
    return from(promesa);
  };

  public getMeassureUnitsByFather = (id_father): Observable < any > => {
    let promesa = new Promise((resolve, reject) => {
      this.http.get(this.api_uri_brand + "/bymu?id_measure_unit_father=" + String(id_father), {headers: this.headers})
        .subscribe(value => {resolve(value)},error => {BillingService.handleError(error);reject(error)});
    });
    return from(promesa);
  };

  public getMeassureByThird = (id_third): Observable < any > => {
    let promesa = new Promise((resolve, reject) => {
      this.http.get(this.api_uri_brand + "/bythird?id_third=" + String(id_third), {headers: this.headers})
        .subscribe(value => {resolve(value)},error => {BillingService.handleError(error);reject(error)});
    });
    return from(promesa);
  };

  public getMeassureByThirdAndFater = (id_third, id_father): Observable < any > => {
    let promesa = new Promise((resolve, reject) => {
      this.http.get(this.api_uri_brand + "/bythirdAndmu?id_measure_unit_father=" + String(id_father) + "&id_third" + String(id_third))
        .subscribe(value => {resolve(value)},error => {BillingService.handleError(error);reject(error)});
    });
    return from(promesa);
  };

  public getBrands = (): Observable < any > => {
    let promesa = new Promise((resolve, reject) => {
      this.http.get(this.api_uri_brand + "/brand")
        .subscribe(value => {resolve(value)},error => {BillingService.handleError(error);reject(error)});
    });
    return from(promesa);
  };

  public getBrandsByFather = (id_father): Observable < any > => {
    let promesa = new Promise((resolve, reject) => {
      this.http.get(this.api_uri_brand + "/brand/bybrand?id_brand_father=" + String(id_father), {headers: this.headers})
        .subscribe(value => {resolve(value)},error => {BillingService.handleError(error);reject(error)});
    });
    return from(promesa);
  };

  public getBrandByThirdAndFater = (id_third, id_father): Observable < any > => {
    let promesa = new Promise((resolve, reject) => {
      this.http.get(this.api_uri_brand + "/brand/bybrandbythird?id_brand_father=" + String(id_father) + "&id_third=" + String(id_third))
        .subscribe(value => {resolve(value)},error => {BillingService.handleError(error);reject(error)});
    });
    return from(promesa);
  };

  public getBrandByThird = (id_third): Observable < any > => {
    let promesa = new Promise((resolve, reject) => {
      this.http.get(this.api_uri_brand + "/brand/bythird?id_third=" + String(id_third), {headers: this.headers})
        .subscribe(value => {resolve(value)},error => {BillingService.handleError(error);reject(error)});
    });
    return from(promesa);
  };

  public postMeasureUnit = (body): Observable < any > => {
    let promesa = new Promise((resolve, reject) => {
      this.http.post(this.api_uri_brand, body, {
        headers: this.headers,
        responseType: 'text'
      })
        .subscribe(value => {resolve(value)},error => {BillingService.handleError(error);reject(error)});
    });
    return from(promesa);
  };

  public postBrand = (body): Observable < any > => {
    let promesa = new Promise((resolve, reject) => {
      this.http.post(this.api_uri_brand + "/brand", body, {
        headers: this.headers,
        responseType: 'text'
      })
        .subscribe(value => {resolve(value)},error => {BillingService.handleError(error);reject(error)});
    });
    return from(promesa);
  };

  public putBrand = (body, id_brand): Observable < any > => {
    let promesa = new Promise((resolve, reject) => {
      this.http.put(this.api_uri_brand + "/brand?id_brand=" + String(id_brand), body, {
        headers: this.headers,
        responseType: 'text'
      })
        .subscribe(value => {resolve(value)},error => {BillingService.handleError(error);reject(error)});
    });
    return from(promesa);
  };

  public putMeasureUnit = (body, id_measure): Observable < any > => {
    let promesa = new Promise((resolve, reject) => {
      this.http.put(this.api_uri_brand + "?id_measure_unit=" + String(id_measure), body, {
        headers: this.headers,
        responseType: 'text'
      })
        .subscribe(value => {resolve(value)},error => {BillingService.handleError(error);reject(error)});
    });
    return from(promesa);
  };

  public postCategory = (body): Observable < any > => {
    let promesa = new Promise((resolve, reject) => {
      this.http.post(Urlbase.tienda + "/categories2", body, {
        headers: this.headers,
        responseType: 'text'
      })
        .subscribe(value => {resolve(value)},error => {BillingService.handleError(error);reject(error)});
    });
    return from(promesa);
  };

  public putCategory = (body, id_category): Observable < any > => {
    let promesa = new Promise((resolve, reject) => {
      this.http.put(this.api_uri_inv + "?id_category=" + String(id_category), body, {
        headers: this.headers,
        responseType: 'text'
      })
        .subscribe(value => {resolve(value)},error => {BillingService.handleError(error);reject(error)});
    });
    return from(promesa);
  };

  public postProduct = (body): Observable < any > => {
    let promesa = new Promise((resolve, reject) => {
      this.http.post(this.api_uri_products, body, {
        headers: this.headers,
        responseType: 'text'
      })
        .subscribe(value => {
          resolve(value)
        }, error => {
          BillingService.handleError(error);
          reject(error)
        });
    });
    return from(promesa);
  };

  public putProduct = (body, id_product): Observable < any > => {
    let promesa = new Promise((resolve, reject) => {
      this.http.put(this.api_uri_products + "?id_product=" + String(id_product), body, {
        headers: this.headers,
        responseType: 'text'
      })
        .subscribe(value => {resolve(value)},error => {BillingService.handleError(error);reject(error)});
    });
    return from(promesa);
  };

  public postCode = (body): Observable < any > => {
    let promesa = new Promise((resolve, reject) => {
      this.http.post(this.api_uri_products + "/code", body, {
        headers: this.headers,
        responseType: 'text'
      })
        .subscribe(value => {resolve(value)},error => {BillingService.handleError(error);reject(error)});
    });
    return from(promesa);
  };

  public putCode = (body, id_code): Observable < any > => {
    let promesa = new Promise((resolve, reject) => {
      this.http.put(this.api_uri_products + "/code/update?id_code=" + String(id_code), body, {
        headers: this.headers,
        responseType: 'text'
      })
        .subscribe(value => {resolve(value)},error => {BillingService.handleError(error);reject(error)});
    });
    return from(promesa);
  };

  getStoresByThird = (id_third): Observable < any > => {
    let promesa = new Promise((resolve, reject) => {
      this.http.get(this.api_uri_store + "?id_third=" + String(id_third), {headers: this.headers})
        .subscribe(value => {resolve(value)},error => {BillingService.handleError(error);reject(error)});
    });
    return from(promesa);
  };

  getStoragesByStore = (id_store): Observable < any > => {
    let promesa = new Promise((resolve, reject) => {
      this.http.get(this.api_uri_store + "/s?id_store=" + String(id_store), {headers: this.headers})
        .subscribe(value => {resolve(value)},error => {BillingService.handleError(error);reject(error)});
    });
    return from(promesa);
  };

  getProductsByStorage = (id_storage): Observable < any > => {
    let promesa = new Promise((resolve, reject) => {
      this.http.get(Urlbase.tienda + "/products2" + "/productxstorage?id_storage=" + String(id_storage), {headers: this.headers})
        .subscribe(value => {resolve(value)},error => {BillingService.handleError(error);reject(error)});
    });
    return from(promesa);
  };

  getCategoriesByThird = (id_third): Observable < any > => {
    let promesa = new Promise((resolve, reject) => {
      this.http.get(Urlbase.tienda + "/store/s/categories?id_third=" + String(id_third), {headers: this.headers})
        .subscribe(value => {resolve(value)},error => {BillingService.handleError(error);reject(error)});
    });
    return from(promesa);
  };


  getBoxByStore = (id_store): Observable < any > => {
    let promesa = new Promise((resolve, reject) => {
      this.http.get(this.api_uri_store + "/b?id_store=" + String(id_store), {headers: this.headers})
        .subscribe(value => {resolve(value)},error => {BillingService.handleError(error);reject(error)});
    });
    return from(promesa);
  };

  postStore = (body): Observable < any > => {
    let promesa = new Promise((resolve, reject) => {
      this.http.post(this.api_uri_store, body, {
        headers: this.headers,
        responseType: 'text'
      })
        .subscribe(value => {resolve(value)},error => {BillingService.handleError(error);reject(error)});
    });
    return from(promesa);
  };

  putStore = (body, id_store): Observable < any > => {
    let promesa = new Promise((resolve, reject) => {
      this.http.put(this.api_uri_store + "?id_store=" + String(id_store), body, {
        headers: this.headers,
        responseType: 'text'
      })
        .subscribe(value => {resolve(value)},error => {BillingService.handleError(error);reject(error)});
    });
    return from(promesa);
  };

  postBoxStore = (body): Observable < any > => {
    let promesa = new Promise((resolve, reject) => {
      this.http.post(this.api_uri_store + "/b", body, {
        headers: this.headers,
        responseType: 'text'
      })
        .subscribe(value => {resolve(value)},error => {BillingService.handleError(error);reject(error)});
    });
    return from(promesa);
  };

  putBox = (body, id_caja): Observable < any > => {
    let promesa = new Promise((resolve, reject) => {
      this.http.put(this.api_uri_store + "/b?id_caja=" + String(id_caja), body, {
        headers: this.headers,
        responseType: 'text'
      })
        .subscribe(value => {resolve(value)},error => {BillingService.handleError(error);reject(error)});
    });
    return from(promesa);
  };

  postStorage = (body): Observable < any > => {
    let promesa = new Promise((resolve, reject) => {
      this.http.post(this.api_uri_store + "/s", body, {
        headers: this.headers,
        responseType: 'text'
      })
        .subscribe(value => {resolve(value)},error => {BillingService.handleError(error);reject(error)});
    });
    return from(promesa);
  };

  putStorage = (body, id_storage): Observable < any > => {
    let promesa = new Promise((resolve, reject) => {
      this.http.put(this.api_uri_store + "/s?id_store=" + id_storage, body, {
        headers: this.headers,
        responseType: 'text'
      })
        .subscribe(value => {resolve(value)},error => {BillingService.handleError(error);reject(error)});
    });
    return from(promesa);
  };

  getBoxDetail = (id_cierre_caja): Observable < any > => {
    let promesa = new Promise((resolve, reject) => {
      this.http.get(this.api_uri_caja + "/boxdetail?id_cierre_caja=" + String(id_cierre_caja), {headers: this.headers})
        .subscribe(value => {resolve(value)},error => {BillingService.handleError(error);reject(error)});
    });
    return from(promesa);
  };

  getBoxMaster = (id_cierre_caja): Observable < any > => {
    let promesa = new Promise((resolve, reject) => {
      this.http.get(this.api_uri_caja + "/boxmaster?id_cierre_caja=" + String(id_cierre_caja), {headers: this.headers})
        .subscribe(value => {CPrint("STUFF TO TEST,", value);resolve(value)},error => {BillingService.handleError(error);reject(error)});
    });
    return from(promesa);
  };


  getProductsByCategoryThird = (id_category, id_third): Observable < any > => {
    let promesa = new Promise((resolve, reject) => {
      console.log(Urlbase.tienda + "/categories2" + "/productsOnStore?id_third=" + String(id_third) + "&id_category=" + id_category + "&id_store=" + this.locStorage.getIdStore());
      this.http.get(Urlbase.tienda + "/categories2" + "/productsOnStore?id_third=" + String(id_third) + "&id_category=" + id_category + "&id_store=" + this.locStorage.getIdStore())
        .subscribe(value => {resolve(value)},error => {BillingService.handleError(error);reject(error)});
    });
    return from(promesa);
  };

  private static handleError(error: Response | any) {
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
    if(localStorage.getItem("SesionExpirada") != "true"){ ;}
    return null; //Observable.throw(errMsg);
  }
}
