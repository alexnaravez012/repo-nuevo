import {Component, Inject, OnInit} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
//import { HttpClient } from '@angular/common/http';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {LocalStorage} from '../../../../../../../services/localStorage';
import {HttpClient} from '@angular/common/http';
import {Urlbase} from '../../../../../../../shared/urls';

@Component({
  selector: 'app-create-price',
  templateUrl: './create-price.component.html',
  styleUrls: ['./create-price.component.scss']
})
export class CreatePriceComponent implements OnInit {

  psName;
  psOwn;


  priceName = "";
  price = "";
  ps = "";
  idps;
  ListPrice


  constructor(public locStorage: LocalStorage,public dialogRef: MatDialogRef<CreatePriceComponent>, private http2: HttpClient, @Inject(MAT_DIALOG_DATA) public data: DialogData) { }


  ngOnInit() {
    this.psName = this.data.psName;
    this.psOwn = this.data.psOwn;
    this.http2.get(Urlbase.tienda + "/store/psid?&code="+this.psOwn+"&id_store="+this.locStorage.getIdStore()).subscribe(response => {
      CPrint("this is the faqin response: ", response);
      this.idps = response;
    this.http2.get(Urlbase.tienda + "/resource/pricebyps?id_ps="+response).subscribe(resp => {
      this.ListPrice = resp
    })
  })
  }



  postPrice() {
    this.http2.get(Urlbase.tienda + "/store/psid?name="+this.psName+"&code="+this.psOwn+"&id_store="+this.locStorage.getIdStore()).subscribe((resp:any) => {
      //@ts-ignore
      this.http2.post(Urlbase.tienda + "/store/pricelist",null, {params:{
      "id_product_store":resp,
      "price_description":this.priceName,
      "price":this.price
    }}).subscribe(resp => {
      this.http2.get(Urlbase.tienda + "/resource/pricebyps?id_ps="+this.idps).subscribe(resp => {
      this.ListPrice = resp
    })
  }, error => {
    this.http2.get(Urlbase.tienda + "/resource/pricebyps?id_ps="+this.idps).subscribe(resp => {
      this.ListPrice = resp
    })
    })
  })
  }


  deletePrice(price){
    this.http2.delete(Urlbase.tienda + "/price-list/delete?idps="+this.idps+"&price="+price).subscribe(resp => {
      this.http2.get(Urlbase.tienda + "/resource/pricebyps?id_ps="+this.idps).subscribe(resp => {
        this.ListPrice = resp
      })
    })

  }

}


export interface DialogData {
  psName: any;
  psOwn: any;
}
