import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { SessionManagerService } from 'src/app/services/sessionManager/session-manager.service';
import { Urlbase } from '../../classes/urls';

@Component({
  selector: 'app-add-products-mesa',
  templateUrl: './add-products-mesa.component.html',
  styleUrls: ['./add-products-mesa.component.scss']
})
export class AddProductsMesaComponent implements OnInit {

  constructor(private httpClient : HttpClient,
              private sessionManager : SessionManagerService,
              private router: Router,) { }

  private headers = new HttpHeaders({
    'Content-Type': 'application/json'
  });
  obj: any;
  objMesa: any;
  EstadoBusquedaProducto = -1;
  listaElem : any[] = [];
  inventoryList: any[] = [];
  inputForCode:any = "";
  productsObject:any = [];
  disableDoubleClickSearch = false;
  storageList:any;
  taxesList:any;
  api_uri = Urlbase.tienda;
  categories:any;
  inventorylistCopy:any[] = [];
  selectedCategoryName="TODAS";
  selectedCategory = -1;
  subCategoryList:any;
  subCategoryName:any="";
  selectedSubCategory:any;
  rolList:any;
  username:any;
  clientName:any;
  commonStateDTO:any = {

    state:Number,
    creation_date:Date,
    update_date:Date,

};

  ngOnInit(): void {
    this.objMesa = this.sessionManager.returnMesa();
    this.getInventoryList();
    this.getStorages();
    this.getCategories();
    this.obj = this.sessionManager.returnIdObject();
    this.rolList = this.obj.roles;
    this.clientName = this.obj.third.fullname;
    this.username = this.obj.usuario;
  }

  getRolString(){
    let response = "";
    this.rolList.forEach((i: { rol: string; }) => {
      response = response + i.rol+"/ "
    });
    return response;
  }

  getStoreName(){
    return this.sessionManager.returnStoreName();
  }

  goToMesa(){
      this.router.navigate(['detailmesa']);
  }

  getInventoryList(){
    this.httpClient.get(Urlbase.tienda+"/products2/inventoryListActivos?id_store="+this.sessionManager.returnIdStore(),{ headers: this.headers,withCredentials:true }).subscribe(data => {
      //@ts-ignore
      this.inventoryList = data;
      //@ts-ignore
      this.inventorylistCopy = data;

      if(this.inventoryList.length>=100){
        this.listaElem = this.inventoryList.slice(0,100)
      }else{
        this.listaElem = this.inventoryList
      }
      },
      (error: any) =>{
        //console.log(error);
      },
      () => {
      if (this.inventoryList.length > 0) {

      }
    });

  }

  getStorages() {
    this.httpClient.get(Urlbase.tienda + "/store/s?id_store="+this.sessionManager.returnIdStore(),{ headers: this.headers,withCredentials:true }).subscribe((res)=>{
      this.storageList = res;
    });

  }

  getCategories() {
    this.httpClient.get(Urlbase.tienda + "/products2/categoryNodes?id_store="+this.sessionManager.returnIdStore(),{ headers: this.headers,withCredentials:true }).subscribe((res)=>{
      this.categories = res;
      this.setCategoryAll();
      console.log(res)
    });

  }


  setCategoryAll(){
    this.selectedCategoryName="TODAS"
    this.selectedCategory = -1;
    this.subCategoryList = [];
    this.inventoryList = this.inventorylistCopy;
    if(this.inventoryList.length>=100){
      this.listaElem = this.inventoryList.slice(0,100);
    }else{
      this.listaElem = this.inventoryList;
    }
  }

  filterByCategory(item:any){
    if(item.hijos!=null){

    }
  }

  getImgURL(item:any){
    if(item.img == null){
      return {'background-image': 'url(https://tienda724.com/logos/NIT%20900416180-9.jpg)'};
    }else{
      return {'background-image': 'url('+item.img.replace("http://localhost:4200","https://tienda724.com")+')'};
    }
  }

  getImgURLCategory(item:any){
    if(item.img == null){
      return {'background-image': 'url(https://tienda724.com/logos/NIT%20900416180-9.jpg)'};
    }else{
      return {'background-image': 'url('+item.category_URL.replace("http://localhost:4200","https://tienda724.com")+')'};
    }
  }


