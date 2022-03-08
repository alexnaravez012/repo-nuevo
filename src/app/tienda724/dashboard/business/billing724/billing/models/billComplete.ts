import {PaymentState} from '../../payment-state/models/paymentState';
import {BillState} from '../../bill-state/models/billState';
import {BillType} from '../../bill-type/models/billType';
import {Document} from '../../commons/document';

export class BillComplete{

    id_bill:number;
    id_bill_father:number;
    id_third_employee:number;
    id_third:number;
    consecutive:string;

    purchase_date:Date;
    subtotal:number;
    totalprice:number;
    tax:number;
    discount:number;

    payment_state:PaymentState;
    bill_state:BillState;
    bill_type:BillType;
    document:Document

    id_state_bill:number;
    state_bill:number;
    creation_bill:Date;
    update_bill:Date;


    constructor(id_bill:number,
        id_bill_father:number,
        id_third_employee:number,
        id_third:number,
        consecutive:string,

        purchase_date:Date,
        subtotal:number,
        totalprice:number,
        tax:number,
        discount:number,

        payment_state:PaymentState,
        bill_state:BillState,
        bill_type:BillType,
        document:Document,

        id_state_bill:number,
        state_bill:number,
        creation_bill:Date,
        update_bill:Date){/**
     *
     */

    }
}
