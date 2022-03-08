import {Component, OnInit} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import {BillingService} from '../../../../../../../services/billing.service';
import {MatDialog, MatTabChangeEvent} from '@angular/material';
import {AddCategoryComponent} from '../add-category/add-category.component';
import {AddBrandComponent} from '../add-brand/add-brand.component';
import {AddMeasureComponent} from '../add-measure/add-measure.component';
import {AddProductModalComponent} from '../add-product-modal/add-product-modal.component';
import {LocalStorage} from '../../../../../../../services/localStorage';
import {ThirdService} from '../../../../../../../services/third.service';
import {Router} from '@angular/router';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  idThirdFather;
  currentThird;
  productList;
  generalCategories;
  subcategories;
  modal1 = true;
  modal2 = false;
  modal3 = false;
  modal4 = false;
  modal5 = false;
  modal6 = false;
  id_employee;
  subCategoryTitle;
  categories;
  products;
  allCategories;
  allProducts;
  myProducts;
  editing;
  idCategory2;
  taxes;
  role;
  isAdmin;
  brands;
  measures;
  token;
  lastMeasure;
  lastBrand;
  measureToPost;
  brandToPost;
  editingBrand;
  brandToEdit;
  editingMeasure;
  measureToEdit;
  categoryToPost;
  categoryStack;
  categoryToPut;
  productToPost;
  productToPut;
  editingProduct;
  editingProductG;
  idCategory;
  idProduct;
  modal7;
  code;
  codeToPut;
  codeToPost;
  editingCode;
  idCode;
  addingCode;
  selectedBrand;
  brandProduct;
  currentCategory;


  constructor(public router: Router,public dialog: MatDialog,private categoriesService: BillingService, private locStorage: LocalStorage, private thirdService: ThirdService) { }

  id_menu=149;

  ngOnInit() {

    //PROTECCION URL INICIA
    CPrint(JSON.stringify(this.locStorage.getMenu()))
    const elem = this.locStorage.getMenu().find(item => item.id_menu == this.id_menu);

    if(!elem){
      this.router.navigateByUrl("/dashboard/business/movement/nopermision");
    }
    //PROTECCION URL TERMINA

    this.lastTitle = [];
    this.editingProductG = false;
    this.code = {
    code: "",
    id_product: null,
    id_measure_unit: null,
    //id_third: null,
    suggested_price: "",
    id_brand: null
  }
  this.modal7 = false;
  this.editingProduct  = false;
  this.lastBrand = [];
  this.lastMeasure = [];
  this.productToPost = {
    id_category:null,
    id_tax:null,
    productName:"",
    productDescription:""
  }
  this.measureToPost = {
    MUName:"",
    MUDescription:"",
    id_measure_unit_father: null,
    id_third:null
  }
  this.brandToPost ={
      brand:"",
      id_brand_father:null,
      id_third:null,
      url_img:""
    }
  this.categoryToPost ={
    img_url: "",
    categoryDescription: "",
    categoryName: ""
  }
  this.editingBrand = false;
  this.editingMeasure = false;
  this.brandToEdit = {};
  this.measureToEdit = {};

  this.categoriesService.getGeneralCategories().subscribe(res=>{
    this.generalCategories = res;
    CPrint("THIES IS RES: ",res)
  })

  this.categoriesService.getGenericMeassureUnits().subscribe(res=>{
    CPrint(res,"meassures")
    this.measures = res
  })
  this.categoriesService.getBrands().subscribe(res=>{
    CPrint("THIS ARE BRANDS",res);
    this.brands = res;
  })


  this.isAdminFunction().then(res=>{
    CPrint(this.token,"theidthirdfather")
    this.isAdmin = false;
    this.role = this.token.roles;
    this.setRole(this.role).then(res=>{
 
        this.idThirdFather = this.locStorage.getToken().id_third_father;
        if(this.isAdmin){

        }else{
          this.categoriesService.getCategoryByThird(this.idThirdFather).subscribe(res=>{
            this.generalCategories = res;
          })
          this.categoriesService.getMeassureByThird(this.idThirdFather).subscribe(res=>{
            CPrint(res,"meassures")
            this.measures = res;
          })
          this.categoriesService.getBrandByThird(this.idThirdFather).subscribe(res=>{
            this.brands = res;
          })
        }
      });

    })

  this.categoryStack = []
  //this.brands = ["Alpina","Aguila","Coca-Cola"]
  this.taxes = [{id:1,value:0},{id:2,value:10},{id:3,value:19}]
  //this.measures = ["ml","g","kg","und"]
  this.subCategoryTitle = null;
  this.editing = false;
  this.productList = [{title:"Cerveza poker",presentation:"250ml",price:2000},{title:"Cerveza águila",presentation:"250ml",price:1500},{title:"Cerveza poker",presentation:"750ml",price:8000},{title:"Coca Cola",presentation:"250ml",price:1500}]
  this.myProducts = []
  this.products = [{
    submenu: false,
    title: "Cerveza",
    subproduct: [{title:"Cerveza poker",presentation:"250ml",price:2000},{title:"Cerveza águila",presentation:"250ml",price:1500},{title:"Cerveza poker",presentation:"750ml",price:8000}]
  },{
    submenu: false,
    title: "Gaseosas",
    subproduct: [{title:"Coca Cola",presentation:"250ml",price:1500}]
  }]
  // this.getIdEmployee().then(res =>{
  //   this.categoriesService.getCategoryByThird(this.id_employee).subscribe(res=>{
  //     CPrint(res);
  //     this.generalCategories = res;
  //   })
  // })
  this.allProducts = [{title:"Coca Cola",presentation:"250ml",price:1500,selected:false},{title:"Cerveza poker",presentation:"250ml",price:2000,selected:false},{title:"Cerveza águila",presentation:"250ml",price:1500,selected:false},{title:"Cerveza poker",presentation:"750ml",price:8000,selected:false}]
  this.allCategories = [{category: "Bebidas"},{category: "Snacks"},{category: "Aseo"},{category: "Licores"},{category: "Empaquetados"},{category: "Hogar"},{category: "Industrial"}]
  //this.generalCategories = [{category: "Bebidas"},{category: "Snacks"},{category: "Aseo"}]
  CPrint('ionViewDidLoad CategoriesPage');
  //this.setBackButtonAction();
  // this.initializeBackButtonCustomHandler();


//   ionViewWillLeave() {
//     // Unregister the custom back button action for this page
//     this.unregisterBackButtonAction && this.unregisterBackButtonAction();
//   }

//   initializeBackButtonCustomHandler(): void {
//     this.unregisterBackButtonAction = this.platform.registerBackButtonAction(function(event){
//         CPrint('Prevent Back Button Page Change');
//     }, 101);
// }


  }
  selectedTab = 0;
  tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
    CPrint('tabChangeEvent => ', tabChangeEvent);
    CPrint('index => ', tabChangeEvent.index);
    this.selectedTab = tabChangeEvent.index;
  }

  gotoModal5(){
    this.modal1 = false;
    this.modal2 = false;
    this.modal5 = true;
    this.modal3 = false;
    this.modal4 = false;
  }

  gotoModal4(){
    this.modal1 = false;
    this.modal2 = false;
    this.modal4 = true;
    this.modal3 = false;
    this.modal5 = false;
  }

  gotoModal3(){
    this.modal1 = false;
    this.modal2 = false;
    this.modal3 = true;
    this.modal4 = false;
    this.modal5 = false;
  }

  gotoModal2(){
    this.modal1 = false;
    this.modal2 = true;
    this.modal3 = false;
    this.modal4 = false;
    this.modal5 = false;
  }
  gotoModal1(){
    this.modal2 = false;
    this.modal1 = true;
    this.modal3 = false;
    this.modal4 = false;
    this.modal5 = false;
  }
  async getIdEmployee(){
    this.id_employee = JSON.parse(localStorage.getItem("currentPerson")).id_person

  }

  loadProduct(result){
    this.categoriesService.getProductsByCategory(result.id_PRODUCT).subscribe(res=>{
      result.subproduct = res;
    })
  }

  gotoSubMeasure(measure){
    if(this.editingMeasure){
      this.measureToPost.MUName = measure.measure_UNIT;
      this.measureToPost.MUDescription = measure.description;
      this.measureToPost.id_measure = measure.id_MEASURE_UNIT;
      if(measure.id_measure_unit_father){
        this.measureToPost.id_measure_unit_father = measure.id_measure_unit_father;
      }
      this.gotoAddMeasure();
    }else{
      CPrint(measure,"the measure",this.lastMeasure)
      this.lastMeasure.push(measure.id_MEASURE_UNIT);
      if(this.isAdmin){
        this.categoriesService.getMeassureUnitsByFather(measure.id_MEASURE_UNIT).subscribe(res=>{
          CPrint(res,"thhe response meassure");
          this.measures = res;
        })
      }else{
        this.categoriesService.getMeassureByThirdAndFater(this.idThirdFather,measure.id_MEASURE_UNIT).subscribe(res=>{
          CPrint(res,"thhe response meassure");
          this.measures = res;
        })
      }
    }

  }

  gotoSubBrand(brand){
    if(this.editingBrand){
      this.brandToPost = brand;
      this.brandToPost.url_img = this.brandToPost.url_IMG
      this.gotoAddBrand();
    }else{
      this.lastBrand.push(brand.id_BRAND);
      this.code.id_brand = brand.id_BRAND;
      this.brandProduct =  brand.brand;
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
      }}
  }

  gotoFatherMeasure(){
    var father;
    this.measures = [];
    this.lastMeasure.pop();
    if(this.lastMeasure.length !== 0){
      father = this.lastMeasure[this.lastMeasure.length - 1];
      if(this.isAdmin){
        this.categoriesService.getMeassureUnitsByFather(father).subscribe(res=>{
          CPrint(res,"thhe response meassure");
          this.measures = res;
        })
      }else{
        this.categoriesService.getMeassureByThirdAndFater(this.idThirdFather,father).subscribe(res=>{
          this.measures = res;
        });
      }

    }else{
      if(this.isAdmin){
        this.categoriesService.getGenericMeassureUnits().subscribe(res=>{
          CPrint(res,"meassures")
          this.measures = res
        })
      }else{
        this.categoriesService.getMeassureByThird(this.idThirdFather).subscribe(res=>{
          this.measures = res;
        })
      }

    }
  }

  gotoFatherBrand(){
    var father;
    this.brands = [];
    this.lastBrand.pop();
    if(this.lastBrand.length !== 0){
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
          CPrint(res,"meassures")
          this.brands = res;
        })
      }else{
        this.categoriesService.getBrandByThird(this.idThirdFather).subscribe(res=>{
          this.brands = res;
        })
      }

    }
  }

  gotoFatherCategory(){
    var father;
    this.generalCategories = [];
    this.categoryStack.pop();
    this.lastTitle.pop();

    if(this.categoryStack.length !== 0){
      father = this.categoryStack[this.categoryStack.length - 1];
      this.subCategoryTitle = this.lastTitle[this.lastTitle.length - 1]
      if(this.isAdmin){
        this.categoriesService.getCategoryByFather(father).subscribe(res=>{
          CPrint("this is res",res)
          this.generalCategories = res;
          //this.subcategories = res;
        })
      }else{
        this.categoriesService.getCategoryByThirdCategory(this.idThirdFather,father).subscribe(res=>{
          //this.subcategories = res;
          this.generalCategories = res
        })
      }


    }else{
      this.subCategoryTitle = null;
      if(this.isAdmin){
        this.categoriesService.getGeneralCategories().subscribe(res=>{
          CPrint("this is res",res)
          this.generalCategories = res;
          //this.subcategories = res;
        })
      }else{
        this.categoriesService.getCategoryByThird(this.idThirdFather).subscribe(res=>{
          //this.subcategories = res;
          this.generalCategories = res
        })}
    }
  }
  lastTitle = [];

