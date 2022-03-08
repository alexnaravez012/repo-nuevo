import {Component, Inject, OnInit} from '@angular/core';
import {FormBuilder, FormGroup} from '@angular/forms';
/*
*    Material modules for component
*/
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
/*
*     others component
*/
/*
*     models for  your component
*/
import {DocumentDTO} from '../../commons/documentDTO';

// DTO's


declare var $: any

@Component({
  selector: 'app-bill-document',
  templateUrl: './bill-document.component.html',
  styleUrls: ['./bill-document.component.scss']
})
export class BillDocumentComponent implements OnInit {

  form: FormGroup;
  isValue = false;
  is_exit: number;
  type_name: string;

  currentsDetails: any[];
  documentDTO:DocumentDTO;

  constructor(public dialogRef: MatDialogRef<BillDocumentComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder) {
      this.documentDTO= new DocumentDTO(null,null);
      //CPrint("DATA -> ", this.data)
      this.documentDTO=this.data['doc']
      this.type_name=this.data['type_name']

      this.createControls()
    }

  ngOnInit() {
  }

  createControls() {
    this.form = this.fb.group({
      quantity: [''],
      title: [this.documentDTO.title? this.documentDTO.title:"Documento de "+this.type_name],
      body: [this.documentDTO.body]
    })
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  showNotification(from, align, id_type?, msn?) {
    const type = ['', 'info', 'success', 'warning', 'danger'];

    const color = Math.floor((Math.random() * 4) + 1);

    $.notify({
      icon: "notifications",
      message: msn ? msn : "<b>Noficación automatica </b>"

    }, {
        type: type[id_type ? id_type : 2],
        timer: 200,
        placement: {
          from: from,
          align: align
        }
      });
  }

  save() {
    this.documentDTO.body=this.form.value['body']
    this.documentDTO.title=this.form.value['title']
    this.dialogRef.close(this.documentDTO);
  }

}
