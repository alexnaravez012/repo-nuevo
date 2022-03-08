import {Component, EventEmitter, Input, OnInit, Output} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
/*
*     models for  your component
*/
import {ThirdDTO} from '../models/thirdDTO';
import {Token} from '../../../../../../shared/token';
import {DocumentType} from '../../document-type/models/document-type';

import {PasswordValidation} from './passwordValidation';

import {PersonDTO} from '../../../../../../shared/models/personDTO';
import {DirectoryDTO} from '../../../../../../shared/models/directoryDTO';
import {EmployeeDTO} from '../../../../../../shared/models/employeeDTO';
import {MailDTO} from '../../../../../../shared/models/mailDTO';
import {PhoneDTO} from '../../../../../../shared/models/phoneDTO';
import {UserThirdDTO} from '../../../../../../shared/models/userThirdDTO';
import {CommonThirdDTO} from '../../../commons/CommonThirdDTO';
import {CommonBasicInfoDTO} from '../../../commons/CommonBasicInfoDTO';
import {UsuarioDTO} from '../../../../../../shared/models/auth/UsuarioDTO';
import {LocalStorage} from '../../../../../../services/localStorage';
/*
*     services of  your component
*/
import {ThirdService} from '../../../../../../services/third.service';
import {DocumentTypeService} from '../../../../../../services/document-type.service';
import {AuthenticationService} from '../../../../../../services/authentication.service';
//import 'rxjs/add/operator/filter';
//import 'rxjs/add/operator/map';

/*
*    Material modules for component
*/

/*
*     others component
*/

/*
*     constant of  your component
*/

@Component({
  selector: 'app-new-employee',
  templateUrl: './new-employee.component.html',
  styleUrls: ['./new-employee.component.css']
})
export class NewEmployeeComponent implements OnInit {
  @Output() saveThird = new EventEmitter();
  @Input() flagRedirect:boolean=true;

  form: FormGroup;
  form_auth: FormGroup;
  form_third: FormGroup;
  form_profile: FormGroup;
  // DTO's
  directory: DirectoryDTO;
  phones: PhoneDTO[];
  mails: MailDTO[]
  person: PersonDTO;
  employee: EmployeeDTO;
  userThirdDTO: UserThirdDTO;
  commonThird: CommonThirdDTO;
  commonBasicInfo: CommonBasicInfoDTO;
  thirdDTO: ThirdDTO;
  usuarioDTO: UsuarioDTO;
  token: Token;

  //models
  documentTypes: DocumentType[];

  //attributes
  CURRENT_ID_THIRD = 0;
  CURRENT_ID_THIRD_PATHER = 0;
  isEmployee = true;
  isNaturalPerson = true;
  isPersonThird = true;
  isCredential = true;
  checked = true;
  disabledNatural = false;

  //Legal Data
  isLegalData = false;
  legalData = {
    resolucion_dian:"",
   regimen_tributario:"",
   autoretenedor:"",
   url_logo:"!232",
   id_city:11001,
   id_country:169,
   address:"",
   phone1:null,
   email:"",
   prefix_bill:"",
   notes:""
}


  constructor(private router: Router, private route: ActivatedRoute, private thirdService: ThirdService, private authenticationService: AuthenticationService,


    public docTypeService: DocumentTypeService, private fb: FormBuilder, private locStorage: LocalStorage) {
    this.mails = [];
    this.phones = [];
    this.commonThird = new CommonThirdDTO(null, null, null);
    this.employee = new EmployeeDTO(null, this.commonThird)
    this.userThirdDTO = new UserThirdDTO(null, this.commonThird)
    this.commonBasicInfo = new CommonBasicInfoDTO(null, null, null, null);
    this.directory = new DirectoryDTO(null, null, null, null, this.commonThird,
      this.mails, this.phones);
    this.person = new PersonDTO(null, null, null, null, null,
      this.commonBasicInfo, this.commonThird, this.directory, this.employee,
      this.userThirdDTO);
    this.thirdDTO = new ThirdDTO(null, null, this.commonBasicInfo, this.commonThird, this.person, this.directory);
    this.usuarioDTO = new UsuarioDTO(null, null, null, [])

    this.CURRENT_ID_THIRD = null;


  }

  ngOnInit() {

    //
    this.createControls();


    let session = this.locStorage.getSession();
    if (!session) {
      /**
      @todo Eliminar comentario para
      */
      this.Login();
    } else {
      this.token = this.locStorage.getToken();
      this.CURRENT_ID_THIRD_PATHER = this.token.id_third_father;

      this.route
        .queryParams
        .subscribe(params => {
          // Defaults to 0 if no query param provided.
          this.getDocumentType();


          this.CURRENT_ID_THIRD = params.father;
          if (this.CURRENT_ID_THIRD === undefined || this.CURRENT_ID_THIRD === null || this.CURRENT_ID_THIRD <= 0) {

            //this.CURRENT_ID_THIRD = this.token.id_third;
          } else {
            this.isNaturalPerson = true;
            this.disabledNatural = true;

          }



          this.loadData()
        });
    }
  }



