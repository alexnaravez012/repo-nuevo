import {Component, OnInit} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import {BillingService} from '../../../../../../../services/billing.service';
import {MatDialog, MatDialogRef, MatTabChangeEvent} from '@angular/material';
import {ProductsOnCategoryComponent2} from '../products-on-category2/products-on-category2.component';
import {ProductsOnStoreComponent} from '../products-on-store/products-on-store.component';
import {LocalStorage} from '../../../../../../../services/localStorage';
import {ThirdService} from '../../../../../../../services/third.service';

@Component({
  selector: 'app-inventarios-factura',
  templateUrl: './bill-inventory-component.component.html',
  styleUrls: ['./bill-inventory-component.component.scss']
})
export class BillInventoryComponentComponent implements OnInit {
  productList;
  generalCategories;
  subcategories;
  modal1 = true;
  modal2 = false;
  modal3 = false;
  id_employee;
  subCategoryTitle;
  categories;
  products;
  allCategories;
  allProducts;
  myProducts;
  stores;
  currentStore;
  currentStorage;
  idThirdFather;
  currentStorages;
  productsOnCategory;
  categoryStack = [];
  selectedTab = 0;
  currentCategory;
  currentCategoryID =0;
  constructor(public dialogRef: MatDialogRef<BillInventoryComponentComponent>, public dialog: MatDialog, private storeService: BillingService, private locStorage: LocalStorage, private thirdService: ThirdService) { }
 
  ngOnInit() {
    this.currentCategory = null;
    this.categoryStack = [];
    this.productsOnCategory = [];
    console.log("THIS IS THIRD INFO, ", this.locStorage.getToken().id_third_father)
    this.idThirdFather = this.locStorage.getToken().id_third_father;
    this.storeService.getGeneralCategories().subscribe(res=>{
      this.generalCategories = res;
      CPrint(this.generalCategories,"theressssssss");
        this.storeService.getStoresByThird(this.idThirdFather).subscribe(res=>{
          this.stores = res;
          CPrint(this.stores)
        })
    });
    
    this.currentStorage = [];
  }

  tabChanged = (tabChangeEvent: MatTabChangeEvent): void => {
    CPrint('tabChangeEvent => ', tabChangeEvent);
    CPrint('index => ', tabChangeEvent.index);
    this.selectedTab = tabChangeEvent.index;
    this.currentCategory = null;
    this.categoryStack = [];
    this.productsOnCategory = [];

        this.idThirdFather = this.locStorage.getToken().id_third_father;
        this.storeService.getStoresByThird(this.locStorage.getToken().id_third_father).subscribe(res=>{
          this.stores = res;
          CPrint(this.stores)
        });
        this.storeService.getGeneralCategories().subscribe(res=>{
          this.generalCategories = res;
        })

    this.currentStorage = [];
  };

  gotoModal3(){
    this.modal1 = false;
    this.modal2 = false;
    this.modal3 = true;
  }

  gotoModal2(){
    this.modal1 = false;
    this.modal2 = true;
    this.modal3 = false;
  }
  gotoModal1(){
    this.modal2 = false;
    this.modal1 = true;
    this.modal3 = false;
  }
  async getIdEmployee(){
    this.id_employee = this.locStorage.getPerson().id_person;

  }

  async popCategory(){
    this.categoryStack.pop();
  }

  gotoFatherCategory(){
    this.popCategory().then(res=>{
      CPrint(this.categoryStack,"categorystact");
      CPrint(this.categoryStack.length);

      if(this.categoryStack.length > 0){
        CPrint(this.categoryStack[this.categoryStack.length - 1].id_CATEGORY);
        if(this.categoryStack[this.categoryStack.length - 1].name){
          this.currentCategory = this.categoryStack[this.categoryStack.length - 1].name;
        }else{
          this.currentCategory = this.categoryStack[this.categoryStack.length - 1].category;
        }
        this.storeService.getCategoryByThirdCategory(this.idThirdFather,this.categoryStack[this.categoryStack.length - 1].id_CATEGORY).subscribe(res=>{
          this.generalCategories = res;
          CPrint(res)
        })
      }else{
        this.currentCategory = null;
        (CPrint("is 0"));
        this.storeService.getGeneralCategories().subscribe(res=>{
          this.generalCategories = res;
          CPrint(res)
        })
      }
    })

  }

  loadStore(store){
    this.currentStore = store;
    this.storeService.getStoragesByStore(store.id_STORE).subscribe(res=>{
      const dialogRef = this.dialog.open(ProductsOnStoreComponent, {
        height: '450px',
        width: '600px',
        data: {
          currentStorages: res, storeName: store.store_NAME
        }
      });
    })
  }

  gotoProductsCategory(){
    console.log("idcat: ", this.categoryStack[this.categoryStack.length - 1].id_CATEGORY, "idfather: ",this.idThirdFather)
    this.storeService.getProductsByCategoryThird(this.categoryStack[this.categoryStack.length - 1].id_CATEGORY,this.idThirdFather).subscribe(res=>{
      CPrint("This is res, ", res);
      if(JSON.stringify(res) != "[]"){
      let dialogRef = this.dialog.open(ProductsOnCategoryComponent2,{
        height: '450px',
        width: '850px',
        data: {
          productsOnCategory: res, category: this.currentCategory
        }
      });
      dialogRef.afterClosed().subscribe(response => {
        const code = this.locStorage.getCodigoBarras();
        if(code != "-1"){
          this.dialogRef.close()
        }else{
          CPrint("NO LA CIERRO")
        }
      })
      }
    })
  }

  loadCategory(category){
    this.categoryStack.push(category);
    if(category.name){
      this.currentCategory = category.name;
    }else{
      this.currentCategory = category.category;
    }
    CPrint(category.name);
    CPrint(category);
    this.storeService.getCategoryByThirdCategory(this.idThirdFather,category.id_CATEGORY).subscribe(res=>{
      this.generalCategories = res;
      CPrint(res,"categories")
    });
    this.storeService.getProductsByCategoryThird(category.id_CATEGORY,this.idThirdFather).subscribe(res=>{
      this.productsOnCategory = res;
      this.gotoProductsCategory();
      CPrint(res)
    })
  }

  // setBackButtonAction(){
  //   this.navBar.backButtonClick = () => {
  //   if(this.modal2 || this.modal3){
  //     this.gotoModal1()
  //     this.currentStorage = [];
  //   }else{
  //     this.navCtrl.pop();
  //   }
  //   }
  // }

  addProduct(product){
    this.myProducts.push(product);
    product.selected = true;
  }

  deleteProduct(product){
    const currentProduct = product;
    this.myProducts.splice(this.myProducts.indexOf(product),1);
    currentProduct.selected = true;
    this.allProducts[this.allProducts.indexOf(currentProduct)].selected = false;
  }

  addCategory(){
    this.myProducts = [];
    this.allProducts.forEach(item=>{
      item.selected = false;
    });
    this.gotoModal1();
  }

  // addByBarcode(){
  //   var alert = this.alertCtrl.create({title: "Escaneando código de barra",
  //   subTitle: "Escanea o ingresa un código de barras",
  //   buttons:["Cancelar"]});
  //   alert.present();
  // }

  showStorage(storage){
    this.storeService.getProductsByStorage(storage.id_storage).subscribe(res=>{
      CPrint(res);
      this.currentStorage = res;

    })

  }

}
