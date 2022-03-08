import { DatePipe } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MatDialog } from '@angular/material';
import { Router } from '@angular/router';
import { BillingService } from 'src/app/services/billing.service';
import { InventoriesService } from 'src/app/services/inventories.service';
import { LocalStorage } from 'src/app/services/localStorage';
import { ThirdService } from 'src/app/services/third.service';
import { Urlbase } from 'src/app/shared/urls';
import { CommonStateDTO } from '../../../commons/commonStateDTO';
import { ModalConfirmEmptyInventoryComponent } from '../modal-confirm-empty-inventory/modal-confirm-empty-inventory.component';
import * as jQuery from 'jquery';
import 'bootstrap-notify';

let $: any = jQuery;

@Component({
  selector: 'app-admin-pedidos',
  templateUrl: './admin-pedidos.component.html',
  styleUrls: ['./admin-pedidos.component.css']
})
export class AdminPedidosComponent implements OnInit {

  constructor(public router: Router, private datePipe: DatePipe, public thirdService: ThirdService,private http: HttpClient, public locStorage: LocalStorage,private fb: FormBuilder, private billingService: BillingService,
    public inventoriesService: InventoriesService, public dialog: MatDialog, private httpClient: HttpClient) {
    this.headers = new HttpHeaders({
    'Content-Type':  'application/json',
    'Authorization':  this.locStorage.getTokenValue(),
    });
  }
  headers;
  SelectedStore = this.locStorage.getIdStore();
  stores;
  factor;
  prioridad = 1;
  umbral;
  listaElem = [];
  listaElem2 = [];
  disableDoubleClickSearch = false;
  inputForCode="";
  inputForCode2="";
  EstadoBusquedaProducto = -1;
  inventoryList = [];
  public productsObject = [];
  priceList = [];
  taxesList: any;
  storageList;
  commonStateDTO: CommonStateDTO;
  SelectedStore2 = this.locStorage.getIdStore();
  SelectedStore3 = this.locStorage.getIdStore();

  ngOnInit(): void {

    this.billingService.getStoresByThird(this.locStorage.getToken().id_third).subscribe(data => {
      console.log(data);
      this.stores = data;
      
    })


    this.inventoriesService.getInventory(this.SelectedStore).subscribe((data) => {
      //CPrint("This is InventoryList: ",data);
      this.inventoryList = data;
    })

    this.getStorages();

    this.getParamStores();

  }

  getStorages() {
    this.httpClient.get(Urlbase.tienda+"/store/s?id_store="+this.SelectedStore).subscribe((res)=>{
      this.storageList = res;
    });

  }

  eliminarFaltantes(){
    this.http.post(Urlbase.facturacion+"/pedidos/eliminarFaltantes?idstore="+this.SelectedStore,{}).subscribe(response => {
      if (response == 1){
        alert("Se eliminaron los faltantes exitosamente.");
      }else{
        alert("Se presento un error al eliminar los faltantes.");
      }
    })
  }


