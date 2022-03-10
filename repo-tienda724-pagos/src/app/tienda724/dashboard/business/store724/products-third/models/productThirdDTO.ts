
import { CodeDTO } from '../../bar-codes/models/codeDTO'
import { CommonStateStoreDTO } from '../../commons/CommonStateStoreDTO'

export class ProductThirdDTO{

    id_third:number;
    min_price:number;
    standard_price:number;
    id_product:number;
    id_measure_unit:number;
    state:CommonStateStoreDTO;    
    id_attribute_list:number;
    id_category_third:number;
    location:string;
    codeDTO:CodeDTO;

    constructor(id_third:number,
        min_price:number,
        standard_price:number,
        id_product:number,
        id_measure_unit:number,
        state:CommonStateStoreDTO,    
        id_attribute_list:number,
        id_category_third:number,
        location:string,
        codeDTO:CodeDTO){/**
     * 
     */}
    

  
   

}