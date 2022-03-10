import {Injectable} from '@angular/core';

import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
/** Files for auth process  */
import {Urlbase} from '../shared/urls';
import {LocalStorage} from './localStorage';
import {UserThird} from '../shared/userThird';
import {from, Observable} from 'rxjs';


@Injectable({
  providedIn:'root'
})
export class UserThirdService {
  third: UserThird;
  api_uri = Urlbase.tercero + '/users';
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

  public getUserThirdList = (userThirdQ:UserThird): Observable<{}|UserThird[]> => {
    let params = new HttpParams();
    if((userThirdQ.id_user_third?""+userThirdQ.id_user_third:null) != null){
      params = params.append('id_user_third',  userThirdQ.id_user_third?""+userThirdQ.id_user_third:null);
    }
    if((userThirdQ.UUID?""+userThirdQ.UUID:null) != null){
      params = params.append('uuid', userThirdQ.UUID?""+userThirdQ.UUID:null);
    }
    this.options.params = params;
    let promesa = new Promise((resolve, reject) => {
      this.http.get<UserThird[]>(this.api_uri, this.options).subscribe(value => {resolve(value)},error => {this.handleError(error);reject(error)});
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
    return Observable.throw(errMsg);
  }



}