  // GET /documents-types
  getDocumentType(): void {

    this.docTypeService.getDocumentTypeList()
      .subscribe((data: DocumentType[]) => this.documentTypes = data,
        error => CPrint(error),
        () => {

        });
  }



  createControls() {
    this.form = this.fb.group({

      //profile
      first_name: ['', Validators.compose([
        Validators.required
      ])],
      second_name: ['', Validators.compose([

      ])],
      first_lastname: ['', Validators.compose([
        Validators.required
      ])],
      second_lastname: ['', Validators.compose([

      ])],
      birthday: ['', Validators.compose([
        Validators.required
      ])],
      //info
      fullname_prof: ['', Validators.compose([
        Validators.required
      ])],
      id_document_type_prof: ['', Validators.compose([
        Validators.required
      ])],
      document_number_prof: ['', Validators.compose([
        Validators.required
      ])],
      img_prof: ['', Validators.compose([
        Validators.required
      ])],
      //state_prof
      state_prof: ['', Validators.compose([
        Validators.required
      ])],
      //directory_prof
      address_prof: ['', Validators.compose([
        Validators.required
      ])],
      country_prof: ['', Validators.compose([
        Validators.required

      ])],
      city_prof: ['', Validators.compose([
        Validators.required
      ])],
      webpage_prof: ['', Validators.compose([
        Validators.required
      ])],
      //state_dir_prof
      state_dir_prof: ['', Validators.compose([
        Validators.required
      ])],
      //pohe_prof
      phone_prof: ['', Validators.compose([
        Validators.required
      ])],
      priority_pohe_prof: ['', Validators.compose([
        Validators.required
      ])],
      //state_pohe_prof
      state_pohe_prof: ['', Validators.compose([
        Validators.required
      ])],
      //mail_prof
      mail_prof: ['', Validators.compose([

      ])],
      priority_mail_prof: ['', Validators.compose([
        Validators.required
      ])],
      //state_mail_prof
      state_mail_prof: ['', Validators.compose([
        Validators.required
      ])],
      //employee
      salary: ['', Validators.compose([
        Validators.required
      ])],
      //state_em
      state_em: ['', Validators.compose([
        Validators.required
      ])],

      isNaturalPerson: [false, Validators.compose([

      ])],

      isEmployee: [false, Validators.compose([

      ])]
      //UUID
    });

    this.form_auth = this.fb.group({
      //directory_third
      id_rol: ['', Validators.compose([

      ])],
      username: [this.form.value['mail_prof'], Validators.compose([
        Validators.required
      ])],
      password: ['', Validators.compose([
        Validators.required,
        Validators.minLength(8),
        Validators.pattern("^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])([A-Za-z0-9]|[^ ]){8,15}$")
      ])],
      confirm: ['', Validators.compose([
        Validators.required
      ])],

      isCredential: [false, Validators.compose([

      ])]

    },
      {
        validator: PasswordValidation.MatchPassword // your validation method
      });

    this.form_third = this.fb.group({
      //info
      fullname: ['', Validators.compose([
        Validators.required
      ])],
      document_type: ['', Validators.compose([
        Validators.required
      ])],
      document_number: ['', Validators.compose([
        Validators.required
      ])],
      img: ['', Validators.compose([
        Validators.required
      ])],
      //state
      state: ['', Validators.compose([
        Validators.required
      ])],


      //directory_third
      address_th: ['', Validators.compose([
        Validators.required
      ])],
      country_th: ['', Validators.compose([
        Validators.required
      ])],
      city_th: ['', Validators.compose([
        Validators.required
      ])],
      webpage_th: ['', Validators.compose([
        Validators.required
      ])],
      //state_dir_th
      state_dir_th: ['', Validators.compose([
        Validators.required
      ])],
      //pohe_th
      phone_th: ['', Validators.compose([
        Validators.required
      ])],
      priority_pohe_th: ['', Validators.compose([
        Validators.required
      ])],
      //state_pohe_th
      state_pohe_th: ['', Validators.compose([
        Validators.required
      ])],
      //mail_th
      mail_th: ['', Validators.compose([
        Validators.required
      ])],
      priority_mail: ['', Validators.compose([
        Validators.required
      ])],
      //state_mail
      state_mail: ['', Validators.compose([
        Validators.required
      ])]

    });
  }

