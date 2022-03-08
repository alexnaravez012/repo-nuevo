import {Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges} from '@angular/core';
import {Router} from '@angular/router';
//import 'rxjs/add/observable/of';

import {FormBuilder} from '@angular/forms';


import {MatDialog} from '@angular/material';

import {BillDialogQuantityComponent} from '../bill-dialog-quantity/bill-dialog-quantity.component';
/*
*     Models of  your component
*/
import {InventoryDetail} from '../../../store724/inventories/models/inventoryDetail';
/*
*     services of  your component
*/
import {LocalStorage} from '../../../../../../services/localStorage';

import {InventoriesService} from '../../../../../../services/inventories.service';
import {BillingService} from '../../../../../../services/billing.service';
import {ThirdService} from '../../../../../../services/third.service';

@Component({
  selector: 'app-bill-detail',
  templateUrl: './bill-detail.component.html',
  styleUrls: ['./bill-detail.component.scss']
})
export class BillDetailComponent implements OnInit, OnChanges {
  // Attributes
  @Input()
  TOTAL_PRODUCTS = 123;
  @Input()
  TOTAL_PRICE = 0.00;
  /* flag */
  isDetail = true;
  isPrice = true;


  inventoryDetailForBilling: InventoryDetail[];
  newProductsForMovement: any[];

  // DTO's
  @Input()
  DETAILLIST: any[]

  @Input()
  TYPE_NAME: string;

  detailBillingDTOList: any[]

  @Output() detailEmitter = new EventEmitter<any[]>();

  constructor(public locStorage: LocalStorage, private fb: FormBuilder,
    public thirdService: ThirdService,

    private _router: Router, public billingService: BillingService,
    public inventoriesService: InventoriesService, public dialog: MatDialog) {
    this.newProductsForMovement = [];
    this.inventoryDetailForBilling = [];

  }

  ngOnInit() {

  }
  ngOnChanges(changes: SimpleChanges) {
    // changes.prop contains the old and the new value...
    if (this.TYPE_NAME != null && (this.TYPE_NAME.toLocaleLowerCase().includes("venta") || this.TYPE_NAME.toLocaleLowerCase().includes("compra"))) {


      this.isPrice = true;

    } else {

      this.isPrice = false;
    }

    if (this.DETAILLIST != null) {
      this.detailBillingDTOList = this.DETAILLIST
    }
  }

  sentNewChangeDetailBill() {
    this.detailEmitter.emit(this.DETAILLIST);
  }

  changeQuantity(element) {
    let oldQuantity = element.quantity;
    let inventoryDetail = null;
    let flag = true;

    let dialogRef = this.dialog.open(BillDialogQuantityComponent, {
      height: '450px',
      width: '600px',
      data: {
        quantityTemp: element, type_name: this.TYPE_NAME, is_exit: element.is_exit,
        currentList: this.inventoryDetailForBilling
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      //CPrint('The dialog was closed');
      if (result) {
        this.sentNewChangeDetailBill();
      }
    });

  }


}

