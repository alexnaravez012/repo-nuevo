import { InventoryDetailSimple } from './inventoryDetailSimple'
import { Product } from '../../products/models/product'
import { ProductThirdSimple } from '../../products-third/models/productThirdSimple'

export class InventoryDetail{

  detail:InventoryDetailSimple;
  product:Product;
  description:ProductThirdSimple;

  constructor(detail:InventoryDetailSimple,
              product:Product,
              description:ProductThirdSimple){

  }


}
