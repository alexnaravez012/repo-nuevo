import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
/*
*     services of  your component
*/
import {ThirdService} from '../../../../../../services/third.service';


/*
*    Material modules for component
*/

/*
*     others component
*/
/*
*     models for  your component
*/

/*
*     constant of  your component
*/


@Component({
  selector: 'app-edit-third',
  templateUrl: './edit-third.component.html',
  styleUrls: ['./edit-third.component.css']
})
export class EditThirdComponent implements OnInit {
  form: FormGroup;

  constructor(private thirdService:ThirdService,  private fb: FormBuilder  ) { }

  ngOnInit() {
  }

}