loadCategory(category){
  if(!this.editing){
    this.generalCategories = [];
    this.subCategoryTitle = category.category
    var idCategory = category.id_CATEGORY;
    this.idCategory = category.id_CATEGORY;
    this.lastTitle.push(category.category);
    this.products = [];
    this.categoryStack.push(category.id_CATEGORY)

    CPrint(idCategory,"idcategory")
    this.categoriesService.getProductsByCategory(idCategory).subscribe(res=>{
      CPrint(res,"productsw");
      this.products = res;
      this.products.forEach(item=>{
        CPrint(item,"theitem");
        item.submenu = false;
        this.categoriesService.getSubproductsByCategory(item.id_PRODUCT).subscribe(res=>{
          CPrint(res);
          item.subproduct = res;
        })
        CPrint(this.products);
      })

    })
    if(this.isAdmin){
      this.categoriesService.getCategoryByFather(category.id_CATEGORY).subscribe(res=>{
        CPrint(res)
        this.generalCategories = res;
        //this.subcategories = res;
      })
    }else{
      this.categoriesService.getCategoryByThirdCategory(this.idThirdFather,category.id_CATEGORY).subscribe(res=>{
        //this.subcategories = res;
        this.generalCategories = res
      })
    }
  }else{
    this.editCategory(category);
  }

}

