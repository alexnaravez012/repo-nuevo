import {CommonThird} from '../../tienda724/dashboard/business/commons/CommonThird';

export class Mail {

    id_mail:number;
    id_directory:number;
    mail:string;
    priority:number;
    state:CommonThird;

    constructor(
        id_mail:number,
        id_directory:number,
        mail:string,
        priority:number,
        state:CommonThird

    ){}

}
