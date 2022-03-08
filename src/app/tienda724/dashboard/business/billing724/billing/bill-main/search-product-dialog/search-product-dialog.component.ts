import {Component, Inject} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
import {InventoryDetail} from '../../../../store724/inventories/models/inventoryDetail';
import {InventoriesService} from '../../../../../../../services/inventories.service';

@Component({
  selector: 'app-search-product-dialog',
  templateUrl: './search-product-dialog.component.html',
  styleUrls: ['./search-product-dialog.component.scss']
})
export class SearchProductDialogComponent {
  ID_INVENTORY_TEMP = 61;
  STATE = 1;
  inventoryList: InventoryDetail[];
  searchData;
  searchInput : string ="";
  ngOnInit(): void {
    //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
    //Add 'implements OnInit' to the class.
    this.getInventoryList(this.STATE, null, null, this.ID_INVENTORY_TEMP);

  }


  searchFilter(index : number){
    if(this.inventoryList){
      this.searchData = this.inventoryList.filter((item)=> {
        if (index == 1){
          return item.product.code.toLowerCase().includes(this.searchInput.toLowerCase())
        }
        if (index == 2){
          return item.product.name_product.toLowerCase().includes(this.searchInput.toLowerCase())
        }
        if (index == 3){
          return item.product.description_product.toLowerCase().includes(this.searchInput.toLowerCase())
        }
        if (index == 4){
          return item.product.description_product.toLowerCase().includes(this.searchInput.toLowerCase())
        }
        return item.product.code.toLowerCase().includes(this.searchInput.toLowerCase()) ||
               item.product.name_product.toLowerCase().includes(this.searchInput.toLowerCase()) ||
               item.product.description_product.toLowerCase().includes(this.searchInput.toLowerCase())
        }
      )
    }
  }


  constructor(public inventoriesService: InventoriesService,
    public dialogRef: MatDialogRef<SearchProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  onNoClick(): void {
    this.dialogRef.close();
  }


  getInventoryList(state_inv_detail?: number, state_product?: number, id_inventory_detail?: number,
    id_inventory?: number, id_product_third?: number, location?: number,
    id_third?: number, id_category_third?: number, quantity?: number, id_state_inv_detail?: number,
    id_product?: number, id_category?: number, stock?: number,
    stock_min?: number, img_url?: string, id_tax?: number,
    id_common_product?: number, name_product?: string,
    description_product?: string, id_state_product?: number,


    id_state_prod_third?: number, state_prod_third?: number,
    id_measure_unit?: number, id_measure_unit_father?: number,
    id_common_measure_unit?: number, name_measure_unit?: string,
    description_measure_unit?: string, id_state_measure_unit?: number,
    state_measure_unit?: number, id_code?: number,
    code?: number, img?: string,
    id_attribute_list?: number,
    id_state_cod?: number, state_cod?: number,
    attribute?: number,
    attribute_value?: number) {
    return new Promise((resolve,reject)=>{

      this.inventoriesService.getInventoriesDetailList(state_inv_detail, state_product, id_inventory_detail,

        id_inventory, quantity, id_state_inv_detail,
        id_product, id_category, stock,
        stock_min, img_url, id_tax,
        id_common_product, name_product,
        description_product, id_state_product,
        id_product_third, location,
        id_third, id_category_third,

        id_state_prod_third, state_prod_third,
        id_measure_unit, id_measure_unit_father,
        id_common_measure_unit, name_measure_unit,
        description_measure_unit, id_state_measure_unit,
        state_measure_unit, id_code,
        code, img,
        id_state_cod, state_cod)


        .subscribe((data: InventoryDetail[]) => {
            this.inventoryList = data;
            CPrint("here")
            CPrint(this.inventoryList)
            CPrint(data)
            resolve();
          },
          (error) =>{
            CPrint(error);
            reject();
          },
          () => {
            if (this.inventoryList.length > 0) {

            }
          });
    });
  }

}
export interface DialogData {
  animal: string;
  name: string;
}