addProduct(product){
  this.myProducts.push(product);
  product.selected = true;
}

deleteProduct(product){
  var currentProduct = product;
  this.myProducts.splice(this.myProducts.indexOf(product),1);
  currentProduct.selected = true;
  this.allProducts[this.allProducts.indexOf(currentProduct)].selected = false;
}

gotoAddCategory(){
  this.categoryToPut = this.categoryToPost;
  if(!this.isAdmin){
    this.categoryToPost.id_third_category = this.idThirdFather
  }

  if(this.categoryStack.length > 0){
    this.categoryToPost.id_category_father = this.categoryStack[this.categoryStack.length-1]
  }
  CPrint(this.editing,"am i editing?")

  var dialogRef
      dialogRef = this.dialog.open(AddCategoryComponent,{
        height: '450px',
        width: '600px',
        data: {
          categoryToPut: this.categoryToPut, categoryToPost: this.categoryToPost, editing: this.editing, idCategory2: this.idCategory2
        }
      })
  dialogRef.afterClosed().subscribe(res=>{
    this.editing = false;
    this.ngOnInit()
  })
}



addCategory(){
  this.myProducts = [];
  this.allProducts.forEach(item=>{
    item.selected = false;
  })
  this.gotoModal1();
}

createCategory(){
  this.gotoModal3();
  this.subCategoryTitle = ""
  this.editing = false;
}

