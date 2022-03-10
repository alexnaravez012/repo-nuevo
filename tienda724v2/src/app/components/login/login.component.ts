import { Component, OnInit } from '@angular/core';
import { Urlbase } from '../../classes/urls';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

  constructor(private route: ActivatedRoute,
              private router: Router,
              private httpClient: HttpClient,
              ) { }


  usuario: String = "";
  clave: String = "";

  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });

  ngOnInit(): void {

  }

  login(){
    this.httpClient.post(Urlbase.auth+"/login?id_aplicacion=21&dispositivo=WEB",{'usuario':this.usuario,'clave':this.clave},{ headers: this.headers,withCredentials:true }).subscribe(response =>{
      localStorage.setItem('ID', btoa(JSON.stringify(response)));
      //localStorage.setItem('ID_CAJA', btoa(JSON.stringify(101)));
      //@ts-ignore
      this.httpClient.get(Urlbase.tienda+"/store?id_third="+response.id_third,{ headers: this.headers,withCredentials:true }).subscribe(response2 => {
        //@ts-ignore
        localStorage.setItem('idStore', btoa(response2[0].id_STORE));
      })
      this.router.navigate(["/menu"], { relativeTo: this.route });
    })
  }

}
