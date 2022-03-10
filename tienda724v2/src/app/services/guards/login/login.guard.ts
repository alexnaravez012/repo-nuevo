import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class LoginGuard implements CanActivate {
  constructor(private router: Router, ){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean>|Promise<boolean>|boolean {
    let idEncoded = localStorage.getItem("ID");
    if(idEncoded!=null){
      let idDecodedString = atob(idEncoded);
      const obj = JSON. parse(idDecodedString);
      if (!obj.id_usuario) {
        this.router.navigate(['login']);
      }
    }else{
      this.router.navigate(['login']);
    }

    return true;

  }

}