cancelEditing(){
  this.categoryToPost ={
    img_url: "",
    categoryDescription: "",
    categoryName: ""
  }
  this.editing = false;


}

cancelEditingBrand(){
  this.brandToPost ={
    brand:"",
    id_brand_father:null,
    id_third:null,
    url_img:""
  }
  this.editingBrand = false;


}

cancelEditingCode(){
  this.code = {
    code: "",
    id_product: null,
    id_measure_unit: null,
    //id_third: null,
    suggested_price: ""
  }
  this.editingCode = false;


}

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

cancelEditingMeassure(){
  this.measureToPost = {
    MUName:"",
    MUDescription:"",
    id_measure_unit_father: null,
    id_third:null
  }
  this.editingMeasure = false;


}

cancelEditingProduct(){
  this.productToPost = {
    id_category:null,
    id_tax:null,
    productName:"",
    productDescription:""
  }
  this.editingProduct = false;


}

editCategory(category){
  this.editing = true;
  this.idCategory2 = category.id_CATEGORY;
  this.categoryToPost.categoryName = category.category
  this.gotoAddCategory();
}

async isAdminFunction(){
  this.token = this.locStorage.getToken();
  //this.idThirdFather = this.token.id_third_father;
}

async setRole(role){
  role.forEach(element=>{
    CPrint(element,"element")
    if(element.id_rol===21 || element.id_rol===9999 || element.id_rol===7777 || element.id_rol === 8888){
      CPrint("isAdmin")
      this.isAdmin = true;
    }});

}

