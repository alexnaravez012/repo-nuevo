import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class NoLogGuard implements CanActivate {
  constructor(private router: Router, ){}
  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean>|Promise<boolean>|boolean {
    let idEncoded = localStorage.getItem("ID");
    if(idEncoded!=null){
      this.router.navigate(['menu']);
    }

    return true;

  }

}
