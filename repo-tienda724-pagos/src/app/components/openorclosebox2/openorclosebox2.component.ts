import {Component, OnInit, Inject} from '@angular/core';
import {MatDialogRef, MatDialog, MAT_DIALOG_DATA} from '@angular/material';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import { HttpClient } from '@angular/common/http';
import { Urlbase } from 'src/app/shared/urls';
import { LocalStorage } from 'src/app/services/localStorage';
import { DialogData } from 'src/app/tienda724/dashboard/business/billing724/billing/bill-main/pedidos-detail/pedidos-detail.component';

@Component({
  selector: 'app-openorclosebox2',
  templateUrl: './openorclosebox2.component.html',
  styleUrls: ['./openorclosebox2.component.css']
})
export class Openorclosebox2Component implements OnInit {

  constructor(public locStorage: LocalStorage,public dialogRef: MatDialogRef<Openorclosebox2Component>,public dialog: MatDialog
    ,@Inject(MAT_DIALOG_DATA) public data: any) { }

  cajeroInfo;
  ngOnInit() { 
  }

  close(resp){
    this.dialogRef.close(
      { resp: resp,
        open: true,
      }
    )

  }

  isMobile() {
    if (window.innerWidth > 991) {
      return false;
    }
    return true;
  };


  cancel() {

    this.dialogRef.close(
      { resp: false,
        logout:false,
        open: false,
        idcaja: -1
      }
    )
  }

}
