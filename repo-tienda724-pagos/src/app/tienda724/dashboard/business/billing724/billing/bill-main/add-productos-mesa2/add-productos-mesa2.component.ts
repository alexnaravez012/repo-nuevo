import { HttpClient } from '@angular/common/http';
import { Component, Inject, OnInit } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material';
import { LocalStorage } from 'src/app/services/localStorage';
import { Urlbase } from '../../../../../../../shared/urls';
import { CommonStateDTO } from '../../../commons/commonStateDTO';
import { NewProductStoreComponent } from '../new-product-store/new-product-store.component';
import * as jQuery from 'jquery';
import 'bootstrap-notify';

let $: any = jQuery;

@Component({
  selector: 'app-add-productos-mesa2',
  templateUrl: './add-productos-mesa2.component.html',
  styleUrls: ['./add-productos-mesa2.component.css']
})
export class AddProductosMesa2Component implements OnInit {

  constructor(private httpClient: HttpClient,
              public locStorage: LocalStorage,
              public dialog: MatDialog,
              public dialogRef: MatDialogRef<AddProductosMesa2Component>,
              @Inject(MAT_DIALOG_DATA) public data: any) { }

  ngOnInit(): void {
    console.log(this.data)
    this.getInventoryList();
    this.getStorages();
    this.getCategories();
  }


  EstadoBusquedaProducto = -1;
  listaElem = [];
  inventoryList: any;
  inputForCode = "";
  productsObject = [];
  disableDoubleClickSearch = false;
  storageList;
  taxesList;
  commonStateDTO: CommonStateDTO;
  api_uri = Urlbase.tienda;
  categories;
  inventorylistCopy;


