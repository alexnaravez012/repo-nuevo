import {CommonThird} from '../../tienda724/dashboard/business/commons/CommonThird';

export class Phone {

    id_phone:number;
    id_directory:number;
    phone:string;
    priority:number;
    state:CommonThird;

    constructor(
        id_phone:number,
        id_directory:number,
        phone:string,
        priority:number,
        state:CommonThird

    ){}

}