  goMenu(){
    this.router.navigate(['menu']);
  }


  logOut(){
    localStorage.removeItem("ID");
    localStorage.removeItem("idStore");
    localStorage.removeItem("mesa");
    localStorage.removeItem("storeName");
    localStorage.removeItem("ID_CAJA");
    this.router.navigate(['login']);
  }


  setCategory(){
    let item:any = this.categories.find((element:any)=> element.id_category==this.selectedCategory)
    //console.log(item)
    this.selectedCategoryName = item.category;
    this.selectedCategory = item.id_category;
    this.subCategoryList = item.hijos;
    this.subCategoryName = item.category;
    let idListToFilter:any[] = [];
    idListToFilter.push(item.id_category);
    for(let i:any=0;i<item.hijos.length;i=i+1){
      let element = item.hijos[i];
      idListToFilter.push(item.hijos[i].id_category);
    }
    this.inventoryList = this.inventorylistCopy.filter((element:any) =>{
      return idListToFilter.includes(element.id_CATEGORY);
    })
    if(this.inventoryList.length>=100){
      this.listaElem = this.inventoryList.slice(0,100);
    }else{
      this.listaElem = this.inventoryList;
    }
  }

  setSubCategory(item:any){
    this.selectedCategoryName = item.category;
    this.selectedCategory = item.id_category;
    this.subCategoryList = item.hijos;
    this.subCategoryName = item.category;
    let idListToFilter:any[] = [];
    idListToFilter.push(item.id_category);
    this.inventoryList = this.inventorylistCopy.filter((element:any) =>{
      return idListToFilter.includes(element.id_CATEGORY);
    })
    if(this.inventoryList.length>=100){
      this.listaElem = this.inventoryList.slice(0,100);
    }else{
      this.listaElem = this.inventoryList;
    }
  }

  addDetail2(code:any) {
    //console.log(this.productsObject);
    if(this.disableDoubleClickSearch){
      return;
    }
    this.disableDoubleClickSearch = true;
    // CPrint(code,"da code :3")

    // var codeFilter = this.productsObject.filter(item => (String(item.code) === code || String(item.ownbarcode) === code || String(item.product_store_code) === code ));
    if(code == "TEMPOMESA3BANDAS" || code == "TEMPOMESALIBRES" || code == "TEMPOMESAPOOL"){
      this.disableDoubleClickSearch = false;
      return;
    }
    // CPrint(codeFilter);
    let key: any;
    this.productsObject.forEach((item:any) => {
      // CPrint("//-----------------------------------");
      // CPrint(item.code);
      // CPrint("//-----------------------------------");
      // CPrint(item.ownbarcode);
      // CPrint("//-----------------------------------");
      // CPrint(item.product_store_code);
      // CPrint("//-----------------------------------");
      if (item.code == code || item.ownbarcode == code || String(item.product_store_code) == code) {
        key = item;
      }
      // else{
      // }
    });
    // CPrint("this is array papu: ",this.productsObject)
    // CPrint("this is key", key)
    if (key != null) {
      // CPrint("entro")
      this.productsObject[this.productsObject.indexOf(key)].quantity += 1;
      this.disableDoubleClickSearch = false;
    } else {

      const product = this.inventoryList.find((item:any) => this.findCode(code, item));
      // var product = this.inventoryList.find(item => (item.code == code || item.ownbarcode == code || String(item.product_STORE_CODE) == code));
      //@ts-ignore
      if (product) {
        this.getPriceList(product, code, product.id_PRODUCT_STORE);
        setTimeout(() => {
          this.disableDoubleClickSearch = false;

        }, 100);
      } else {
        if(localStorage.getItem("SesionExpirada") != "true"){ alert('Ese codigo no esta asociado a un producto.');}
        this.disableDoubleClickSearch = false;
      }
    }
  }


  findCode(code:any, item:any) {

    if (item.ownbarcode == code) {
      return item;
    } else {
      if (String(item.product_STORE_CODE) == code) {
        return item;
      }
    }

  }


