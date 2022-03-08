import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';
/*
*     models for  your component
*/
import {DocumentType} from '../models/document-type';
/*
*     services of  your component
*/
import {DocumentTypeService} from '../../../../../../services/document-type.service';


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
  selector: 'app-document-filter',
  templateUrl: './document-filter.component.html',
  styleUrls: ['./document-filter.component.css']
})
export class DocumentFilterComponent implements OnInit {

  documentTypes: DocumentType[];
  form: FormGroup;

  // Usamos el decorador Output
  @Output() EmitDocumentType = new EventEmitter();
  public nombre: string;
  public document_type:number;
  public document_number:String;

  checked = false;
 indeterminate = false;
 align = 'start';
 disabled = true;

  constructor(    public docTypeService: DocumentTypeService,
    private fb: FormBuilder ) { }

  ngOnInit() {
    this.getDocumentType();
    this.nombre = "Pueblo de la Toscana";
    this.createControls();

  }

  isChecked(){
    this.disabled=!this.disabled;
  }


  // GET /documents-types
  getDocumentType(): void {

    this.docTypeService.getDocumentTypeList()
      .subscribe((data: DocumentType[]) => this.documentTypes = data,
      error => CPrint(error),
      () => {

      });
  }

  filterThird(event) {
    CPrint("ENTRANDO AL BUSCAR LUPA")
    this.EmitDocumentType.emit({ document_type: this.form.value['document_type'], document_number: this.form.value['document_number'] });
    CPrint("EL EMIT --> ", this.EmitDocumentType)
  }

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