  listLoad(){

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


  setTodos(){
    this.inputForCode = "";

    if(!(this.inventorylistCopy.length<100)){
      this.listaElem = this.listaElem.slice(0,100);
    }else{
      this.listaElem = this.inventorylistCopy;
    }
    this.inventoryList = this.inventorylistCopy;
    this.showNotification('top', 'center', 3, "<h3>Inventario filtrado por <b>TODOS</b></h3> ", 'info');
  }

  filterInventory(id_cat,cat){
    this.inputForCode = "";
    let list = this.inventorylistCopy.filter(element => element.id_CATEGORY === id_cat);

    if(!(list.length<100)){
      this.listaElem = list.slice(0,100);
    }else{
      this.listaElem = list;
    }
    this.inventoryList = list;
    this.showNotification('top', 'center', 3, "<h3>Inventario filtrado por <b>"+cat+"</b></h3> ", 'info');
  }


  getInventoryList(){
    this.httpClient.get(Urlbase.tienda+"/products2/inventoryListActivos?id_store="+this.locStorage.getIdStore()).subscribe(data => {
      this.inventoryList = data;
      this.inventorylistCopy = data;

      if(this.inventoryList.length>=100){
        this.listaElem = this.inventoryList.slice(0,100)
      }else{
        this.listaElem = this.inventoryList
      }

      console.log("Inventory List")
      console.log(data)
      },
      (error) =>{
        console.log(error);
      },
      () => {
      if (this.inventoryList.length > 0) {

      }
    });
  }


  addDetail2(code) {
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
    let key: any = null;
    this.productsObject.forEach(item => {
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
      console.log(this.productsObject[this.productsObject.indexOf(key)]);
      this.disableDoubleClickSearch = false;
    } else {

      const product = this.inventoryList.find(item => this.findCode(code, item));
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


  findCode(code, item) {

    if (item.ownbarcode == code) {
      return item;
    } else {
      if (String(item.product_STORE_CODE) == code) {
        return item;
      }
    }

  }



  getPriceList(product,code,id){
    this.httpClient.get(Urlbase.tienda + "/store/pricelist?id_product_store="+id).subscribe(response => {
      const datos = response;
        if (product) {
          let new_product = {
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
          this.httpClient.get(Urlbase.tienda + "/products2/code/general?code="+String(code)).subscribe(data => {
            codeList = data;
            console.log("this is codeList: ", codeList);
          //@ts-ignore
          if( data.length == 0 ){
            alert('El codigo no esta asociado a un producto');
          }else{
            let dialogRef;
            dialogRef = this.dialog.open(NewProductStoreComponent, {
              width: '30vw',
              data: {codeList: codeList[0]}
            });
            dialogRef.afterClosed().subscribe(res=>{
              this.disableDoubleClickSearch = false;
              this.ngOnInit()
            })
          // let body = {
          //   id_store: this.locStorage.getIdStore(),
          //   id_code: codeList[0],
          //   product_store_name: "new",
          //   product_store_code: 123456,
          //   ownbarcode: "av12312312"
          // }
          // CPrint(JSON.stringify(body));
          // this.http.post(Urlbase.tienda + "/store/ps",body,this.options).subscribe(data=>
          // {
          //   CPrint("Post hecho");});
          }
          });

        }

    });
  }

  getQuantity(){

    let quantity = 0;

    this.productsObject.forEach(
      element => {
        quantity = quantity + element.quantity;
      }
    )

    return quantity;

  }


  getPriceTotal(){

    let price = 0;

    this.productsObject.forEach(
      element => {
        price = price + (element.priceGen * element.quantity);
      }
    )

    return price;
  }


  getPercentTax(idTaxProd){
    let thisTax;
    let taxToUse;

    for (thisTax in this.taxesList){
          if(idTaxProd == this.taxesList[thisTax].id_tax_tariff){
            taxToUse = this.taxesList[thisTax].percent/100;
          }
      }

      return taxToUse;
  }


  getStorages() {
    this.httpClient.get(Urlbase.tienda + "/store/s?id_store="+this.locStorage.getIdStore()).subscribe((res)=>{
      this.storageList = res;
    });

  }


  getCategories() {
    this.httpClient.get(Urlbase.tienda + "/products2/categoryNodes?id_store="+this.locStorage.getIdStore()).subscribe((res)=>{
      console.log("categories: ");
      console.log(res)
      this.categories = res;
    });

  }



  getTaxes(){
    this.httpClient.get(this.api_uri+'/tax-tariff').subscribe((res)=>{
        this.taxesList = res;
    });

  }


  upQuantity(elemento){

    elemento.quantity+=1;
  }

  downQuantity(elemento){
    if(1<elemento.quantity){
      elemento.quantity-=1;
    }
  }


  individualDelete(element){
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
    this.productsObject.forEach(item => {
      detailList = detailList+ "{"+item.id_product_third+","+item.priceGen+","+item.tax_product+","+item.quantity+"},"
    });

    console.log(detailList);
    this.httpClient.post(Urlbase.facturacion + "/billing/agregarProductosMesa?idbill="+this.data.data.item.id_BILL+"&detallepedido="+detailList.substring(0, detailList.length - 1),{}).subscribe(response => {
      console.log(response)
      if(response){
        this.showNotification('top', 'center', 3, "<h3>Se han agregado los detalles <b>CORRECTAMENTE</b></h3> ", 'info');
        this.dialogRef.close()
      }else{
        this.showNotification('top', 'center', 3, "<h3>Se ha presentado un <b>FALLO</b></h3> ", 'danger');
      }
    })
  }


  showNotification(from, align, id_type?, msn?, typeStr?) {
    const type = ['', 'info', 'success', 'warning', 'danger'];

    const color = Math.floor((Math.random() * 4) + 1);

    $.notify({
      icon: "notifications",
      message: msn ? msn : "<b>Noficación automatica </b>"

    }, {
        type: typeStr ? typeStr : type[id_type ? id_type : 2],
        timer: 200,
        placement: {
          from: from,
          align: align
        }
      });
  }


  getImgURL(item){
    if(item.img == null){
      return {'background-image': 'url(https://tienda724.com/logos/NIT%20900416180-9.jpg)'};
    }else{
      return {'background-image': 'url('+item.img.replace("http://localhost:4200","https://tienda724.com")+')'};
    }
  }

  getStyleCate(item){
    if(item.category_URL == null){
      return {'background-image': 'url(https://tienda724.com/logos/NIT%20900416180-9.jpg)'};
    }else{
      return {'background-image': 'url('+item.category_URL.replace("http://localhost:4200","https://tienda724.com")+')'};
    }
  }

}
