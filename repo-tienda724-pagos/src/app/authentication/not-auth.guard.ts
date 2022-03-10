import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';


@Injectable()
export class NotAuthGuard implements CanActivate {

  constructor( private router: Router) { }

  canActivate() {
    if ( localStorage.getItem('currentUser') === null) {
      return true;
    }
    this.router.navigate(['/perfil']);
    return false;
  }

}
