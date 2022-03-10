import {Component, Inject, OnInit} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
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


// import { CommonStateStoreDTO } from '../../commons/CommonStateStoreDTO'
// import { CommonStoreDTO } from '../../commons/CommonStoreDTO'

declare var $: any

@Component({
  selector: 'app-dialog-quantity-bill',
  templateUrl: './dialog-quantity-bill.component.html',
  styleUrls: ['./dialog-quantity-bill.component.scss']
})
export class DialogQuantityBillComponent implements OnInit {

  form_qu: FormGroup;
  isValue = false;
  isExit: Boolean
  currentsDetails:any[];

  inventoryDetailDTO: InventoryDetailDTO;
  inventoryQuantityDTO: InventoryQuantityDTO;
  inventoryQuantityDTOList: InventoryQuantityDTO[];
  // commonStateStoreDTO:CommonStateStoreDTO;
  // common:CommonStoreDTO;

  inventoryDetailData: InventoryDetail;


  isAddOnlyInventory: InventoryDetail;

  constructor(public dialogRef: MatDialogRef<DialogQuantityBillComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
    public inventoriesService: InventoriesService) {

    this.data;
    this.inventoryDetailData = this.data.quantityTemp;
    CPrint("DATA -> ", this.data.quantityTemp)
    this.isExit = this.data.isExit
    this.inventoryQuantityDTO = new InventoryQuantityDTO(null, null, null, null, null);
    this.inventoryQuantityDTOList = []
    this.createQuantityControls();
    this.changeField();
    this.currentsDetails=data.currentList;
  }




  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.form_qu.patchValue({
      quantity: 0
    });
    this.total = this.inventoryDetailData.detail.quantity;
  }

  total = 0;

  changeField() {
    const field = this.form_qu.get('quantity');

    field.valueChanges.forEach((value: string) => {

      if (this.isExit) {
        this.total = this.inventoryDetailData.detail.quantity - (+field['_value']);

      } else {
        this.total = this.inventoryDetailData.detail.quantity + (+field['_value']);

      }
    });
  }

  save() {

    CPrint("DTO QUANTITY0 " + this.inventoryQuantityDTO);


    this.inventoryQuantityDTO.id_inventory_detail = this.inventoryDetailData.detail.id_inventory_detail;
    this.inventoryQuantityDTO.id_product_third = this.inventoryDetailData.detail.id_product_third;
    if (this.form_qu.value['quantity'] !== null) {
      if (this.isExit) {
        if(this.form_qu.value['quantity'] <= this.inventoryDetailData.detail.quantity){
          if ((this.inventoryDetailData.detail.quantity - this.form_qu.value['quantity']) >= 0) {
            this.inventoryDetailData.detail.quantity = this.inventoryDetailData.detail.quantity - this.form_qu.value['quantity'];
            this.dialogRef.close(this.inventoryDetailData);
          } else {
            if(localStorage.getItem("SesionExpirada") != "true"){ alert("La Salida es mayor a la existencia actual")}
          }
        }else{
          if(localStorage.getItem("SesionExpirada") != "true"){ alert("La Salida es mayor a la existencia actual")}
          this.dialogRef.close();
        }


      } else {
        this.inventoryDetailData.detail.quantity = +this.inventoryDetailData.detail.quantity + (+this.form_qu.value['quantity']);
        this.dialogRef.close(this.inventoryDetailData);

      }

    } else {
      this.dialogRef.close();
      return
    }
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

