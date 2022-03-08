import {CommonThird} from '../tienda724/dashboard/business/commons/CommonThird';

export  class UserThird{

    id_user_third:number;
    id_person:number;
    UUID:string;
    state:CommonThird;

    constructor(id_user_third:number,
        id_person:number,
        UUID:string,
        state:CommonThird){}
}
