import { ProductThirdSimple } from './productThirdSimple'
import { Product } from '../../products/models/product'
import { Code } from '../../bar-codes/models/code'

export class ProductThird{
    
     product:Product;
     description:ProductThirdSimple;
     code:Code;

     constructor( product:Product,
        description:ProductThirdSimple,
        code:Code){

     }

}