  loadData() {

    /*  this.form_auth.patchValue({
       username: "Daniel@gmail.com",
       password: "1234567Da",
       confirm: "1234567Da"
     });
  */


    this.form_third.patchValue({
      /* fullname: "TIenda",
      document_type: 60,
      document_number: "wewew",
      address_th: "wwdad",*/
      country_th: "Colombia",
      city_th: "Bogota"/* ,
          webpage_th: "www.",
          phone_th: "323232312",
          mail_th: "luis@gmail.com" */
    });

    this.form.patchValue({
      //profile
      /* first_name: "Luis",
      second_name: "Fernando",
      first_lastname: "Garcia",
      second_lastname: "Quiroga",
      birthday: "", */

      //info
      /*   fullname_prof: "Luis F. Garcia Q",
        id_document_type_prof: "",
        document_number_prof: "212eweqwewqe",
        img_prof: "es", */
      //state_prof
      //state_prof: "1",
      //directory_prof
      //address_prof: "cra",
      country_prof: "Colombia",
      city_prof: "Bogota",
      //webpage_prof: "www.personal.com",
      //state_dir_prof
      // //state_dir_prof: "1",
      // //pohe_prof
      // phone_prof: "21ewweqwe",
      // priority_pohe_prof: "1",
      // //state_pohe_prof
      // state_pohe_prof: "1",
      // //mail_prof
      // mail_prof: "luis@gmail.com",
      // priority_mail_prof: "1",
      // //state_mail_prof
      // state_mail_prof: "1",
      // //employee
      // salary: "1",
      // //state_em
      // state_em: "1"
    });
  }

  resetForm() {
    if(localStorage.getItem("SesionExpirada") != "true"){ alert("Usuario creado exitosamente")}
    this.form_third.reset();
    this.form.reset();
    this.form_auth.reset();
  }


