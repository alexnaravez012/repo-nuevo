import {Component, OnInit, ViewChild} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import {DataSource} from '@angular/cdk/collections';
import {Router} from '@angular/router';
import {Observable, of} from 'rxjs';
//import 'rxjs/add/observable/of';
import * as _ from 'lodash';


import {MatTabChangeEvent} from '@angular/material';


import {LocalStorage} from '../../../../../../services/localStorage';
import {Token} from '../../../../../../shared/token';

import {ThirdService} from '../../../../../../services/third.service';
import {Third} from '../models/third';
import * as jQuery from 'jquery';
import 'bootstrap-notify';

var thirdList:Third[];
var thirdListGlobal:Third[];
let $: any = jQuery;

@Component({
  selector: 'app-third-data',
  templateUrl: './third-data.component.html',
  styleUrls: ['./third-data.component.css']
})
export class ThirdDataComponent implements OnInit {

    position = 'before';
    document_type_filter: number = null;
    document_number_filter: string = null;
    id_third_filter: number;
    token:Token;
    ID_THIRD_TYPE: number;
    isMyThird=true;

    @ViewChild('tabGroup') tabGroup;
    stateThird=1
    CURRENT_ID_THIRD = 0;
    CURRENT_ID_THIRD_PATHER = 0;

    thirdAux:Third[];






  displayedColumns = ['position', 'name', 'weight', 'symbol', 'direccion', 'opciones'];
  displayedColumns_General = ['position', 'name', 'weight', 'symbol', 'direccion'];
  dataSource:ExampleDataSource
  dataSourceGlobal: ThirdGlobalDataSource



  constructor(public locStorage: LocalStorage,
    private _router: Router,
    public thirdService: ThirdService) {
  }


     ngOnInit() {


          let session = this.locStorage.getSession();
          if (!session) {
            this.Login();
          } else {
            this.token = this.locStorage.getToken();
            this.CURRENT_ID_THIRD=this.token.id_third;
            this.CURRENT_ID_THIRD_PATHER = this.token.id_third_father;
            this.ID_THIRD_TYPE = 23;

            if (this.CURRENT_ID_THIRD!==null && this.CURRENT_ID_THIRD>0){

              // this.getThird(null, this.CURRENT_ID_THIRD_PATHER, this.document_type_filter, this.document_number_filter, null, null)
              // this.getThirdFather(null, this.CURRENT_ID_THIRD_PATHER, this.document_type_filter, this.document_number_filter)

            }
            // this.getThirdGlobal(null, null, null, null, null, null, this.ID_THIRD_TYPE)

          }




        }

  Login() {
    let link = ['/auth'];
    this._router.navigate(link);
  }



    // // GET /Thirds
    // getThird(id_third: number, id_third_father: number, document_type: number, document_number: string,

    //       id_doctype_person: number, doc_person: string): void {


    //       this.thirdService.getThirdList(id_third, id_third_father, document_type, document_number, id_doctype_person, doc_person, null, this.stateThird)
    //         .subscribe((data: Third[]) => thirdList = data,
    //         error => CPrint(error),
    //         () => {

    //           this.dataSource = new ExampleDataSource();
    //         });

    //     }
    // GET /Thirds
    // getThirdGlobal(id_third: number, id_third_father: number, document_type: number, document_number: string,

    //       id_doctype_person: number, doc_person: string, id_third_type: number): void {


    //       this.thirdService.getThirdList(id_third, id_third_father, document_type, document_number, id_doctype_person, doc_person, id_third_type, this.stateThird)
    //         .subscribe((data: Third[]) => thirdListGlobal = data,
    //         error => CPrint(error),
    //         () => {

    //           this.dataSourceGlobal = new ThirdGlobalDataSource();
    //         });

    //     }

  // GET /Thirds
  // getThirdFather(id_third: number, id_third_father: number, document_type: number, document_number: string): void {

  //       this.thirdService.getThirdList(id_third, null, null, null, null, null, null, this.stateThird)
  //         .subscribe((data: Third[]) => this.thirdAux = data,
  //         error => CPrint(error),
  //         () => {

  //         });
  //     }

  // getThirdDoc(id_third: number, id_third_father: number, document_type: number, document_number: string,
  //   id_doctype_person: number, doc_person: string): void {
  //   if (id_third) {
  //     this.thirdService.getThirdList(id_third, id_third_father, document_type, document_number, null, null, null, this.stateThird)
  //       .subscribe((data: Third[]) => thirdList = data,
  //       error => CPrint(error),
  //       () => {


  //         this.dataSource = new ExampleDataSource();
  //       });
  //   } else {
  //     if(localStorage.getItem("SesionExpirada") != "true"){ alert("NO tiene un Tercero")}
  //   }
  // }

    showDocumentTypeFilter(event):void{

      if(this.isMyThird){


        this.document_type_filter=event.document_type;
        this.document_number_filter=event.document_number;


        // this.getThird(null,null,this.document_type_filter,this.document_number_filter,null,null)
        thirdList=this.thirdAux;
        //this.getThirdDoc(null,null,this.document_type_filter,this.document_number_filter,null,null)
        //this.dataSource = new ExampleDataSource();

      }else{

        if(localStorage.getItem("SesionExpirada") != "true"){ alert("Filtrar Terceros Generales")}
        // this.getThirdGlobal(null,null,this.document_type_filter,this.document_number_filter,null,null,this.ID_THIRD_TYPE)
      }


    }


    tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {

      let current_index = tabChangeEvent.index

      if(current_index>0){
        this.isMyThird=false
      }else{
        this.isMyThird=true
      }
    }

    editThird(third:Third){
      this._router.navigate(['/dashboard/business/third/edit',third.id_third] );



    }

    addThird(third:Third){
      if(localStorage.getItem("SesionExpirada") != "true"){ alert(third.id_third)}
      this._router.navigate(['/dashboard/business/third/new'],{queryParams:{father:third.id_third}} );

    }

    deleteThird(id_third) {

          this.thirdService.Delete(id_third)
            .subscribe(
            result => {

              if (result === true) {
                thirdList = _.filter(thirdList, function (f) { return f.id_third !== id_third; });
                this.dataSource = new ExampleDataSource();

                if(localStorage.getItem("SesionExpirada") != "true"){ alert("Eliminado correctamente");}

                return;
              } else {
                //this.openDialog();
                return;
              }
            })

        }




}

export class ExampleDataSource extends DataSource<any> {
  /** Connect function called by the table to retrieve one stream containing the data to render. */

  connect(): Observable<Third[]> {

    return of(thirdList);
  }

  disconnect() {}
}

export class ThirdGlobalDataSource extends DataSource<any> {
  /** Connect function called by the table to retrieve one stream containing the data to render. */

  connect(): Observable<Third[]> {

    return of(thirdListGlobal);
  }

  disconnect() {}
}
