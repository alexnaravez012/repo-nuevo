import {Component, EventEmitter, Inject, OnInit, Output} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
import {MAT_DIALOG_DATA, MatDialogRef} from '@angular/material';
/*
*     models for  your component
*/
import {DocumentType} from '../../../thirds724/document-type/models/document-type';
/*
*     services of  your component
*/
import {DocumentTypeService} from '../../../../../../services/document-type.service';
import {ThirdService} from '../../../../../../services/third.service';
/*
*     constant of  your component
*/
import {InventoriesService} from '../../../../../../services/inventories.service';


/*
*    Material modules for component
*/

/*
*     others component
*/


@Component({
  selector: 'app-bill-dialog-third',
  templateUrl: './bill-dialog-third.component.html',
  styleUrls: ['./bill-dialog-third.component.scss']
})
export class BillDialogThirdComponent implements OnInit {


  documentTypes: DocumentType[];
  form: FormGroup;

  // Usamos el decorador Output
  @Output() EmitDocumentType = new EventEmitter();
  public nombre: string;
  public document_type: number;
  public document_number: String;

  checked = false;
  indeterminate = false;
  align = 'start';
  disabled = true;

  thirdSearched : any;

  constructor(
    public dialogRef: MatDialogRef<BillDialogThirdComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any, private fb: FormBuilder,
    public inventoriesService: InventoriesService,
    private thirdService: ThirdService, public docTypeService: DocumentTypeService) {
      this.thirdSearched = null;
     }

  ngOnInit() {
    this.getDocumentType();
    this.nombre = "Pueblo de la Toscana";
    this.createControls();

  }

  isChecked() {
    this.disabled = !this.disabled;
  }


  // GET /documents-types
  getDocumentType(): void {

    this.docTypeService.getDocumentTypeList()
      .subscribe((data: DocumentType[]) => this.documentTypes = data,
      error => CPrint(error),
      () => {

      });
  }

  // filterThird() {
  //   let response: any[];

  //   //CPrint("type doc --> ", this.form.value['document_type']);
  //   //CPrint("doc number--> ", this.form.value['document_number']);


  //   this.thirdService.getThirdList(null, null, +this.form.value['document_type'], this.form.value['document_number'])

  //     .subscribe((data: any[]) => response = data,
  //     error => { //CPrint(error)
  //     },
  //     () => {
  //       if (response.length > 0) {
  //         //CPrint("RESPONSE THIRD TIENDA --> ", response)
  //         this.thirdSearched = response;

  //         this.dialogRef.close(this.thirdSearched);
  //       } else {

  //         if(localStorage.getItem("SesionExpirada") != "true"){ alert("Tercero no encontrado");}

  //         // this.thirdService.getThirdList(null, null, null, null, +this.form.value['document_type'], this.form.value['document_number'])

  //         //   .subscribe((data: any[]) => response = data,
  //         //   error => { //CPrint(error) },
  //         //   () => {
  //         //     if (response.length > 0) {
  //         //       //CPrint("RESPONSE THIRD PERSONA--> ", response)
  //         //     } else {
  //         //       //CPrint("tercero no encontradOO")
  //         //     }

  //         //   })
  //       }
  //     })

  // }

  createControls() {
    this.form = this.fb.group({
      document_type: ['', Validators.compose([
        Validators.required
      ])],
      document_number: ['', Validators.compose([

      ])],
    });
  }



}
