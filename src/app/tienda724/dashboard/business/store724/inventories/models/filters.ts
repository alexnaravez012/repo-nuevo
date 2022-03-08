import {AttributeValue} from '../../attributes/models/attributeValue';

export class FilterInventory{
        //card 1
        name_th?:string;
        id_document_type_th?:number;
        number_document_type_th?:string;
        // card 2
        name_th_venue?:string;
        id_document_type_th_venue?:number;

        number_document_type_th_venue?:string;
        id_venue?:number;
        // card 3
        id_productor?:number;
        id_cat_productor?:number;

         // card 4
         id_category_th?:number;

          // card 5
        id_measure_unit?:number;

         // card 6
         attributeValues:AttributeValue[]

         constructor(name_th?:string,
            id_document_type_th?:number,
            number_document_type_th?:string,
            // card 2
            name_th_venue?:string,
            id_document_type_th_venue?:number,
            number_document_type_th_venue?:string,
            id_venue?:number,
            // card 3
            id_productor?:number,
            id_cat_productor?:number,

             // card 4
             id_category_th?:number,

              // card 5
            id_measure_unit?:number,

             // card 7
             attributeComplete?:AttributeValue[]){

         }


}
