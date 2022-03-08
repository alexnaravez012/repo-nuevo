import {Component, Inject, OnInit} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import {LocalStorage} from 'src/app/services/localStorage';
import {MAT_DIALOG_DATA} from '@angular/material';
import pdfMake from 'pdfmake/build/pdfmake.min';

@Component({
  selector: 'app-contingency-bill-list',
  templateUrl: './contingency-bill-list.component.html',
  styleUrls: ['./contingency-bill-list.component.css']
})
export class ContingencyBillListComponent implements OnInit {

  constructor(public locStorage: LocalStorage,@Inject(MAT_DIALOG_DATA) public data: DialogData) { }
  listelem;

  inventoryList;
  taxesList;

  ngOnInit(): void {

    this.inventoryList = this.locStorage.getInventoryList();
    this.listelem = this.locStorage.getOfflineBillList();
    CPrint("THIS AINT LIST DAWG: ", this.locStorage.getOfflineBillList())
    CPrint("THIS IS THIRD: ", this.locStorage.getThird())
    CPrint("THIS IS StoreName: ", this.locStorage.getStoreName())
    CPrint("THIS IS BoxName: ", this.locStorage.getBoxName())
    this.taxesList = this.data.total;

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



	GeneratePdfFast(ElDTO){
    let formatter = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    });
    let CopiaElDTO = JSON.parse(JSON.stringify(ElDTO));
    //CopiaElDTO = {details:"{9431,1400,1,1},{9428,1129,1,1},{9427,1400,1,1}"};
    CopiaElDTO.details = CopiaElDTO.details.substring(1,CopiaElDTO.details.length-1);
    let ListaDetails = CopiaElDTO['details'].split('},{');
    let ListaProductos = [];
    let Subtotal = 0;
    let Tax = 0;
    let Total = 0;
    ListaProductos.push([  { text: 'Cant', style: 'TablaHeader', border: [false, false, false, true]  }, { text: 'Prod',style: 'TablaHeader', border: [false, false, false, true]  }, { text: 'Precio', style: 'TablaHeader', border: [false, false, false, true]  }]);
    ListaDetails.forEach(item => {
      //
      let ItemDividido = item.split(',');
      ItemDividido[0] = parseInt(ItemDividido[0]);
      ItemDividido[1] = parseInt(ItemDividido[1]);
      ItemDividido[2] = parseInt(ItemDividido[2]);
      ItemDividido[3] = parseInt(ItemDividido[3]);
      let ItemObtenido = {price:-1,quantity:-1,tax_product:-1,description:''};
      let product;
      for(let n = 0;n < this.inventoryList.length;n++){
        if(this.inventoryList[n].id_PRODUCT_STORE == ItemDividido[0]){
          product = this.inventoryList[n];
          break;
        }
      }
      if(product == null){return;}
      ItemObtenido.tax_product = this.getPercentTax(ItemDividido[2]);
      ItemObtenido.price = ItemDividido[1];
      ItemObtenido.quantity = ItemDividido[3];
      ItemObtenido.description = product.product_STORE_NAME;
      //
      Subtotal += ItemObtenido.price*ItemObtenido.quantity;
      Tax += (ItemObtenido.price*ItemObtenido.quantity)*ItemObtenido.tax_product;
      ListaProductos.push([  { text: ItemObtenido.quantity, style: 'TablaContenido', border: [false, false, false, false]  }, { text: ItemObtenido.description,style: 'TablaContenido', border: [false, false, false, false]  }, { text: formatter.format((ItemObtenido.price*ItemObtenido.quantity)*(1+ItemObtenido.tax_product)), style: 'TablaContenido', border: [false, false, false, false]  },]);
    });
    Total = Subtotal + Tax;
    //
    let Logo = {
      image: localStorage.getItem('Logo'),
      fit: [100, 100],
      style: {
        alignment: 'center'
      }
    };
    if(localStorage.getItem('Logo') == null || localStorage.getItem('Logo') == "-1"){
      Logo = {
        image: "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABHCAIAAAB+uHWbAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAACfSURBVHhe7dAxAQAwEAOh+jedWvjbQQJvnMkKZAWyAlmBrEBWICuQFcgKZAWyAlmBrEBWICuQFcgKZAWyAlmBrEBWICuQFcgKZAWyAlmBrEBWICuQFcgKZAWyAlmBrEBWICuQFcgKZAWyAlmBrEBWICuQFcgKZAWyAlmBrEBWICuQFcgKZAWyAlmBrEBWICuQFcgKZAWyAlmBrEDW2fYBJKjlm+nTjCAAAAAASUVORK5CYII=",
        fit: [100, 100],
        style: {
          alignment: 'center'
        }
      };
    }
    const docDefinition = {
      pageSize: { width: 137, height: 598 },
      // [left, top, right, bottom] or [horizontal, vertical] or just a number for equal margins
      pageMargins: [ 10,10,10,10 ],
      content: [
        {
          layout: 'noBorders', // optional
          table: {
            headerRows: 1,
              widths: [117],
              body: [
              [
                Logo
              ],
            ]
          }
        },
        {text: this.locStorage.getThird().info.fullname, style: 'header'},
        {text: this.locStorage.getThird().info.type_document +" "+ this.locStorage.getThird().info.document_number, style: 'header'},
        //{text: (this.locStorage.getThird().directory.city || 'Pendiente')+","+(this.locStorage.getThird().directory.address || 'Pendiente'), style: 'header'},
        {text: 'Tel: -', style: 'header'},
        {text: ' ', style: 'espacioBlanco'},
        {text: 'Cliente: Cliente Ocasional', style: 'header'},
        {text: ' ', style: 'espacioBlanco'},
        {text: new Date().toLocaleDateString("en-US"), style: 'header2'},
        {text: "Factura # Offline", style: 'header2'},
        {text: "Cajero: "+this.locStorage.getPerson().info.fullname, style: 'header2'},
        {text: ' ', style: 'espacioBlanco'},
        {
          layout: 'noBorders', // optional
          table: {
            headerRows: 1,
            widths: [50,50],
            body: [
              [{text: 'Tienda', style: 'header2', border: [false, false, false, false] },{text: 'Caja', style: 'header2', border: [false, false, false, false] }],
              [{text: this.locStorage.getStoreName(), style: 'header2', border: [false, false, false, false] },{text: this.locStorage.getBoxName() , style: 'header2', border: [false, false, false, false] }],
            ]
          }
        },
        {text: ' ', style: 'espacioBlanco'},
        {
          //layout: 'noBorders', // optional
          table: {
            // headers are automatically repeated if the table spans over multiple pages
            // you can declare how many rows should be treated as headers
            headerRows: 1,
            widths: [13,40,40],
            body: ListaProductos
          }
        },
        {text: ' ', style: 'espacioBlanco'},
        {
          layout: 'noBorders', // optional
          table: {
            headerRows: 1,
            widths: [50,50],

            body: [
              [{text: 'Subtotal', style: 'Totales'},{text: formatter.format(Subtotal), style: 'Totales'}],
              [{text: 'IVA', style: 'Totales'},{text: formatter.format(Tax), style: 'Totales'}],
              [{text: 'Total', style: 'Totales'},{text: formatter.format(Total), style: 'Totales'}],
              [{text: 'Cantidad Recibida', style: 'Totales'},{text: formatter.format(0), style: 'Totales'}],
              [{text: 'Cambio', style: 'Totales'},{text: formatter.format(0), style: 'Totales'}],
              [{text: 'Medio Pago', style: 'Totales'},{text: '?', style: 'Totales'}],
            ]
          }
        },
        {text: ' ', style: 'espacioBlanco'},
        {text: 'Observaciones:', style: 'header'},
        {text: CopiaElDTO['notes'], style: 'header'},
      ],
      styles: {
        header: {
          fontSize: 7,
          bold: true,
          alignment: 'center',
        },
        Totales: {
          fontSize: 7,
          bold: true,
          alignment: 'right',
        },
        espacioBlanco: {
          fontSize: 12,
          bold: true,
          alignment: 'center'
        },
        header2: {
          fontSize: 6,
          bold: false,
          alignment: 'center'
        },
        TablaHeader: {
          fontSize: 6,
          bold: false,
          alignment: 'center'
        },
        TablaContenido: {
          fontSize: 6,
          bold: false,
          alignment: 'center'
        },
      }
    };
    pdfMake.createPdf(docDefinition).open();
  }



  getTotal(details){

    let detailsJSON = JSON.parse("["+details.split("{").join("[").split("}").join("]")+"]")

    let sum = 0;

    detailsJSON.forEach(element => {
      sum = sum +(element[1] * element[3])
    });

    return sum;
  }

  getQuantity(details){
      let detailsJSON = JSON.parse("["+details.split("{").join("[").split("}").join("]")+"]")

       let cant = 0;

       detailsJSON.forEach(element => {
         cant = cant + element[3];
       });

       return cant;

  }


}



export interface DialogData {
  total: any;
}