async changeMeasureToPost(){
  CPrint(this.lastMeasure);
  if(!this.isAdmin){
    this.measureToPost.id_third = this.idThirdFather
  }
  if(this.lastMeasure.length > 0){
    this.measureToPost.id_measure_unit_father = this.lastMeasure[this.lastMeasure.length - 1]
  }
}

gotoAddMeasure(){
  this.changeMeasureToPost().then(res=>{

  })
  var dialogRef
  dialogRef = this.dialog.open(AddMeasureComponent,{
    height: '450px',
    width: '600px',
    data: {
      measureToPost: this.measureToPost, lastMeasure: this.lastMeasure, editingMeasure: this.editingMeasure, measureToEdit: this.measureToEdit
    }
  })
  dialogRef.afterClosed().subscribe(res=>{
    this.editingMeasure = false
    this.ngOnInit();
  })

}

gotoAddMeasure2(id,name,description,father){
  this.changeMeasureToPost().then(res=>{

  })
  this.measureToPost.id_measure = id;
  this.measureToPost.MUDescription = description;
  this.measureToPost.MUName = name;
  this.measureToPost.id_measure_unit_father = father;
  var dialogRef
  dialogRef = this.dialog.open(AddMeasureComponent,{
    height: '450px',
    width: '600px',
    data: {
      measureToPost: this.measureToPost, lastMeasure: this.lastMeasure, editingMeasure: true, measureToEdit: this.measureToEdit
    }
  })
  dialogRef.afterClosed().subscribe(res=>{
    this.ngOnInit();
  })

}

createMeassureUnit(){
  this.changeMeasureToPost().then(res=>{
    CPrint(this.measureToPost);
    CPrint(this.lastMeasure);
    if(!this.editingMeasure){
      this.categoriesService.postMeasureUnit(this.measureToPost).subscribe(res=>{
        this.gotoModal1();
        this.ngOnInit();
      });

    }else{
      this.measureToEdit.MUDescription = this.measureToPost.MUDescription;
      this.measureToEdit.MUName = this.measureToPost.MUName;
      if(this.measureToPost.id_measure_unit_father){
        this.measureToEdit.id_measure_unit_father = this.measureToPost.id_measure_unit_father
      }
      CPrint(this.measureToEdit);
      this.categoriesService.putMeasureUnit(this.measureToEdit,this.measureToPost.id_measure).subscribe(res=>{
        this.gotoModal1();
        this.ngOnInit();
      })
    }

  })

}
editProduct(product){
  this.productToPost.productName = product.product;
  this.productToPost.productDescription = product.description;
  this.idProduct = product.id_PRODUCT;
  this.editingProduct = true;
  //this.gotoModal6();
}

editCode(code){
  this.productToPost.productName = code.product;
  this.productToPost.productDescription = code.description;
  this.idProduct = code.id_PRODUCT;
  this.editingCode = true;
  //this.gotoModal6();
}



async changeBrandToPost(){
  CPrint(this.lastBrand);
  if(!this.isAdmin){
    this.brandToPost.id_third = this.idThirdFather
  }
  if(this.lastBrand.length > 0){
    this.brandToPost.id_brand_father = this.lastBrand[this.lastBrand.length - 1]
  }
}
gotoAddBrand(){
  this.changeBrandToPost().then(res=>{
  })
  var dialogRef
  dialogRef = this.dialog.open(AddBrandComponent,{
    height: '450px',
    width: '600px',
    data: {
      brandToPost: this.brandToPost, lastBrand: this.lastBrand, editingBrand: this.editingBrand, brandToEdit: this.brandToEdit
    }
  })
  dialogRef.afterClosed().subscribe(res=>{
    this.editingBrand = false
    this.ngOnInit();
  })

}



