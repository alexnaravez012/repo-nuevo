import {Component, Inject, OnInit} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import {BillingService} from '../../../../../../../services/billing.service';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
import {AddGeneralProduct} from '../add-general-product/add-general-product.component';

@Component({
  selector: 'app-add-specific-product',
  templateUrl: './add-specific-product.component.html',
  styleUrls: ['./add-specific-product.component.scss']
})
export class AddSpecificProductComponent implements OnInit {

  constructor(public categoriesService: BillingService ,public dialogRef: MatDialogRef<AddSpecificProductComponent>,public dialog: MatDialog,@Inject(MAT_DIALOG_DATA) public data: DialogData) { }
  products;
  codeToPut;
  code;
  isAdmin;
  editingCode;
  codeToPost;
  idThirdFather;
  idProduct;
  idCode;
  productToPost;
  productToPut;
  idCategory;
  editingProduct;
  lastBrand = [];
  brands;
  brandProduct;
  measures;
  lastBrandName = [];
  categoryTitle;


  addGenericProduct(){

    var dialogRef;
              dialogRef = this.dialog.open(AddGeneralProduct, {
                width: '60vw',
                data: {category: this.data.category,measures: this.measures,brands: this.brands,lastBrand: this.lastBrand,editingProduct:this.editingProduct, idCategory: this.idCategory,productToPut: this.productToPut,productToPost: this.productToPost, products: this.products, codeToPut: this.codeToPut, code: this.code, isAdmin: this.isAdmin, editingCode: this.editingCode, idThirdFather: this.idThirdFather, codeToPost: this.codeToPost, idProduct: this.idProduct, idCode: this.idCode
                }
              });

  }

  ngOnInit() {
    this.categoriesService.getGenericMeassureUnits().subscribe(res=>{
      CPrint(res,"meassures");
      this.measures = res
    });
    this.lastBrand = [];
    this.lastBrandName = [];
    this.categoryTitle = this.data.category;
    this.products = this.data.products;
    this.codeToPut = this.data.codeToPut;
    this.code = this.data.code;
    this.isAdmin = this.data.isAdmin;
    this.editingCode = this.data.editingCode;
    this.codeToPost = this.data.codeToPost;
    this.idThirdFather = this.data.idThirdFather;
    this.idProduct = this.data.idgeneric;
    this.idCode = this.data.idcode;
    this.productToPost = this.data.productToPost;
    this.productToPut = this.data.productToPut;
    this.idCategory = this.data.idCategory;
    this.editingProduct = this.editingProduct;
    this.brands = this.data.brands;
    this.addingCode = true;
    this.editingCode = false;
    this.modal7 = true;
  }

  gotoSubBrand(brand){
      this.code.id_brand = brand.id_BRAND;
      this.brandProduct =  brand.brand;
      this.lastBrand.push(brand.id_BRAND);
      this.code.id_brand = brand.id_BRAND;
      this.brandProduct =  brand.brand;
      this.lastBrandName.push(brand.brand);
      if(this.isAdmin){
        this.categoriesService.getBrandsByFather(brand.id_BRAND).subscribe(res=>{
          CPrint(res,"thhe response meassure");
          this.brands = res;
        })
      }else{
        this.categoriesService.getBrandByThirdAndFater(this.idThirdFather,brand.id_BRAND).subscribe(res=>{
          CPrint(res,"thhe response meassure");
          this.brands = res;
        })
      }
  }

  gotoFatherBrand(){
    var father;
    this.brands = [];
    this.lastBrand.pop();
    this.lastBrandName.pop();
    if(this.lastBrand.length !== 0){
      CPrint(this.lastBrand);
      this.code.id_brand = this.lastBrand[this.lastBrand.length -1];
      this.brandProduct =  this.lastBrandName[this.lastBrandName.length -1];
      father = this.lastBrand[this.lastBrand.length - 1];
      if(this.isAdmin){
        this.categoriesService.getBrandsByFather(father).subscribe(res=>{
          CPrint(res,"thhe response meassure");
          this.brands = res;
        })
      }else{
        this.categoriesService.getBrandByThirdAndFater(this.idThirdFather,father).subscribe(res=>{
          this.brands = res;
        })
      }

    }else{
      this.code.id_brand = null;
      this.brandProduct = "";
      if(this.isAdmin){
        this.categoriesService.getBrands().subscribe(res=>{
          CPrint(res,"meassures");
          this.brands = res;
        })
      }else{
        this.categoriesService.getBrandByThird(this.idThirdFather).subscribe(res=>{
          this.brands = res;
        })
      }

    }
  }

  // gotoSubBrand(brand){
  //   this.code.id_brand = brand.id_BRAND;
  //   this.brandProduct =  brand.brand;
  // }

  createProduct(){
    this.productToPut = this.productToPost;
    if(!this.isAdmin){
      this.productToPost.id_third = this.idThirdFather
    }
      this.productToPost.id_category = this.idCategory;

    CPrint(this.editingProduct,"am i editing?");
    if(!this.editingProduct){
      this.categoriesService.postProduct(this.productToPost).subscribe(res=>{
        this.dialogRef.close()
      })
    }else{
      this.categoriesService.putProduct(this.productToPut,this.idProduct).subscribe(res=>{
        this.dialogRef.close()
      })
    }
  }

  modal1 = false;
  modal2 = false;
  modal7 = false;
  modal3 = false;
  modal4 = false;
  modal5 = false;
  addingCode = false;
  taxes = [{id:1,value:0},{id:2,value:10},{id:3,value:19}];

  gotoModal7(product,code){
    this.modal1 = false;
    this.modal2 = false;
    this.modal7 = true;
    this.modal3 = false;
    this.modal4 = false;
    this.modal5 = false;
    this.addingCode = true;
    this.idProduct = product.id_PRODUCT;
    if(code != null){
      this.idCode = code.id_CODE;
      this.editingCode = true;
    }else{
      this.editingCode = false;
    }
  }


  createCode(){
    this.codeToPut={
      id_measure_unit: this.code.id_measure_unit,
      suggested_price: this.code.suggested_price,
      code: this.code.code,
      id_brand: this.code.id_brand
    };
    CPrint(this.code);
    if(!this.isAdmin){
      this.code.id_third = this.idThirdFather;
      this.codeToPost.id_third = this.code.id_third
    }
    this.code.id_product = this.idProduct;

    if(!this.editingCode){
      this.categoriesService.postCode(this.code).subscribe(res=>{
        this.dialogRef.close()
      })
    }else{
      this.categoriesService.putCode(this.codeToPut,this.idCode).subscribe(res=>{
        this.dialogRef.close()
      })
    }
  }

}
export interface DialogData {
  idgeneric: any;
  idcode: any;
  category: any;
  measures: any;
  brands: any;
  lastBrands: any;
  editingProduct: any;
  idCategory: any;
  productToPut: any;
  productToPost: any;
  products: any;
  codeToPut: any;
  code:any;
  isAdmin: any;
  editingCode: any;
  idThirdFather: any;
  codeToPost: any;
  idProduct: any;
  idCode: any;
}
