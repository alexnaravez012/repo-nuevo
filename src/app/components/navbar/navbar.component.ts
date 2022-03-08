import {Component, ElementRef, OnInit} from '@angular/core';
import {ROUTES} from '../sidebar/sidebar.component';
import {Location} from '@angular/common';
import {FormControl} from '@angular/forms';
import {Router} from '@angular/router';
import {AuthenticationService} from '../../services/authentication.service';

import {LocalStorage} from '../../services/localStorage';
import {Token} from '../../shared/token';
import {Person} from '../../shared/models/person';

import {Third} from '../../tienda724/dashboard/business/thirds724/third/models/third';
import * as jQuery from 'jquery';
import 'bootstrap-notify';


let $: any = jQuery;

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent implements OnInit {
    date = new FormControl({value:new Date(), disabled:true});
    private listTitles: any[];
    location: Location;
    private toggleButton: any;
    private sidebarVisible: boolean;
    thirdFather:Third
    space="  | "

        user=false;
        person:Person;

        token:Token;

    constructor(location: Location,  private element: ElementRef,
                private authService:AuthenticationService,
                private router:Router,
                private locStorage:LocalStorage) {
      this.location = location;
          this.sidebarVisible = false;
    }






    ngOnInit(){


        if(this.locStorage.getThird().id_third == 244){
            this.locStorage.setIdCaja(1);
            this.locStorage.setIdStore(1);
          }
          if(this.locStorage.getThird().id_third == 541){
            this.locStorage.setIdCaja(61);
            this.locStorage.setIdStore(62);
          }
          if(this.locStorage.getThird().id_third == 542){
            this.locStorage.setIdCaja(62);
            this.locStorage.setIdStore(61);
          }



           let session=this.locStorage.getSession();
           if(!session){
             /**
             @todo Eliminar comentario para
             */
            this.goIndex();
           }else{


            this.listTitles = ROUTES.filter(listTitle => listTitle);
            const navbar: HTMLElement = this.element.nativeElement;
            this.toggleButton = navbar.getElementsByClassName('navbar-toggle')[0];

             this.token=this.locStorage.getToken();
             this.person= this.locStorage.getPerson();

             this.token=this.locStorage.getToken();
             this.thirdFather=this.locStorage.getThird();

           }

    }

    sidebarOpen() {
        const toggleButton = this.toggleButton;
        const body = document.getElementsByTagName('body')[0];
        setTimeout(function(){
            toggleButton.classList.add('toggled');
        }, 500);
        body.classList.add('nav-open');

        this.sidebarVisible = true;
    };

    sidebarClose() {
        const body = document.getElementsByTagName('body')[0];
        this.toggleButton.classList.remove('toggled');
        this.sidebarVisible = false;
        body.classList.remove('nav-open');
    };
    sidebarToggle() {
        // const toggleButton = this.toggleButton;
        // const body = document.getElementsByTagName('body')[0];
        if (this.sidebarVisible === false) {
            this.sidebarOpen();
        } else {
            this.sidebarClose();
        }
    };
    sidebarToggle2() {
        // const toggleButton = this.toggleButton;
        // const body = document.getElementsByTagName('body')[0];

        this.sidebarClose();
    };

    getTitle(){
      var titlee = this.location.prepareExternalUrl(this.location.path());
      if(titlee.charAt(0) === '#'){
          titlee = titlee.slice( 2 );
      }
      titlee = titlee.split('/').pop();

      for(var item = 0; item < this.listTitles.length; item++){
          if(this.listTitles[item].path === titlee){
              return this.listTitles[item].title;
          }
      }
      return 'Dashboard';
    }
      isMobileMenu() {
          if (window.innerWidth > 991) {
              return true;
          }
          return false;
      };

    logout() {
        this.locStorage.cleanSession();
        this.token=null;
        this.goIndex();

        this.showNotification('top','right');

       }

       goIndex() {
         let link = ['/login?appid=30'];
         this.router.navigate(link);
       }


    showNotification(from, align){
        const type = ['','info','success','warning','danger'];

        const color = Math.floor((Math.random() * 4) + 1);

        $.notify({
            icon: "notifications",
            message: "Usted <b>Cerro Sesión</b> de forma satisfactoria."

        },{
            type: type[2],
            timer: 200,
            placement: {
                from: from,
                align: align
            }
        });
      }
}
