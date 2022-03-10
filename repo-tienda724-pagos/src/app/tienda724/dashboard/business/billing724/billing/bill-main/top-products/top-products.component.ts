import {Component, OnInit} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
//import { HttpClient } from '@angular/common/http';
import {MatDialog, MatDialogRef} from '@angular/material';
import {LocalStorage} from '../../../../../../../services/localStorage';
import {HttpClient} from '@angular/common/http';
import {Urlbase} from '../../../../../../../shared/urls';

@Component({
  selector: 'app-top-products',
  templateUrl: './top-products.component.html',
  styleUrls: ['./top-products.component.scss']
})
export class TopProductsComponent implements OnInit {

  constructor(private http2: HttpClient,
              public locStorage: LocalStorage,
              public dialogRef: MatDialogRef<TopProductsComponent>,
              public dialog: MatDialog) { }
  topProds = [];
  ngOnInit() {

    this.http2.get(Urlbase.facturacion + "/billing/top20?idstore="+this.locStorage.getIdStore()).subscribe(res=> {
    for(let i=0;i<20;i++){
      this.topProds.push(res[i]);
      CPrint(this.topProds)
    }


  })
  }
  setCode(code){
    this.locStorage.setCodigoBarras(code);
    this.dialogRef.close();
  }
  showProds(){
   CPrint(this.topProds)
  }

}
