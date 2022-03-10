import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
/*
*    Material modules for component
*/
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
/*
*     others component
*/
/*
*     models for  your component
*/
import {InventoryDetail} from '../../../store724/inventories/models/inventoryDetail';
import {InventoryDetailDTO} from '../../../store724/inventories/models/inventoryDetailDTO';
import {InventoryQuantityDTO} from '../../../store724/inventories/models/inventoryQuantityDTO';
import {InventoriesService} from '../../../../../../services/inventories.service';

// DTO's

declare var $: any

@Component({
  selector: 'app-bill-dialog-quantity',
  templateUrl: './bill-dialog-quantity.component.html',
  styleUrls: ['./bill-dialog-quantity.component.scss']
})

export class BillDialogQuantityComponent implements OnInit {

  form_qu: FormGroup;
  isValue = false;
  is_exit: number;
  type_name: string;



  currentsDetails: any[];

  inventoryDetailDTO: InventoryDetailDTO;
  inventoryQuantityDTO: InventoryQuantityDTO;
  inventoryQuantityDTOList: InventoryQuantityDTO[];
  // commonStateStoreDTO:CommonStateStoreDTO;
  // common:CommonStoreDTO;

  inventoryDetailData: any;


  isAddOnlyInventory: InventoryDetail;

  constructor(public dialogRef: MatDialogRef<BillDialogQuantityComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
    public inventoriesService: InventoriesService) {

    this.data;
    this.inventoryDetailData = this.data.quantityTemp;
    //CPrint("DATA -> ", this.data)
    this.is_exit = this.data.is_exit;
    this.type_name = this.data.type_name;
    this.inventoryQuantityDTO = new InventoryQuantityDTO(null, null, null, null,null);
    this.inventoryQuantityDTOList = [];
    this.createQuantityControls();
    this.changeField();
    this.currentsDetails = data.currentList;
  }


  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.form_qu.patchValue({
      quantity: this.inventoryDetailData.quantity
    });
    this.total = this.inventoryDetailData.OldQuantity;
  }

  total = 0;

  changeField() {
    const field = this.form_qu.get('quantity');

    field.valueChanges.forEach((value: string) => {

      if (this.is_exit) {
       // this.total = this.inventoryDetailData.quantity + (+value);


      } else {
        //this.total = this.inventoryDetailData.quantity - (+value);

      }
    });
  }

  save() {
    //CPrint("DTO QUANTITY0 " + this.inventoryQuantityDTO);
    this.inventoryDetailData.quantity = this.form_qu.value['quantity'];
    this.dialogRef.close(this.inventoryDetailData);
  }

  showNotification(from, align, id_type?, msn?) {
    const type = ['', 'info', 'success', 'warning', 'danger'];

    const color = Math.floor((Math.random() * 4) + 1);

    $.notify({
      icon: "notifications",
      message: msn ? msn : "<b>Noficación automatica </b>"

    }, {
        type: type[id_type ? id_type : 2],
        timer: 200,
        placement: {
          from: from,
          align: align
        }
      });
  }

  createQuantityControls() {
    this.form_qu = this.fb.group({
      quantity: [''
      ]
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

}


