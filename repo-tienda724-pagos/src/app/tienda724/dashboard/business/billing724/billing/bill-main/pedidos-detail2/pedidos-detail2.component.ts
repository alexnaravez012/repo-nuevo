import {Component, Inject, OnInit} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef} from '@angular/material';
//import { HttpClient } from '@angular/common/http';
import {LocalStorage} from '../../../../../../../services/localStorage';
import {HttpClient} from '@angular/common/http';
import {Urlbase} from '../../../../../../../shared/urls';

@Component({
  selector: 'app-pedidos-detail2',
  templateUrl: './pedidos-detail2.component.html',
  styleUrls: ['./pedidos-detail2.component.scss']
})
export class PedidosDetail2Component implements OnInit {
  elem: any;
  ListReportProd;
  ListaMarca = [];
  costo=0;
  precio=0;

  constructor(public locStorage: LocalStorage, private http2: HttpClient ,public dialogRef: MatDialogRef<PedidosDetail2Component>,public dialog: MatDialog,@Inject(MAT_DIALOG_DATA) public data: DialogData) { }

  ngOnInit() {
    CPrint("this is third",this.locStorage.getThird())
    CPrint(this.data)
    CPrint("ListaMarca es")
    CPrint(this.ListaMarca)
    this.http2.post(Urlbase.facturacion + "/pedidos/detalles",{listaTipos: this.data.elem},{}).subscribe(
      response => {
        this.ListReportProd = response;
        CPrint("this is list, ", this.data.elem)
        CPrint("this is the response", response)
        this.calcularTotalCosto(response);
        this.calcularTotalPrecio(response);
        //@ts-ignore
        this.getMarcas(response).then(()=>{
          this.ListaMarca.forEach((element,index) => {
            this.ListReportProd.forEach(element2 => {
              if(element.marca == element2.fabricante){
                this.http2.get(Urlbase.tienda + "/store/pricelist?id_product_store="+element2.id_PRODUCT_THIRD).subscribe(responses => {
                  this.ListaMarca[index].costoTotal = this.ListaMarca[index].costoTotal+element2.costototal
                  this.ListaMarca[index].precioTotal = this.ListaMarca[index].precioTotal+(element2.cantidad*responses[0].price);
                  this.ListaMarca[index].detalles.push(element2);
                  CPrint("this is list CON costos Y precios: ",this.ListaMarca);
                })
              }
            });
          })
        })
      }
    )
  }

  calcularTotalCosto(response){
    response.forEach(element => {
      this.costo+=element.costototal;
    });
  }

  calcularTotalPrecio(response){
    response.forEach(element => {
      this.http2.get(Urlbase.tienda + "/store/pricelist?id_product_store="+element.id_PRODUCT_THIRD).subscribe(responses => {
        this.precio+=(element.cantidad*responses[0].price);
      });
    });
  }

  async getMarcas(response){

    response.forEach(element => {
      if(!this.ListaMarca.find(item => item.marca == element.fabricante )){
        this.ListaMarca.push(new marca(element.fabricante,0,0));
      }
    });

  }


  genPdf2(){
    CPrint("TESTING PLEASE: ",JSON.stringify({costototal: this.costo,
                 preciototal: this.precio,
                 list: this.ListaMarca}))



    this.http2.post(Urlbase.facturacion + "/pedidos/pickingPdf",{logo: this.locStorage.getThird().info.type_document+" "+this.locStorage.getThird().info.document_number,
                                                                   costototal: this.costo,
                                                                   preciototal: this.precio,
                                                                   list: this.ListaMarca},
      {responseType: 'text'}).subscribe(responsepdf => {
      CPrint("THIS IS MY RESPONSE, ",responsepdf);
      window.open(Urlbase.root+"remisiones/"+responsepdf, "_blank");
    })

  }


  excel(){
    CPrint(JSON.stringify({costototal: this.costo,
      preciototal: this.precio,
      list: this.ListaMarca}))



    this.http2.post(Urlbase.facturacion + "/pedidos/pickingExcel",{costototal: this.costo,
                                                            preciototal: this.precio,
                                                            list: this.ListaMarca},
    {responseType: 'text'}).subscribe(responsepdf => {
    CPrint("THIS IS MY RESPONSE, ",responsepdf);
    window.open(Urlbase.root+"reportes/"+responsepdf, "_blank");
    })
  }



  genPdf(){
    this.http2.post(Urlbase.facturacion + "/pedidos/pdf3",{
      documento: "1",
      cliente: "1",
      fecha: new Date(),
      documento_cliente: "1",
      correo: "1",
      direccion: "1",
      total: 0,
      subtotal: 0,
      tax: 0,
      detail_list: this.ListReportProd,
      used_list: []
    },{responseType: 'text'}).subscribe(responsepdf => {
      CPrint("THIS IS MY RESPONSE, ",responsepdf);
      window.open(Urlbase.root+"remisiones/"+responsepdf, "_blank");
    })
  }

}


export interface DialogData {
  elem: any
}



export class marca {
  marca: String;
  costoTotal: Number;
  precioTotal: Number;
  detalles=[];

  constructor(marca: String,costo: Number, precio: Number){
    this.marca = marca
    this.costoTotal = costo
    this.precioTotal = precio
  }
}
