import {HttpErrorResponse, HttpEvent, HttpHandler, HttpInterceptor, HttpRequest} from '@angular/common/http';
import {Injectable} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import {Observable} from 'rxjs';
import {tap} from 'rxjs/operators';
import {Router} from '@angular/router';

import * as jQuery from 'jquery';
import 'bootstrap-notify';
import {LocalStorage} from '../../services/localStorage';

let $: any = jQuery;

@Injectable()
export class CustomInterceptor implements HttpInterceptor {

  constructor(public router: Router,public locStorage: LocalStorage) {
  }

  intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

    request = request.clone({
      withCredentials: true
    });

    //return next.handle(request);
    return next.handle(request).pipe(tap((event: HttpEvent<any>) => {
      return event;
    },(EventError:HttpErrorResponse) => {
      CPrint("EventError2 es:");
      CPrint(EventError);
      if(EventError.status == 401){
        this.locStorage.cleanSession();
        localStorage.setItem("SesionExpirada","true");
        this.goIndex();
        if(localStorage.getItem("SesionExpirada") != "true"){this.showNotification('top','right');}
        return new Observable<HttpEvent<any>>();
      }
    }));
  }

  goIndex() {
    let link = ['/'];
    // noinspection JSIgnoredPromiseFromCall
    this.router.navigate(link);
  }

  showNotification(from, align,text = "Su sesión ha <b>Expirado</b>, vuelva a iniciarla."){
    const type = ['','info','success','warning','danger'];

    const color = Math.floor((Math.random() * 4) + 1);

    $.notify({
      icon: "notifications",
      message: text

    },{
      type: type[3],
      timer: 200,
      placement: {
        from: from,
        align: align
      }
    });
  }
}