createBrand(){
  this.changeBrandToPost().then(res=>{
    CPrint(this.brandToPost);
    CPrint(this.lastBrand);
    if(this.editingBrand){
      this.brandToEdit.url_img = this.brandToPost.url_IMG;
      this.brandToEdit.brand = this.brandToPost.brand;
      this.categoriesService.putBrand(this.brandToEdit,this.brandToPost.id_BRAND).subscribe(res=>{
        this.gotoModal1();
        this.ngOnInit();
      })
    }else{
      this.categoriesService.postBrand(this.brandToPost).subscribe(res=>{
        this.gotoModal1();
        this.ngOnInit();
      });
    }

  })

}

createProduct(){
  this.productToPut = this.productToPost;
  if(!this.isAdmin){
    this.productToPost.id_third = this.idThirdFather
  }
    this.productToPost.id_category = this.idCategory

  CPrint(this.editingProduct,"am i editing?")
  if(!this.editingProduct){
    this.categoriesService.postProduct(this.productToPost).subscribe(res=>{
      this.gotoModal1();
      this.ngOnInit();
    })
  }else{
    this.categoriesService.putProduct(this.productToPut,this.idProduct).subscribe(res=>{
      this.gotoModal1();
      this.ngOnInit();
    })
  }
  CPrint(this.categoryToPost);
}
gotoAddModal(){
  var dialogRef
  dialogRef = this.dialog.open(AddProductModalComponent,{
    height: '450px',
    width: '600px',
    data: {
      category: this.subCategoryTitle,measures: this.measures,brands: this.brands,lastBrand: this.lastBrand,editingProduct:this.editingProduct, idCategory: this.idCategory,productToPut: this.productToPut,productToPost: this.productToPost, products: this.products, codeToPut: this.codeToPut, code: this.code, isAdmin: this.isAdmin, editingCode: this.editingCode, idThirdFather: this.idThirdFather, codeToPost: this.codeToPost, idProduct: this.idProduct, idCode: this.idCode
    }
  })
dialogRef.afterClosed().subscribe(res=>{
  this.ngOnInit();
})
}

createCode(){
  this.codeToPut={
    id_measure_unit: this.code.id_measure_unit,
    suggested_price: this.code.suggested_price,
    code: this.code.code,
    id_brand: this.code.id_brand
  };
  CPrint(this.code)
  if(!this.isAdmin){
    this.code.id_third = this.idThirdFather
    this.codeToPost.id_third = this.code.id_third
  }
  this.code.id_product = this.idProduct;

  if(!this.editingCode){
    this.categoriesService.postCode(this.code).subscribe(res=>{
      this.gotoModal1();
      this.ngOnInit();
    })
  }else{
    this.categoriesService.putCode(this.codeToPut,this.idCode).subscribe(res=>{
      this.gotoModal1();
      this.ngOnInit();
    })
  }
  CPrint(this.categoryToPost);
}




    // this.initializeBackButtonCustomHandler();


//   ionViewWillLeave() {
//     // Unregister the custom back button action for this page
//     this.unregisterBackButtonAction && this.unregisterBackButtonAction();
//   }

//   initializeBackButtonCustomHandler(): void {
//     this.unregisterBackButtonAction = this.platform.registerBackButtonAction(function(event){
//         CPrint('Prevent Back Button Page Change');
//     }, 101);
// }


createNewCategory(){
  this.categoryToPut = this.categoryToPost;
  if(!this.isAdmin){
    this.categoryToPost.id_third_category = this.idThirdFather
  }

  if(this.categoryStack.length > 0){
    this.categoryToPost.id_category_father = this.categoryStack[this.categoryStack.length-1]
  }
  CPrint(this.editing,"am i editing?")
  if(!this.editing){
    this.categoriesService.postCategory(this.categoryToPost).subscribe(res=>{
      this.gotoModal1();
      this.ngOnInit();
    })
  }else{
    this.categoriesService.putCategory(this.categoryToPut,this.idCategory2).subscribe(res=>{
      this.gotoModal1();
      this.ngOnInit();
    })
  }
  CPrint(this.categoryToPost);
}

}


