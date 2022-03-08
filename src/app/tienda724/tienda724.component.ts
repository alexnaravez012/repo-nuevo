import {Component, OnInit, ViewEncapsulation} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import {Location} from '@angular/common';
import {Router} from '@angular/router';
import {UserThird} from '../shared/userThird';
import {Token} from '../shared/token';
import {Person} from '../shared/models/person';
import {Employee} from '../shared/models/employee';
import {Third} from './dashboard/business/thirds724/third/models/third';
import {CommonThird} from './dashboard/business/commons/CommonThird';
/*
*     services of  your component
*/
import {LocalStorage} from '../services/localStorage';
import {AuthenticationService} from '../services/authentication.service';
import {UserThirdService} from '../services/user-third.service';
import {ThirdService} from '../services/third.service';


/*
*     others component
*/

/*
*     models for  your component
*/


@Component({
    selector: 'tienda724',
    templateUrl: 'tienda724.component.html',
    styleUrls: ['tienda724.component.scss'],
    encapsulation: ViewEncapsulation.None,
})
export class Tienda724Component implements OnInit {

  token:Token;
  UUID:string;

  userThird:UserThird[];
  person:Person;
  userThirdQ:UserThird;
  userThirdAux:UserThird;
  thirdList:Third[];
  commonThird:CommonThird;
  employee:Employee;

  constructor(public location: Location,  public locStorage: LocalStorage,
              private _router: Router,
              private authService:AuthenticationService,
              private userThirdService: UserThirdService,
              public thirdService:ThirdService) {
                this.commonThird= new CommonThird(null,null,null,null);
                this.userThirdQ= new UserThird(null,null,null,this.commonThird);
                this.userThirdAux=this.userThirdQ;
                this.person= new Person(null,null,null,null,null,null,null,this.commonThird,null,null,this.userThirdQ)
                this.employee=new Employee(null,null,this.commonThird)
              }

  ngOnInit() {
    let session=this.locStorage.getSession();
    if(!session){
      /**
      @todo Eliminar comentario para
      */
        this.Login();
    }else{


      this.token=this.locStorage.getToken();
      this.UUID=""+this.token.id_usuario;



      if(!this.locStorage.getPerson()){
        this.userThirdQ.UUID=this.UUID;
        this.loadUserThird(this.userThirdQ);
      }

    }

     /*  $.material.options.autofill = true;
      $.material.init(); */

  }


  Login() {
    let link = ['/auth'];
    this._router.navigate(link);
  }

  Logout() {
   this.locStorage.cleanSession();
   this.goIndex();

  }

  goIndex() {
    let link = ['/'];
    this._router.navigate(link);
  }

  goDashboard() {
    let link = ['/dashboard'];
    this._router.navigate(link);

  }
  Perfil() {
    if(localStorage.getItem("SesionExpirada") != "true"){ alert("EN DESARROLLO");}

  }

  isMobileMenuNav() {
    if(window.innerWidth > 991) {
        return false;
    }
    return true;
  };

  loadUserThird(user:UserThird){

    this.userThirdService.getUserThirdList(user)
    .subscribe((data: UserThird[]) => this.userThird = data,
      error => CPrint(error),
            () => {
              if(this.userThird.length>0){

                if(this.userThird.length>0){
                  // this.getThird(null,null,null,null,null,null,this.userThird[0].id_person)
                }

              }
          });
  }

    // GET /Thirds
    // getThird(id_third?: number, id_third_father?: number, document_type?: number, document_number?: string,

    //       id_doctype_person?: number, doc_person?: string,id_person?:number): void {


    //       this.thirdService.getThirdList(id_third, id_third_father, document_type, document_number, id_doctype_person, doc_person, null, null,id_person)
    //         .subscribe((data: Third[]) => this.thirdList = data,
    //         error => CPrint(error),
    //         () => {


    //           if(this.thirdList.length>0){

    //             Object.assign(this.person,this.thirdList[0].profile );
    //             Object.assign(this.userThirdAux,this.thirdList[0].profile['uuid'][0] );
    //             Object.assign(this.employee,this.thirdList[0].profile['employee'][0] );

    //             this.person.uuid=this.userThirdAux;
    //             this.person.employee=this.employee;
    //             this.token.id_third=this.thirdList[0].id_third?this.thirdList[0].id_third:null;
    //             this.token.id_third_father=this.thirdList[0].id_third_father?this.thirdList[0].id_third_father:null;
    //             localStorage.setItem('currentUserPersonStore724', JSON.stringify(this.person));
    //             localStorage.setItem('currentUserTokenStore724',JSON.stringify(this.token))

    //           }
    //         });

    //     }


    isMaps(path){
      var titlee = this.location.prepareExternalUrl(this.location.path());
      titlee = titlee.slice( 1 );
      if(path == titlee){
        return false;
      }
      else {
        return true;
      }
    }
}
