import {Injectable} from '@angular/core';


import {from, Observable} from 'rxjs';
/** Files for  process  */
import {Urlbase} from '../shared/urls';
import {LocalStorage} from './localStorage';
import {DocumentType} from '../tienda724/dashboard/business/thirds724/document-type/models/document-type';
import {HttpClient, HttpHeaders} from '@angular/common/http';


@Injectable({
  providedIn:'root'
})
export class DocumentTypeService {

  documentType: DocumentType;
  api_uri = Urlbase.tercero + '/documents-types';
  private options;
  private headers = new HttpHeaders({ 'Content-Type': 'application/json' });

  constructor(private http: HttpClient, private locStorage: LocalStorage) {


    this.headers = new HttpHeaders({
      'Content-Type':  'application/json',
      'Authorization':  this.locStorage.getTokenValue(),
    });
    this.options = { headers: this.headers };
  }

  public getDocumentTypeList= (): Observable<{}|DocumentType[]> => {
    let promesa = new Promise((resolve, reject) => {
      this.http.get<DocumentType[]>(this.api_uri, this.options)
        .subscribe(value => {resolve(value)},error => {this.handleError(error);reject(error)});
    });
    return from(promesa);
   }


   private handleError (error: Response | any) {
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
