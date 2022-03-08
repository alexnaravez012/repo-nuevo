import {CommonStateDTO} from '../../commons/commonStateDTO';
import {DetailPaymentBillDTO} from '../../payment-method/models/detailPaymentBillDTO';

import {DetailBillDTO} from './detailBillDTO';

export class BillCompleteDTO{

    id_bill_father:number;
    id_third_employee:number;
    id_third:number;
    id_payment_state:number;
    id_bill_state:number;
    id_bill_type:number;


    consecutive:string;
     purchase_date:Date;
    subtotal:number;
    tax:number;
    totalprice:number;
    state= CommonStateDTO;


      // Attributes optionals
      detailPaymentBillDTO:DetailPaymentBillDTO;
      detailBillDTOS:DetailBillDTO[];


    constructor(
        id_bill_father:number,
        id_third_employee:number,
        id_third:number,
        id_payment_state:number,
        id_bill_state:number,
        id_bill_type:number,


        consecutive:string,
         purchase_date:Date,
        subtotal:number,
        tax:number,
        totalprice:number,
        state= CommonStateDTO,


          // Attributes optionals
          detailPaymentBillDTO:DetailPaymentBillDTO,
          detailBillDTOS:DetailBillDTO[]){/**
     *
     */

    }
}
