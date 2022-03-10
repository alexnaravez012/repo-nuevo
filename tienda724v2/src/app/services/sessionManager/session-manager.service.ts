import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SessionManagerService {

  constructor() { }

  returnIdObject(){

    let idEncoded = localStorage.getItem("ID");

    if(idEncoded){
      let idDecodedString = atob(idEncoded);
      const obj = JSON.parse(idDecodedString);
      return obj;
    }else{
      return null;
    }

  }

  returnIdStore(){

    let idEncoded = localStorage.getItem("idStore");

    if(idEncoded){
      let idDecodedString = atob(idEncoded);
      return idDecodedString;
    }else{
      return null;
    }

  }

  setIdStore(idStore:any){
    localStorage.setItem("idStore",btoa(idStore));
  }

  setMesa(mesa:any){
    localStorage.setItem("mesa",btoa(JSON.stringify(mesa)));
  }

  returnMesa(){
    let idEncoded = localStorage.getItem("mesa");

    if(idEncoded){
      let idDecodedString = atob(idEncoded);
      const obj = JSON.parse(idDecodedString);
      return obj;
    }else{
      return null;
    }

  }

  deleteMesa(){
    localStorage.removeItem("mesa");
  }

  setStoreName(storeName: any){
    localStorage.setItem("storeName",btoa(storeName));
  }

  returnStoreName(){
    let idEncoded = localStorage.getItem("storeName");

    if(idEncoded){
      let idDecodedString = atob(idEncoded);
      return idDecodedString;
    }else{
      return null;
    }

  }


  setIdCaja(storeName: any){
    localStorage.setItem("ID_CAJA",btoa(storeName));
  }

  returnIdCaja(){
    let idEncoded = localStorage.getItem("ID_CAJA");

    if(idEncoded){
      let idDecodedString = atob(idEncoded);
      return idDecodedString;
    }else{
      return null;
    }

  }

}
