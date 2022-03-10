import {CommonStateDTO} from '../../commons/commonStateDTO';
import {DetailPaymentBillIdDTO} from '../../payment-method/models/detailPaymentBillIdDTO';

import {DetailBillIdDTO} from './detailBillIdDTO';


export class BillDetailIDDTO{

     id_bill_father:number;
     id_third_employee:number;
     id_third:number;
     id_payment_state:number;
     id_bill_state:number;
     id_bill_type:number;
    purchase_date:Date;
    subtotal:number;
    tax:number;
    totalprice:number;
    discount:number;
    state:CommonStateDTO;

    // Attributes optionals
    payments:DetailPaymentBillIdDTO[];
    details:DetailBillIdDTO[];


    constructor(
        id_bill_father:number,
        id_third_employee:number,
        id_third:number,
        id_payment_state:number,
        id_bill_state:number,
        id_bill_type:number,
       purchase_date:Date,
       subtotal:number,
       tax:number,
       totalprice:number,
       discount:number,
       state:CommonStateDTO,

       // Attributes optionals
       payments:DetailPaymentBillIdDTO[],
       details:DetailBillIdDTO[],
    ){

    }
}
