import {Component, Inject, OnInit} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
//import { HttpClient } from '@angular/common/http';
//import { Http, Headers, Response, URLSearchParams } from '@angular/http';
import {LocalStorage} from '../../../../../../../services/localStorage';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Urlbase} from '../../../../../../../shared/urls';

@Component({
  selector: 'app-new-product-store',
  templateUrl: './new-product-store.component.html',
  styleUrls: ['./new-product-store.component.scss']
})
export class NewProductStoreComponent implements OnInit {
  codeList;



  productName: String;
  muName: String;
  brandName: String;
  body;
  priceName = "";
  price = "";
  options;
  headers = new HttpHeaders({ 'Content-Type': 'application/json' });
  id_ps;



  constructor(public dialogRef: MatDialogRef<NewProductStoreComponent>,public dialog: MatDialog
    ,@Inject(MAT_DIALOG_DATA) public data: DialogData,  public locStorage: LocalStorage, private http2: HttpClient,
    private http: HttpClient) {
    let token = localStorage.getItem('currentUser');

    this.options = { headers: this.headers };
  }

  ngOnInit() {
    this.codeList = this.data.codeList;
    this.http2.get(Urlbase.tienda + "/products2/code/byid?id_code="+this.data.codeList).subscribe(data => {
      let body = {
        id_store: this.locStorage.getIdStore(),
        id_code: this.data.codeList,
        product_store_name: data[0].product_name + " / " + data[0].munName + " / " +data[0].brandName,
        product_store_code: "",
        standard_price: 0,
        ownbarcode: data[0].code
      };
      this.body = body;
    });
  }

 returnData(){
  this.dialogRef.close();
  CPrint("THIS IS BODY: ", this.body);
  this.http.post(Urlbase.tienda + "/store/ps",this.body,{headers:this.headers} ).subscribe(res => {
    CPrint("THIS IS BODY: ", this.body);
    CPrint(res);
    let params = new HttpParams();
    if ((res) != null) {
      params = params.append('id_product_store', res+"");
    }
    if ((this.priceName) != null) {
      params = params.append('price_description', this.priceName);
    }
    if ((this.price) != null) {
      params = params.append('price', this.price);
    }
    this.http.post(Urlbase.tienda + "/store/pricelist",null, {headers:this.headers,params:params}).subscribe(resp => {
      CPrint(resp);

  })

  })

 }


}

export interface DialogData {
  codeList: number
}
