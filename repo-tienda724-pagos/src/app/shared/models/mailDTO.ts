import {CommonThirdDTO} from '../../tienda724/dashboard/business/commons/CommonThirdDTO';

export class MailDTO {

    mail:string;
    priority:number;
    state:CommonThirdDTO;

    constructor(mail:string,
        priority:number,
        state:CommonThirdDTO

    ){}

}
