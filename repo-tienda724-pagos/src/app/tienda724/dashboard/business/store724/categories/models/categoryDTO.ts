import {CommonStateStoreDTO} from '../../commons/CommonStateStoreDTO';
import {CommonStoreDTO} from '../../commons/CommonStoreDTO';

export class CategoryDTO {


    img_url: string;
    id_category_father: number;
    id_third_category:number;
    common:CommonStoreDTO;
    state:CommonStateStoreDTO;

    constructor( img_url: string,
        id_category_father: number,
        id_third_category:number,
        common:CommonStoreDTO,
        state:CommonStateStoreDTO) { }

}
