import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import {Urlbase} from '../../../../../../../shared/urls';

@Component({
  selector: 'app-vsession',
  templateUrl: './vsession.component.html',
  styleUrls: ['./vsession.component.css']
})
export class VsessionComponent implements OnInit {

  constructor(private httpClient: HttpClient) { }


  vsessions;


  ngOnInit(): void {


  }

}
