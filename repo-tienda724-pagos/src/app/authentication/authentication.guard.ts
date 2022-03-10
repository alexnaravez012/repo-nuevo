import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';


@Injectable()
export class AuthGuard implements CanActivate {
  constructor( private router: Router) { }
  canActivate() {
    if(localStorage.getItem('currentUserStore724') !== null) {
      return true;
    }
    this.router.navigate(['/auth']);
    return false;
  }

}
