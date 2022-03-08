import {Injectable} from '@angular/core';

import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import {from, Observable} from 'rxjs';
/** Files for auth process  */
import {Urlbase} from '../shared/urls';
import {LocalStorage} from './localStorage';
import {Attribute} from '../tienda724/dashboard/business/store724/attributes/models/attribute';
import {AttributeComplete} from '../tienda724/dashboard/business/store724/attributes/models/attributeComplete';

import {AttributeDTO} from '../tienda724/dashboard/business/store724/attributes/models/attributeDTO';

import {AttributeList} from '../tienda724/dashboard/business/store724/attributes/models/attributeList';
import {AttributeListDTO} from '../tienda724/dashboard/business/store724/attributes/models/attributeListDTO';

import {AttributeDetailList} from '../tienda724/dashboard/business/store724/attributes/models/attributeDetailList';
import {AttributeDetailListDTO} from '../tienda724/dashboard/business/store724/attributes/models/attributeDetailListDTO';

import {AttributeValue} from '../tienda724/dashboard/business/store724/attributes/models/attributeValue';
import {AttributeValueDTO} from '../tienda724/dashboard/business/store724/attributes/models/attributeValueDTO';

@Injectable({
  providedIn:'root'
})
export class AttributeService {

  api_att = Urlbase.tienda + '/attributes';
  api_att_list = this.api_att + '/list';
  api_att_list_det = this.api_att_list + '/deatils';
  api_att_value = this.api_att + '/values';
  private options;
  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  constructor(private http: HttpClient, private locStorage: LocalStorage) {


    this.headers = new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization':  this.locStorage.getTokenValue(),
    });

    let token = localStorage.getItem('currentUser');

    this.options = {
      headers: this.headers
    };
  }
  public getAttribute = (state ? : number, id_attribute ? : number, id_common ? : number,
                         name ? : string, description ? : string, id_state ? : number): Observable < {} | Attribute[] > => {

    let params = new HttpParams();
    let Operaciones = [];

    Operaciones.push(['id_attribute', id_attribute ? "" + id_attribute : null]);
    Operaciones.push(['id_common', id_common ? "" + id_common : null]);
    Operaciones.push(['name', name ? "" + name : null]);
    Operaciones.push(['description', description ? "" + description : null]);
    Operaciones.push(['id_state', id_state ? "" + id_state : null]);
    Operaciones.push(['state', state ? "" + state : null]);

    for (let n = 0; n < Operaciones.length; n++) {
      if (Operaciones[n][1] != null) {
        params = params.append(Operaciones[n][0], Operaciones[n][1]);
      }
    }
    this.options.params = params;
    let promesa = new Promise((resolve, reject) => {
      this.http.get < Attribute[] > (this.api_att, this.options)
        .subscribe(value => {
          resolve(value)
        }, error => {
          this.handleError(error);
          reject(error)
        });
    });
    return from(promesa);
  };

  public getAttributeComplete = (state ? : number, is_values ? : Boolean, id_attribute ? : number, id_common ? : number,
                                 name ? : string, description ? : string, id_state ? : number): Observable < {} | AttributeComplete[] > => {

    let params = new HttpParams();
    let Operaciones = [];

    Operaciones.push(['id_attribute', id_attribute ? "" + id_attribute : null]);
    Operaciones.push(['id_common', id_common ? "" + id_common : null]);
    Operaciones.push(['name', name ? "" + name : null]);
    Operaciones.push(['description', description ? "" + description : null]);
    Operaciones.push(['id_state', id_state ? "" + id_state : null]);
    Operaciones.push(['state', state ? "" + state : null]);
    Operaciones.push(['is_values', is_values ? "" + is_values : null]);

    for (let n = 0; n < Operaciones.length; n++) {
      if (Operaciones[n][1] != null) {
        params = params.append(Operaciones[n][0], Operaciones[n][1]);
      }
    }
    this.options.params = params;
    let promesa = new Promise((resolve, reject) => {
      this.http.get < AttributeComplete[] > (this.api_att, this.options)
        .subscribe(value => {
          resolve(value)
        }, error => {
          this.handleError(error);
          reject(error)
        });
    });
    return from(promesa);
  };

  public DeleteAttribute = (id_category: number): Observable < Response | any > => {
    let promesa = new Promise((resolve, reject) => {
      this.http.delete(this.api_att + '/' + id_category, this.options)
        .subscribe(value => {resolve(true)},error => {this.handleError(error);reject(false)});
    });
    return from(promesa);
  };

  public postAttribute = (body: AttributeDTO): Observable < Number | any > => {
    let promesa = new Promise((resolve, reject) => {
      this.http.post(this.api_att, body, {
        headers: this.headers
      })
        .subscribe(value => {resolve(value)},error => {this.handleError(error);reject(error)});
    });
    return from(promesa);
  };


  public getAttributeDetailList = (id_attribute_detail_list ? : number, id_attribute_list ? : number,
                                   id_state_attrib_detail_list ? : number, state_attrib_detail_list ? : number, id_attribute_value ? : number,
                                   id_attribute ? : number, id_common_attrib_value ? : number, name_attrib_value ? : string,
                                   description_attrib_value ? : string, id_state_attrib_value ? : number, state_attrib_value ? : number): Observable < {} | AttributeDetailList[] > => {

    let params = new HttpParams();
    let Operaciones = [];

    Operaciones.push(['id_attribute_detail_list', id_attribute_detail_list ? "" + id_attribute_detail_list : null]);
    Operaciones.push(['id_attribute_list', id_attribute_list ? "" + id_attribute_list : null]);
    Operaciones.push(['id_state_attrib_detail_list', id_state_attrib_detail_list ? "" + id_state_attrib_detail_list : null]);
    Operaciones.push(['state_attrib_detail_list', state_attrib_detail_list ? "" + state_attrib_detail_list : null]);
    Operaciones.push(['id_attribute_value', id_attribute_value ? "" + id_attribute_value : null]);
    Operaciones.push(['id_attribute', id_attribute ? "" + id_attribute : null]);
    Operaciones.push(['id_common_attrib_value', id_common_attrib_value ? "" + id_common_attrib_value : null]);
    Operaciones.push(['name_attrib_value', name_attrib_value ? "" + name_attrib_value : null]);
    Operaciones.push(['description_attrib_value', description_attrib_value ? "" + description_attrib_value : null]);
    Operaciones.push(['id_state_attrib_value', id_state_attrib_value ? "" + id_state_attrib_value : null]);
    Operaciones.push(['state_attrib_value', state_attrib_value ? "" + state_attrib_value : null]);


    for (let n = 0; n < Operaciones.length; n++) {
      if (Operaciones[n][1] != null) {
        params = params.append(Operaciones[n][0], Operaciones[n][1]);
      }
    }
    this.options.params = params;
    let promesa = new Promise((resolve, reject) => {
      this.http.get< AttributeDetailList[] >(this.api_att_list_det, this.options)
        .subscribe(value => {resolve(value)},error => {this.handleError(error);reject(error)});
    });
    return from(promesa);
  };

  public DeleteAttributeDetailList = (id_category: number): Observable < Response | any > => {
    let promesa = new Promise((resolve, reject) => {
      this.http.delete(this.api_att_list_det + '/' + id_category, this.options)
        .subscribe(value => {resolve(true)},error => {this.handleError(error);reject(false)});
    });
    return from(promesa);
  };

  public postAttributeDetailList = (id_attribute_list: number, body: AttributeDetailListDTO[]): Observable < Boolean | any > => {
    let params = new HttpParams();
    let Operaciones = [];

    Operaciones.push(['id_attribute_list', id_attribute_list ? "" + id_attribute_list : null]);

    for (let n = 0; n < Operaciones.length; n++) {
      if (Operaciones[n][1] != null) {
        params = params.append(Operaciones[n][0], Operaciones[n][1]);
      }
    }
    this.options.params = params;
    let promesa = new Promise((resolve, reject) => {
      this.http.post(this.api_att_list_det, body, this.options)
        .subscribe(value => {resolve(true)},error => {this.handleError(error);reject(false)});
    });
    return from(promesa);
  };



  public getAttributeList = (state ? : number, id_category ? : number, id_common ? : number, id_category_father ? : number, img_url ? : string, name ? : string,
                             description ? : string, id_state ? : number, creation_attribute ? : Date, modify_attribute ? : Date): Observable < {} | AttributeList[] > => {

    //CPrint("id_category")
    let params = new HttpParams();
    let Operaciones = [];

    Operaciones.push(['id_category', id_category ? "" + id_category : null]);
    Operaciones.push(['id_common', id_common ? "" + id_common : null]);
    Operaciones.push(['id_category_father', id_category_father ? "" + id_category_father : null]);
    Operaciones.push(['img_url', img_url ? "" + img_url : null]);
    Operaciones.push(['name', name ? "" + name : null]);
    Operaciones.push(['description', description ? "" + description : null]);
    Operaciones.push(['id_state', id_state ? "" + id_state : null]);
    Operaciones.push(['state', state ? "" + state : null]);
    Operaciones.push(['creation_attribute', creation_attribute ? "" + creation_attribute : null]);
    Operaciones.push(['modify_attribute', modify_attribute ? "" + modify_attribute : null]);

    for (let n = 0; n < Operaciones.length; n++) {
      if (Operaciones[n][1] != null) {
        params = params.append(Operaciones[n][0], Operaciones[n][1]);
      }
    }
    this.options.params = params;
    let promesa = new Promise((resolve, reject) => {
      this.http.get< AttributeList[] >(this.api_att_list, this.options)
        .subscribe(value => {resolve(value)},error => {this.handleError(error);reject(error)});
    });
    return from(promesa);
  };

  public DeleteAttributeList = (id_category: number): Observable < Response | any > => {
    let promesa = new Promise((resolve, reject) => {
      this.http.delete(this.api_att_list + '/' + id_category, this.options)
        .subscribe(value => {resolve(true)},error => {this.handleError(error);reject(false)});
    });
    return from(promesa);
  };

  public postAttributeList = (body: AttributeListDTO): Observable < Number | any > => {
    let promesa = new Promise((resolve, reject) => {
      this.http.post(this.api_att_list, body, {
        headers: this.headers
      })
        .subscribe(value => {resolve(value)},error => {this.handleError(error);reject(null)});
    });
    return from(promesa);
  };


  public getAttributeValue = (state ? : number, id_attribute_value ? : number, id_attribute ? : number,
                              id_common ? : number, id_category_father ? : number, img_url ? : string, name ? : string,
                              description ? : string, id_state ? : number, creation_attribute ? : Date, modify_attribute ? : Date): Observable < {} | AttributeValue[] > => {

    //CPrint("id_category")
    let params = new HttpParams();
    let Operaciones = [];

    Operaciones.push(['id_attribute_value', id_attribute_value ? "" + id_attribute_value : null]);
    Operaciones.push(['id_attribute', id_attribute ? "" + id_attribute : null]);
    Operaciones.push(['id_category_father', id_category_father ? "" + id_category_father : null]);
    Operaciones.push(['img_url', img_url ? "" + img_url : null]);
    Operaciones.push(['name', name ? "" + name : null]);
    Operaciones.push(['description', description ? "" + description : null]);
    Operaciones.push(['id_state', id_state ? "" + id_state : null]);
    Operaciones.push(['state', state ? "" + state : null]);
    Operaciones.push(['creation_attribute', creation_attribute ? "" + creation_attribute : null]);
    Operaciones.push(['modify_attribute', modify_attribute ? "" + modify_attribute : null]);

    for (let n = 0; n < Operaciones.length; n++) {
      if (Operaciones[n][1] != null) {
        params = params.append(Operaciones[n][0], Operaciones[n][1]);
      }
    }
    this.options.params = params;
    let promesa = new Promise((resolve, reject) => {
      this.http.get< AttributeValue[] >(this.api_att_value, this.options)
        .subscribe(value => {resolve(value)},error => {this.handleError(error);reject(error)});
    });
    return from(promesa);
  };

  public DeleteAttributeValue = (id_category: number): Observable < Response | any > => {
    let promesa = new Promise((resolve, reject) => {
      this.http.delete(this.api_att_value + '/' + id_category, this.options)
        .subscribe(value => {resolve(true)},error => {this.handleError(error);reject(false)});
    });
    return from(promesa);
  };

  public postAttributeValue = (id_attribute: number, body: AttributeValueDTO[]): Observable < Boolean | any > => {
    let params = new HttpParams();
    let Operaciones = [];
    if ((id_attribute ? "" + id_attribute : null) != null) {
      params = params.append('id_attribute', id_attribute ? "" + id_attribute : null);
    }
    this.options.params = params;

    for (let n = 0; n < Operaciones.length; n++) {
      if (Operaciones[n][1] != null) {
        params = params.append(Operaciones[n][0], Operaciones[n][1]);
      }
    }
    this.options.params = params;
    let promesa = new Promise((resolve, reject) => {
      this.http.post(this.api_att_value, body, this.options)
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
    return null; //Observable.throw(errMsg);
  }

}
