import {CommonStateDTO} from '../../commons/commonStateDTO';


export class DetailPaymentBillDTO{

    id_way_to_pay:number;
    id_payment_method:number;
    payment_value:number;
    aprobation_code:string;
    state:CommonStateDTO;

    constructor(id_way_to_pay:number,
        id_payment_method:number,
        payment_value:number,
        aprobation_code:string,
        state:CommonStateDTO){

    }
}
