import {CommonStore} from '../../commons/CommonStore';
import {CommonStateStore} from '../../commons/CommonStateStore';

export class Category {

    id_category: number;
    common: CommonStore;
    id_category_father: number;
    img_url: string;
    commonState: CommonStateStore;

    constructor(
        id_category?: number,
        common?: CommonStore,
        id_category_father?: number,
        img_url?: string,
        commonState?: CommonStateStore

    ) { }

}
