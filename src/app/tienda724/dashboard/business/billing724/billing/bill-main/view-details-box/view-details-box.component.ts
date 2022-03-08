import {Component, OnInit} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import {BillingService} from '../../../../../../../services/billing.service';
import {MatDialogRef} from '@angular/material';

@Component({
  selector: 'app-view-details-box',
  templateUrl: './view-details-box.component.html',
  styleUrls: ['./view-details-box.component.scss']
})
export class ViewDetailsBoxComponent implements OnInit {

  myDetails;

  constructor(public dialogRef: MatDialogRef<ViewDetailsBoxComponent>, private billingService : BillingService) { }

  ngOnInit() {
    this.openMovementDetailModal();
  }

  closeDialog() {
    this.dialogRef.close();
  }

  openMovementDetailModal(){
    this.billingService.getCajaByIdStatus(localStorage.getItem("id_employee")).subscribe((res)=>{
      this.billingService.getDetailsById(res[0]).subscribe((res2)=>{
        CPrint(res2,"los detallitos")
        this.myDetails = res2;
      })
    })
  }

}
