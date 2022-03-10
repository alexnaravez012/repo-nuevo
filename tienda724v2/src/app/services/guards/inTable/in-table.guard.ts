import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class InTableGuard implements CanActivate {
  constructor(private router: Router, ){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean>|Promise<boolean>|boolean {
    let idEncoded = localStorage.getItem("ID");
    let mesa = localStorage.getItem("mesa");
    let isLogged = false;
    let hasTable = false;
    if(idEncoded!=null){
      let idDecodedString = atob(idEncoded);
      const obj = JSON. parse(idDecodedString);
      if (!obj.id_usuario) {
        isLogged=false;
      }else{
        isLogged=true;
      }
    }else{
      isLogged=false;
    }
    if(mesa!=null){
      hasTable=true;
    }else{
      hasTable=false;
    }


    if(!isLogged){
      this.router.navigate(['login'])
    }

    if(!hasTable){
      this.router.navigate(['adminrestaurant'])
    }

    return true;

  }

}
