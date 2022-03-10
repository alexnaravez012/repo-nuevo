import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class OpenBoxGuard implements CanActivate {
  constructor(private router: Router, ){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean>|Promise<boolean>|boolean {
    let idEncoded = localStorage.getItem("ID_CAJA");
    if(idEncoded==null){
      this.router.navigate(['openbox']);
    }

    return true;

  }

}