  getPriceList(product:any,code:any,id:any){
    this.httpClient.get(Urlbase.tienda + "/store/pricelist?id_product_store="+id,{ headers: this.headers,withCredentials:true }).subscribe((response:any) => {
      const datos = response;
        if (product) {
          let new_product:any = {
            img: product.img,
            quantity: 1,
            id_storage: this.storageList[0].id_storage,
            price: product.standard_PRICE,
            tax: this.getPercentTax(product.id_TAX),
            id_product_third: product.id_PRODUCT_STORE,
            tax_product: product.id_TAX,
            state: this.commonStateDTO,
            description: product.product_STORE_NAME,
            code: product.code,
            id_inventory_detail: product.id_INVENTORY_DETAIL,
            ownbarcode: product.ownbarcode,
            product_store_code: String(product.product_STORE_CODE),
            pricelist: response,
            priceGen: response[0].price,
            standarPrice: product.standard_PRICE,
            productStoreId: id,
            invQuantity: product.quantity
          };
          new_product.price = product.standard_PRICE;

          //this.detailBillDTOList.push(new_product);
          this.productsObject.unshift(new_product);

          // event.target.blur();
          // event.target.value = '';
          // setTimeout(() => {
          //   document.getElementById('lastDetailQuantity');
          // });
        } else {
          let codeList;
          this.httpClient.get(Urlbase.tienda + "/products2/code/general?code="+String(code),{ headers: this.headers,withCredentials:true }).subscribe(data => {
            codeList = data;
          //@ts-ignore
          if( data.length == 0 ){
            alert('El codigo no esta asociado a un producto');
          }else{
          }
          });

        }

    });
  }



  getPercentTax(idTaxProd:any){
    let thisTax;
    let taxToUse;

    for (thisTax in this.taxesList){
          if(idTaxProd == this.taxesList[thisTax].id_tax_tariff){
            taxToUse = this.taxesList[thisTax].percent/100;
          }
      }

      return taxToUse;
  }


  upQuantity(elemento:any){

    elemento.quantity+=1;

  }

  downQuantity(elemento:any){

    if(1<elemento.quantity){
      elemento.quantity-=1;
    }

  }

  getQuantity(){

    let quantity = 0;

    this.productsObject.forEach(
      (element:any) => {
        quantity = quantity + element.quantity;
      }
    )

    return quantity;

  }


  individualDelete(element:any){
    let tempList = [];
    for(let n = 0;n<this.productsObject.length;n++){
      if(this.productsObject[n] != element){
        tempList.unshift(this.productsObject[n]);
      }
    }
    this.productsObject = tempList;
  }



  postNewDetails(){
    let detailList = '';
    //GENERO LA LISTA DE DTOs DE DETALLES
    this.productsObject.forEach((item:any) => {
      detailList = detailList+ "{"+item.id_product_third+","+item.priceGen+","+item.tax_product+","+item.quantity+"},"
    });

    this.httpClient.post(Urlbase.facturacion + "/billing/agregarProductosMesa?idbill="+this.objMesa.id_BILL+"&detallepedido="+detailList.substring(0, detailList.length - 1),{},{ headers: this.headers,withCredentials:true }).subscribe(response => {

      if(response){
        this.router.navigate(['detailmesa'])
      }else{
        alert("Hubo un problema procesando su solicitud.")
      }
    })
  }

  getPriceTotal(){

    let price = 0;

    this.productsObject.forEach(
      (element:any) => {
        price = price + (element.priceGen * element.quantity);
      }
    )

    return price;
  }


  listLoad(){

    //console.log("IM IN")
    this.EstadoBusquedaProducto = 1;

    if(this.inputForCode == ""){
      this.listaElem = this.inventoryList.slice(0,100);
    }else{

      this.listaElem = [];

      this.listaElem = this.inventoryList.filter(element => element.product_STORE_NAME.toLowerCase().includes(this.inputForCode.toLowerCase()) || element.ownbarcode == this.inputForCode || element.product_STORE_CODE == this.inputForCode)

      if(!(this.listaElem.length<100)){
        this.listaElem = this.listaElem.slice(0,100);
      }
    }

    this.EstadoBusquedaProducto = 2;
  }
}
