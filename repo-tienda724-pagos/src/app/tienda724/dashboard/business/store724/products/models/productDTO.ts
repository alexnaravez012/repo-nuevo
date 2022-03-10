import {CommonStateStoreDTO} from '../../commons/CommonStateStoreDTO';
import {CommonStoreDTO} from '../../commons/CommonStoreDTO';

export class ProductDTO{

    id_category:number;
    id_tax:number;
    img_url:string;
    code:string;
    common:CommonStoreDTO;
    state:CommonStateStoreDTO;

    constructor(id_category:number,
        id_tax:number,
        img_url:string,
        code:string,
        common:CommonStoreDTO,
        state:CommonStateStoreDTO){/**
         *
         */}

}
