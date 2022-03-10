import {CommonStoreDTO} from '../../commons/CommonStoreDTO';
import {CommonStateStoreDTO} from '../../commons/CommonStateStoreDTO';
import {InventoryDetailDTO} from './inventoryDetailDTO';


export class InventoryDTO{
    id_third:number;
    common:CommonStoreDTO;
    state:CommonStateStoreDTO;
    details?:InventoryDetailDTO[];

    constructor(id_third:number,
        common:CommonStoreDTO,
        state:CommonStateStoreDTO,
        details?:InventoryDetailDTO[]){

    }


}
