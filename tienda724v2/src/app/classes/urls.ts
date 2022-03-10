let UsarProd = !(window.location.href.includes("pruebas.tienda724.com") || window.location.href.includes("localhost"));

export const Urlbase = {
  //auth [0]
  auth:'https://'+(UsarProd ? 'tienda724.com':'pruebas.tienda724.com')+':8449',
  // tercero [1]
  tercero:'https://'+(UsarProd ? 'tienda724.com':'pruebas.tienda724.com')+':8446/v1',
  // tienda [2]
  tienda:'https://'+(UsarProd ? 'tienda724.com':'pruebas.tienda724.com')+':8447/v1',
  // billing/facturación [3]
  facturacion:'https://'+(UsarProd ? 'tienda724.com':'pruebas.tienda724.com')+':8448/v1',
  // order [4]
  order:'https://'+(UsarProd ? 'tienda724.com':'pruebas.tienda724.com')+':8450/v1',
  // cierreCaja [5]
  cierreCaja:'https://'+(UsarProd ? 'tienda724.com':'pruebas.tienda724.com')+':8451/v1',
  // remisiones [6],
  remisiones:'https://'+(UsarProd ? 'tienda724.com':'pruebas.tienda724.com')+'/remisiones',
  // facturas [7],
  facturas:'https://'+(UsarProd ? 'tienda724.com':'pruebas.tienda724.com')+'/facturas',
  // imagenes [8],
  imagenes:'https://'+(UsarProd ? 'tienda724.com':'pruebas.tienda724.com')+'/imagenes',
  // logos [9],
  logos:'https://'+(UsarProd ? 'tienda724.com':'pruebas.tienda724.com')+'/logos',
  // reportes [10],
  reportes:'https://'+(UsarProd ? 'tienda724.com':'pruebas.tienda724.com')+'/reportes',
  // [11],
  root:'https://'+(UsarProd ? 'tienda724.com':'pruebas.tienda724.com')+'/',
}

// export const Urlbase_Old = [
//   //auth [0]
//   'https://'+(UsarProd ? 'tienda724.com':'pruebas.tienda724.com')+':8449',
//   // tercero [1]
//   'https://'+(UsarProd ? 'tienda724.com':'pruebas.tienda724.com')+':8446/v1',
//   // tienda [2]
//   'https://'+(UsarProd ? 'tienda724.com':'pruebas.tienda724.com')+':8447/v1',
//   // billing/facturación [3]
//   'https://'+(UsarProd ? 'tienda724.com':'pruebas.tienda724.com')+':8448/v1',
//   // order [4]
//   'https://'+(UsarProd ? 'tienda724.com':'pruebas.tienda724.com')+':8450/v1',
//   // cierreCaja [5]
//   'https://'+(UsarProd ? 'tienda724.com':'pruebas.tienda724.com')+':8451/v1',
//   // remisiones [6],
//   'https://'+(UsarProd ? 'tienda724.com':'pruebas.tienda724.com')+'/remisiones',
//   // facturas [7],
//   'https://'+(UsarProd ? 'tienda724.com':'pruebas.tienda724.com')+'/facturas',
//   // imagenes [8],
//   'https://'+(UsarProd ? 'tienda724.com':'pruebas.tienda724.com')+'/imagenes',
//   // logos [9],
//   'https://'+(UsarProd ? 'tienda724.com':'pruebas.tienda724.com')+'/logos',
//   // reportes [10],
//   'https://'+(UsarProd ? 'tienda724.com':'pruebas.tienda724.com')+'/reportes',
//   // [11],
//   'https://'+(UsarProd ? 'tienda724.com':'pruebas.tienda724.com')+'/',
// ];
//pruebas.tienda724.com
