export function CPrint(message?: any, ...optionalParams: any[]){
  if(!window.location.href.includes("tienda724.com") || window.location.href.includes("pruebas.tienda724.com")){
    if(optionalParams.length != 0){
      console.log(message,optionalParams);
    }else{
      console.log(message);
    }
  }
}
//import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
