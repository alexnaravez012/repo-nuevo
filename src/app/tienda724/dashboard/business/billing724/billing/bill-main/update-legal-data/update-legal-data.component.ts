import {Component, OnInit} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import {ThirdService} from '../../../../../../../services/third.service';
import { LocalStorage } from 'src/app/services/localStorage';

@Component({
  selector: 'app-update-legal-data',
  templateUrl: './update-legal-data.component.html',
  styleUrls: ['./update-legal-data.component.scss']
})
export class UpdateLegalDataComponent implements OnInit {
  legalData;
  idThirdFather;
  constructor(private thirdService: ThirdService, private locStorage: LocalStorage) { }

  ngOnInit() {

      this.idThirdFather = this.locStorage.getToken().id_third_father;
      this.thirdService.getIdLegalDataByThird(this.idThirdFather).subscribe(res=>{
        this.thirdService.getLegalData(res).subscribe(res2=>{
          CPrint(res)
          this.legalData = res;
        })
    })
  }

}
