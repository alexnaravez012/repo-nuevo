import { Injectable } from '@angular/core';
import { AngularFireMessaging } from '@angular/fire/messaging';
import {BehaviorSubject, Subject} from 'rxjs';
import {mergeMap, tap} from 'rxjs/operators';
import {NgxCoolDialogsService} from 'ngx-cool-dialogs';
import {HttpClient} from '@angular/common/http';
import {Urlbase} from '../shared/urls';

@Injectable({
  providedIn: 'root'
})
export class FCMservice {
  currentMessage: Subject<{}> = new Subject<{}>();
  public Token:string = "-1";
  constructor(
    private angularFireMessaging: AngularFireMessaging,
    private coolDialogs: NgxCoolDialogsService,
    private http:HttpClient
  ) {
    // angularFireMessaging.onMessage((payload) => {
    //   console.log("payload es ")
    //   console.log(payload)
    // })
  }

  setWorker(){
    navigator.serviceWorker.register("/app/firebase-messaging-sw.js")
      .then((registration) => {
        this.angularFireMessaging.useServiceWorker(registration);
      });
  }

  requestPermission() {
    this.angularFireMessaging.requestToken.subscribe(
      (token) => {
        localStorage.setItem("FCMrequest","true");
        console.log("FCM token: ");
        console.log(token);
        this.Token = token;
        localStorage.setItem("FCMtoken",token)
        this.http.post(Urlbase.auth+"/UpdateFCMtoken",{token:token||"-1"}).subscribe(value1 => {
          console.log("OK");console.log(value1);
        },error2 => {
          console.log("ERRRO FCMupdate: ");console.log(error2);
        })
      },
      (err) => {
        this.coolDialogs.alert("Es necesario el permiso de notificaciones para poder informar de los cambios de los pedidos").subscribe(res => {
        })
        console.error('Unable to get permission to notify.', err);
      }
    );
  }

  deleteToken() {
    this.angularFireMessaging.getToken
      .pipe(mergeMap(token => this.angularFireMessaging.deleteToken(token)))
      .subscribe(
        (token) => { console.log('Token deleted!'); },
      );
  }

  receiveMessage() {
    console.log("Listener agregado");
    this.angularFireMessaging.onMessage((payload) => {
      console.log("payload es ")
      console.log(payload)
      this.currentMessage.next(payload);
    })
  }

  //
  SendMessageToThird(title,body,data,id_third,idapp){
    data["titleD"] = title;
    data["bodyD"] = body;
    return new Promise((resolve, reject) => {
      this.http.post(Urlbase.auth+"/SendFCMpush",{
        id_third:id_third,
        title:title,
        body:body,
        data:data,
        idapp:idapp||26
      }).subscribe(value => resolve(value),error => reject(error))
    })
  }

  // receiveMessage2() {
  //   console.log("Listener agregado");
  //   this.angularFireMessaging.messages.subscribe(
  //     (payload) => {
  //       console.log("new message received. ", payload);
  //       this.currentMessage.next(payload);
  //     })
  // }
}
