import {Component, Inject, OnInit} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import {HttpClient} from '@angular/common/http';
import {LocalStorage} from 'src/app/services/localStorage';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material/dialog';
import {BillingService} from '../../../../../../../services/billing.service';
import {Urlbase} from '../../../../../../../shared/urls';

@Component({
  selector: 'app-update-new-product',
  templateUrl: './update-new-product.component.html',
  styleUrls: ['./update-new-product.component.css']
})
export class UpdateNewProductComponent implements OnInit {

  constructor(private httpClient: HttpClient, private locStorage: LocalStorage,
    public dialogRef: MatDialogRef<UpdateNewProductComponent>,public dialog: MatDialog
    ,@Inject(MAT_DIALOG_DATA) public data: DialogData,private categoriesService: BillingService) { }


    measureUnitList;
    SelectedMun = -1;
    SelectedLine = -1;
    SelectedSubCategory = -1;
    SelectedBrand = -1;
    SubCategoryList;
    CategoryFirstLvlList;
    productName;
    brands;

  ngOnInit() {
    CPrint("this is data: ",this.data.element)
    this.getMeasureUnitList();
    this.getFirstLvlCategory();
    this.getBrands();
    this.productName = this.data.element.product_STORE_NAME;
  }

  getSecondLvlCategory(){
    if(this.SelectedLine != -1){
      this.httpClient.get(Urlbase.tienda+"/categories2/children?id_category_father="+this.SelectedLine).subscribe(data => {
        this.SubCategoryList = data
      })
    }
  }

  getFirstLvlCategory(){
    this.categoriesService.getGeneralCategories().subscribe(data => {
      this.CategoryFirstLvlList = data
    })
  }

  getMeasureUnitList(){

    this.categoriesService.getGenericMeassureUnits().subscribe(res=>{
      CPrint(res,"meassures")
      this.measureUnitList = res
    })
  }

  getBrands(){
    this.categoriesService.getBrands().subscribe(res=>{
      CPrint("THIS ARE BRANDS",res);
      this.brands = res;
    })
  }

  updateProduct(){
    this.httpClient.post(Urlbase.tienda + "/resource/updatenewproduct?idps="+this.data.element.id_PRODUCT_STORE+
    "&idproduct="+this.data.element.id_PRODUCT+"&idcode="+this.data.element.id_CODE+"&idms="+this.SelectedMun+"&idb="
    +this.SelectedBrand+"&idcat="+this.SelectedSubCategory+"&psname="+this.productName,{}).subscribe(res=>{
        if(res==1){
            alert("El producto se actualizo exitosamente.")
            this.dialogRef.close({
              done: true
            });
        }else{
            alert("Se encontro un problema actualizando el producto.")
        }
      }
    )

  }

}

export interface DialogData {
  element: any
}
