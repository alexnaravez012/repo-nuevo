import {Component, OnInit} from '@angular/core';
//import 'rxjs/add/observable/of';


import {MatDialog} from '@angular/material';


import {BillDialogThirdComponent} from '../bill-dialog-third/bill-dialog-third.component';


@Component({
  selector: 'app-bill-third',
  templateUrl: './bill-third.component.html',
  styleUrls: ['./bill-third.component.scss']
})
export class BillThirdComponent implements OnInit {

  thirdSearched : any;


  constructor(public dialog: MatDialog) {
    this.thirdSearched = null;
  }

  ngOnInit() {
  }

  searchThird() {
    // let oldQuantity = element.quantity;
    // let inventoryDetail = null;
    // let flag = true;

    let dialogRef = this.dialog.open(BillDialogThirdComponent, {
      height: '450px',
      width: '600px',
      data: {
        // quantityTemp: element, type_name:this.TYPE_NAME, is_exit: element.is_exit,
        // currentList: this.inventoryDetailForBilling
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      //CPrint('The dialog was closed');
      if (result) {
        //this.sentNewChangeDetailBill();
        this.thirdSearched = result[0];
        //CPrint("result popup Docu Type ", this.thirdSearched)
      }
    });

  }


  }


