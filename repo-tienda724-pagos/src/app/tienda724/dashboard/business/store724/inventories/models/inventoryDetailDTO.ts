import {CommonStateStoreDTO} from '../../commons/CommonStateStoreDTO';

export class InventoryDetailDTO{
      id_inventory_detail:number;
      id_product_third:number;
      quantity:number;
      code:string;
      state:CommonStateStoreDTO;

    constructor(id_inventory_detail:number,
        id_product_third:number,
        quantity:number,
        code:string,
        state:CommonStateStoreDTO){

    }
}
