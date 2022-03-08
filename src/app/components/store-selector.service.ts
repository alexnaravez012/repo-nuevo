import {EventEmitter, Injectable} from '@angular/core';

@Injectable()
export class StoreSelectorService {

  constructor() { }

  onMainEvent = new EventEmitter<Number>();

  onLogOutEvent = new EventEmitter<Number>();

  onDataSendEvent = new EventEmitter<DTOData>();

}


export class DTOData{
  id_bill: Number;
  is_it: Boolean;
  constructor(
    id_bill: Number,
    is_it: Boolean){
      this.id_bill = id_bill;
      this.is_it = is_it;
    }
}