  createNewThird() {

    var UUID: string;
    if(this.isLegalData){
      this.thirdService.postLegalData(this.legalData).subscribe(res=>{
        CPrint(res)
      })
    }

    if (this.isNaturalPerson) {

      if(localStorage.getItem("SesionExpirada") != "true"){ alert("PERSONA")}


      this.person.first_name = this.form.value["first_name"];
      this.person.second_name = this.form.value["second_name"];
      this.person.first_lastname = this.form.value["first_lastname"];
      this.person.second_lastname = this.form.value["second_lastname"];
      this.person.birthday = this.form.value["birthday"];

      //info

      this.commonBasicInfo.fullname = this.person.first_name + " " + this.person.second_name + " " + this.person.first_lastname + " " + this.person.second_lastname
      this.commonBasicInfo.id_document_type = this.form.value["id_document_type_prof"];
      this.commonBasicInfo.document_number = this.form.value["document_number_prof"];

      this.person.info = this.commonBasicInfo;

      this.commonThird.state = 1;

      //common
      this.person.state = this.commonThird;
      CPrint(this.person);
      //directory
      this.directory.address = this.form.value["address_prof"];
      this.directory.country = this.form.value["country_prof"];
      this.directory.city = this.form.value["city_prof"];
      this.directory.webpage = this.form.value["webpage_prof"];
      //this.directory.state = new CommonThird(null, 1, null, null);

      this.phones.push(
        {
          "phone": this.form.value["phone_prof"],
          "priority": 1,
          "state": this.commonThird
        }
      )



      this.directory.phones = this.phones;


      CPrint("isEmployee " + this.isEmployee)
      if (this.form.value["isEmployee"]) {

        this.commonThird.state = 1;

        // **************************************************
        // Instance object for grant access in module Third
        this.employee.salary = this.form.value["salary"]
        this.employee.state = this.commonThird
        this.person.employee = this.employee;

        //Get data for creation of credential employee in auth API
        if (this.form_auth.value["isCredential"]) {

          var usernameAuth = this.form_auth.value["username"];
          var passwordAuth = this.form_auth.value["password"];

          this.usuarioDTO.id_aplicacion = this.locStorage.getIdApplication();
          this.usuarioDTO.usuario = usernameAuth;
          this.usuarioDTO.clave = passwordAuth;
          this.usuarioDTO.id_roles = [21]



          this.authenticationService.postUserAUTH(this.usuarioDTO)
            .subscribe(
              result => {
                if (result) {

                  this.mails = [
                    {
                      "mail": usernameAuth,
                      "priority": 1,
                      "state": this.commonThird
                    }
                  ]


                  this.directory.mails = this.mails;

                  UUID = result + ''

                  // **************************************************
                  // Instance object for grant access in module Third
                  this.userThirdDTO.UUID = UUID;
                  this.userThirdDTO.state = this.commonThird
                  this.person.UUID = this.userThirdDTO;


                  //this.thirdDTO.directory = this.directory;
                  this.thirdDTO.id_third_father = (this.CURRENT_ID_THIRD > 0) ? this.CURRENT_ID_THIRD : this.CURRENT_ID_THIRD_PATHER;
                  this.thirdDTO.id_third_type = 23;

                  this.thirdDTO.state = this.commonThird;
                  this.person.directory = this.directory;
                  this.thirdDTO.profile = this.person;
                  CPrint("this is dto",JSON.stringify(this.thirdDTO));


                  this.thirdService.postThird(this.thirdDTO)
                    .subscribe(
                      result => {

                        if (result.hasOwnProperty('third_id')) {
                          this.saveThird.emit({id:result.third_id , data:this.thirdDTO});
                          if(this.flagRedirect){
                            this.resetForm();
                            this.goBack();
                          }


                          return;
                        } else {

                          //this.openDialog();
                          return;
                        }
                      })


                } else {
                  if(localStorage.getItem("SesionExpirada") != "true"){ alert("Usuario no creado")}
                  return;
                }
              })

        } else {


          this.thirdService.postThird(this.thirdDTO)
            .subscribe(
              result => {

                if (result.hasOwnProperty('third_id')) {
                  this.saveThird.emit({id:result.third_id , data:this.thirdDTO});
                  if(this.flagRedirect){
                    this.resetForm();
                    this.goBack();
                  }


                  return;
                } else {

                  //this.openDialog();
                  return;
                }
              })

        } // end USER
      } else {
        CPrint('ENTRO POR AQUI:::');
        //this.thirdDTO.directory = this.directory;
        this.thirdDTO.id_third_father = (this.CURRENT_ID_THIRD > 0) ? this.CURRENT_ID_THIRD : this.CURRENT_ID_THIRD_PATHER;
        this.thirdDTO.id_third_type = 23;

        this.thirdDTO.state = this.commonThird;
        this.person.directory = this.directory;
        this.thirdDTO.profile = this.person;
        CPrint(this.thirdDTO);

        this.thirdService.postThird(this.thirdDTO)
          .subscribe(
            result => {

              if (result.hasOwnProperty('third_id')) {
                this.saveThird.emit({id:result.third_id , data:this.thirdDTO});
                if(this.flagRedirect){
                  this.resetForm();
                  this.goBack();
                }


                return;
              } else {

                //this.openDialog();
                return;
              }
            })

      }// end employee




    }//end Profile


    //begin Third Only
    if (!this.isNaturalPerson) {

      if(localStorage.getItem("SesionExpirada") != "true"){ alert("TERCERO")}

      this.commonThird.state = 1;
      this.commonBasicInfo.fullname = this.form_third.value["fullname"];
      this.commonBasicInfo.id_document_type = this.form_third.value["document_type"];
      this.commonBasicInfo.document_number = this.form_third.value["document_number"];

      this.directory.address = this.form_third.value["address_th"];
      this.directory.country = this.form_third.value["country_th"];
      this.directory.city = this.form_third.value["city_th"];
      this.directory.webpage = this.form_third.value["webpage_th"];
      this.directory.state = this.commonThird;

      this.phones.push(
        {
          "phone": this.form_third.value["phone_th"],
          "priority": 1,
          "state": this.commonThird
        }
      )

      this.mails.push(
        {
          "mail": this.form_third.value["mail_th"],
          "priority": 1,
          "state": this.commonThird
        }
      )

      this.directory.phones = this.phones;
      this.directory.mails = this.mails;
      this.thirdDTO.directory = this.directory;
      this.thirdDTO.id_third_father = (this.CURRENT_ID_THIRD > 0) ? this.CURRENT_ID_THIRD : this.CURRENT_ID_THIRD_PATHER;
      this.thirdDTO.id_third_type = 23;
      this.thirdDTO.info = this.commonBasicInfo;
      this.thirdDTO.state = this.commonThird;

      this.thirdService.postThird(this.thirdDTO)
        .subscribe(
          result => {

            if (result.hasOwnProperty('third_id')) {
              this.saveThird.emit({id:result.third_id , data:this.thirdDTO});
              if(this.flagRedirect){
                this.resetForm();
                this.goBack();
              }
              return;
            } else {

              //this.openDialog();
              return;
            }
          })


    }// end Third Only

  }

  goBack() {
    let link = ['/dashboard/business/third/list'];
    this.router.navigate(link);
  }

  Login() {
    let link = ['/auth'];
    this.router.navigate(link);
  }

  Logout() {
    this.locStorage.cleanSession();
    this.goIndex();

  }

  goIndex() {
    let link = ['/'];
    this.router.navigate(link);
  }

  goDashboard() {
    let link = ['/dashboard'];
    this.router.navigate(link);

  }

}
