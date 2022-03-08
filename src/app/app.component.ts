import {Component, OnInit} from '@angular/core';
import {FCMservice} from './services/fcmservice.service';





@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {

  constructor(private fcmService:FCMservice) {
    localStorage.setItem("SesionExpirada", "false");
    if(!window.location.href.includes("localhost")){
      fcmService.setWorker();
    }
  }

  ngOnInit() {
  }
}
