import {CommonStateStoreDTO} from '../../commons/CommonStateStoreDTO';
import {AttributeDetailListDTO} from './attributeDetailListDTO';


export class AttributeListDTO{
    details:AttributeDetailListDTO[];
    state:CommonStateStoreDTO;

    constructor(state?:CommonStateStoreDTO,
                details?:AttributeDetailListDTO[]){/**
        *
        */}


}