  openDialogTransactionConfirmEmpty() {
    const dialogRef = this.dialog.open(ModalConfirmEmptyInventoryComponent, {
      width: '40vw',
      height: '20vh'
    });

    dialogRef.afterClosed().subscribe(result => {
      if(result.response){
        this.http.post(Urlbase.tienda+"/pedidos/actualizarInventarioACero?idstore="+this.SelectedStore,{}).subscribe(response => {
          if(response == 1){
            this.showNotification('top', 'center', 3, "<h3>Se ha limpiado su inventrio exitosamente</h3> ", 'info');
          }else{
            this.showNotification('top', 'center', 3, "<h3>Se presento un problema al limpiar su inventario</h3> ", 'info');
          }
        })
      }
    });
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



  Product1 = { nombre: "Producto", code: "1" }

  addDetailProduct1(element){
    console.log(element);
    this.Product1 = { nombre: element.product_STORE_NAME, code: element.code }
  }



  Product2 = { nombre: "Producto", code: "2" }

  addDetailProduct2(element){
    console.log(element);
    this.Product2 = { nombre: element.product_STORE_NAME, code: element.code }
  }

  async listLoad(){
    this.listaElem = [];
    this.EstadoBusquedaProducto = 1;
    await new Promise(resolve => {
      this.getElemsIfProvCode().then(() => {
        this.getElemsIfOwn().then(() => {
          this.getElemsIfcode().then(() => {

            //inserto elementos si name
            this.inventoryList.forEach(element => {
              if(element.product_STORE_NAME.toLowerCase( ).includes(this.inputForCode.toLowerCase()) && !(this.listaElem.includes(element)) && !this.listaElem.some(item => item.code === element.code)){
                this.listaElem.push(element);

              }
            });
            this.EstadoBusquedaProducto = 2;
            resolve();
          })
        })
      });
    })
      
  }


  async listLoad2(){
    this.listaElem2 = [];
    this.EstadoBusquedaProducto = 1;
    await new Promise(resolve => {
      this.getElemsIfProvCode2().then(() => {
        this.getElemsIfOwn2().then(() => {
          this.getElemsIfcode2().then(() => {

            //inserto elementos si name
            this.inventoryList.forEach(element => {
              if(element.product_STORE_NAME.toLowerCase( ).includes(this.inputForCode2.toLowerCase()) && !(this.listaElem2.includes(element)) && !this.listaElem2.some(item => item.code === element.code)){
                this.listaElem2.push(element);

              }
            });
            this.EstadoBusquedaProducto = 2;
            resolve();
          })
        })
      });
    })
      
  }


  async getElemsIfOwn(){
    this.inventoryList.forEach(element => {
      if(element.ownbarcode==this.inputForCode && !(this.listaElem.includes(element))&& !this.listaElem.some(item => item.code === element.code)){
        this.listaElem.push(element);
      }
    })
  }

  async getElemsIfProvCode(){
    this.inventoryList.forEach(element => {
      try{
        if(element.codigo_PROVEEDOR.toLowerCase().includes(this.inputForCode.toLowerCase()) && !(this.listaElem.includes(element))&& !this.listaElem.some(item => item.code === element.code)){
          this.listaElem.push(element);
        }
      }catch(e){
      }
    })
  }

  async getElemsIfcode(){
    this.inventoryList.forEach(ele => {
      //@ts-ignore
      if(ele.product_STORE_CODE==this.inputForCode && !(this.listaElem.includes(ele))&& !this.listaElem.some(item => item.code === ele.code)){
        this.listaElem.push(ele);
      }
    })
  }



  
  async getElemsIfOwn2(){
    this.inventoryList.forEach(element => {
      if(element.ownbarcode==this.inputForCode2 && !(this.listaElem2.includes(element))&& !this.listaElem2.some(item => item.code === element.code)){
        this.listaElem2.push(element);
      }
    })
  }

  async getElemsIfProvCode2(){
    this.inventoryList.forEach(element => {
      try{
        if(element.codigo_PROVEEDOR.toLowerCase().includes(this.inputForCode2.toLowerCase()) && !(this.listaElem2.includes(element))&& !this.listaElem2.some(item => item.code === element.code)){
          this.listaElem2.push(element);
        }
      }catch(e){
      }
    })
  }

  async getElemsIfcode2(){
    this.inventoryList.forEach(ele => {
      //@ts-ignore
      if(ele.product_STORE_CODE==this.inputForCode2 && !(this.listaElem2.includes(ele))&& !this.listaElem2.some(item => item.code === ele.code)){
        this.listaElem2.push(ele);
      }
    })
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



  getPriceList(product,code,id){
    console.log("RECEIVED PRODUCT: ",product);
    this.httpClient.get(Urlbase.tienda+"/store/pricelist?id_product_store="+id).subscribe(response => {
      const datos = response;
      if (product) {
        let new_product = {
          quantity: 1,
          id_storage: this.storageList[0].id_storage,
          price: product.standard_PRICE,
          tax: this.getPercentTax(product.id_TAX),
          id_product_third: product.id_PRODUCT_STORE,
          tax_product: String(product.id_TAX),
          state: this.commonStateDTO,
          description: product.product_STORE_NAME,
          code: product.code,
          id_inventory_detail: product.id_INVENTORY_DETAIL,
          ownbarcode: product.ownbarcode,
          product_store_code: String(product.product_STORE_CODE),
          pricelist: response,
          priceGen: response[0].price,
          standarPrice: product.standard_PRICE,
          standarBuyPrice: product.standard_PRICE,
          productStoreId: id,
          disccount: 0,
          codigo_PROVEEDOR: product.codigo_PROVEEDOR,
          codigo_PROVEEDOR_hidden: product.codigo_PROVEEDOR

        };
        new_product.price = product.standard_PRICE;

        //this.detailBillDTOList.push(new_product);

        let key: any = null;

        this.productsObject.forEach(item => {
          if(item.code == code || item.ownbarcode == code || String(item.product_store_code) == code ){
            key = item;
          }
        });
        if (key != null) {
          this.productsObject[this.productsObject.indexOf(key)].quantity += 1;
         
        } else {
          this.productsObject.unshift(new_product);
          
        }
        // event.target.blur();
        // event.target.value = '';
        // setTimeout(() => {
        //   document.getElementById('lastDetailQuantity');
        // });
      } else {
        let codeList;
        this.httpClient.get(Urlbase.tienda+"/products2/code/general?code="+String(code)).subscribe(data => {
          codeList = data;
          //@ts-ignore
         alert("EL PRODUCTO NO EXISTE");
        });

      }

    });
  }


  asociarProductos(){
    if(this.Product1.nombre == 'Producto' || this.Product2.nombre == 'Producto' || this.factor == "" || this.factor == null || !this.factor){
      alert("Faltan datos para poder asociar.");
    }else{
      this.http.post(Urlbase.tienda + "/pedidos/agregarConversion?barcodehijo="+this.Product1.code+"&barcodepadre="+this.Product2.code+"&factor="+this.factor+"&prioridad="+this.prioridad,{}).subscribe(response => {
        if(response == 1){
          alert("ASOCIACION CREADA EXITOSAMENTE.");
        }else{
          alert("SE PRESENTO UN PROBLEMA AL CREAR LA ASOCIACION.");
        }
  
      })
    
    }
  }
  
  storesParam;
  SelectedStoreParam;
  getParamStores(){
    if(this.locStorage.getIdStore()!=301){
      this.http.get(Urlbase.tienda+"/store/store2?idstore="+this.SelectedStore3).subscribe(response => {
        console.log("LISTADO CLIENTES: ",response)
        this.storesParam = response;
        this.SelectedStoreParam = response[0].id_STORE;
      })

    }
  }

  displayedColumns: string[] = ['Codigo Barras Padre', 'Producto Padre', 'Codigo Barras Hijo', 'Producto Hijo', 'Umbral', 'Opciones', 'Opciones2'];
  dataSource;
  consultarAsociaciones(){
    this.http.get(Urlbase.tienda+"/pedidos/asociaciones?idstorep="+this.SelectedStore3+"&idstoreh="+this.SelectedStoreParam).subscribe(
     response => {
       this.dataSource = response;
     }
    )

  }
  setCero(){
    this.http.post(Urlbase.tienda + "/inventories/ponerNegativosEnCero?idstore="+this.SelectedStore,{}).subscribe(data => {
    
    })
  }

  eliminarAsociaciones(element){
    this.http.post(Urlbase.tienda+"/pedidos/eliminarAsociacion?barcodehijo="+element.codigo_HIJO+"&barcodepadre="+element.codigo_PADRE+"&idstorecliente="+this.SelectedStore3+"&idstoreprov="+this.SelectedStoreParam,{}).subscribe(
     response => {
       this.consultarAsociaciones();
     }
    )

  }

  updateUmbral(element){
    console.log(element);
    this.http.put(Urlbase.tienda+"/pedidos/updateUmbral?pctumbral="+element.pct_umbral+"&barcodehijo="+element.codigo_HIJO+"&idstorehijo="+this.SelectedStoreParam,{}).subscribe(
      response => {
        if(response == 1){
          this.consultarAsociaciones();
          this.showNotification('top', 'center', 3, "<h3>Se actualizo el umbral exitosamente</h3> ", 'info');
          
        }else{
          this.showNotification('top', 'center', 3, "<h3>Se presento un problema al actualizar su Umbral</h3> ", 'danger');
          
        }
      }
    )
  }
}
