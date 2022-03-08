import {ChangeDetectorRef, Component, Inject, OnInit} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import {MAT_DIALOG_DATA, MatDialog, MatDialogRef, MatSnackBar} from '@angular/material';
//import { HttpClient, HttpHeaders } from '@angular/common/http';
import {Urlbase} from '../../../../../../../shared/urls';
import {LocalStorage} from '../../../../../../../services/localStorage';
import {HttpClient} from '@angular/common/http';
import * as jQuery from 'jquery';
import 'bootstrap-notify';

let $: any = jQuery;

@Component({
    selector: 'app-statechange',
    templateUrl: './statechange.component.html',
    styleUrls: ['./statechange.component.scss']
})
export class StatechangeComponent implements OnInit {

    allVehicles = [];
    elem: any;
    ListReportProd;
    ListReportProd2;
    ListChecked = [];
    checked = true;
    tax = 0;
    subtotal = 0;
    total = 0;
    alttax = 0;
    altsubtotal = 0;
    alttotal = 0;
    pdfDatas: pdfData;
    prefix = "SA";
    SelectedVehicle = "";
    ListVehicles;

    CampoSorteando = "";
    Invertido = false;

    mostrandoCargando = false;
    estadoCargando = "Procesando - Iniciando";

    constructor(private snackBar: MatSnackBar, public locStorage: LocalStorage, private cdRef: ChangeDetectorRef, private http2: HttpClient, public dialogRef: MatDialogRef < StatechangeComponent > , public dialog: MatDialog, @Inject(MAT_DIALOG_DATA) public data: DialogData) {}

    planillasSelector;
    selectedPlanilla;

    getPlanillas(){
        this.http2.get(Urlbase.tienda + "/pedidos/vehiculos/ids").subscribe(responses => {

                this.http2.get(Urlbase.tienda+"/pedidos/planillas?idvehiculo="+responses+"&status=O&idstore="+this.locStorage.getIdStore()+"&date1=01/01/2020&date2="+new Date()).subscribe(response => {
                    this.planillasSelector = response;
                    if(this.data.autoPilot){
                        this.selectedPlanilla = this.data.idVehicle;
                    }else{
                        this.selectedPlanilla = response[0].id_PLANILLA;
                    }
                });

        })
    }

    ngOnInit() {
        CPrint("THIS IS DATA PLEASE", this.data);


        this.getPlanillas();


        this.tax = 0;
        this.subtotal = 0;
        this.total = 0;
        this.altsubtotal = 0;
        this.alttax = 0;
        this.alttotal = 0;
        this.elem = this.data.elem;
        CPrint("THIS IS THE DATA", this.data);

        this.http2.post(Urlbase.facturacion + "/pedidos/detalles", {
            listaTipos: [this.data.elem.id_BILL]
        }, {}).subscribe(
            response => {
                this.ListReportProd = response;
                CPrint(this.ListReportProd);
                //@ts-ignore
                response.forEach(element => {
                    this.ListChecked.push(true);
                });

                this.calcsubtotal()
            }
        );
        CPrint(JSON.stringify({
            listaTipos: [this.data.elem.id_BILL]
        }));
        this.http2.post(Urlbase.facturacion + "/pedidos/detalles2", {
            listaTipos: [this.data.elem.id_BILL]
        }, {}).subscribe(
            response => {
                this.ListReportProd2 = response;
                CPrint(this.ListReportProd2);
                CPrint(JSON.stringify(
                   this.data
                ));

                if(this.data.autoPilot){
                    this.mostrandoCargando = false;
                    this.selectedPlanilla = this.data.idVehicle;

                    setTimeout(() => {
                        this.sendProducts()
                      }, this.data.index * 200);
                }
            }
        )
    }

    SortearPorPropiedadMetodo(propiedad, invertido) {
        return function(n1, n2) {
            let Terminado = false;
            let i = 0;
            let TempN1 = n1[propiedad];
            let TempN2 = n2[propiedad];
            TempN1 = TempN1 + "";
            TempN2 = TempN2 + "";
            let Arreglo1 = [];
            let Arreglo2 = [];
            try {
                Arreglo1 = TempN1.trim().split(/[ ,.]+/);
                Arreglo2 = TempN2.trim().split(/[ ,.]+/)
            } catch (error) {
                console.error(error);
            }
            let retorno = -1;
            while (!Terminado) {
                if (Arreglo1.length <= i) {
                    Terminado = true;
                    retorno = -1;
                    break;
                }
                if (Arreglo2.length <= i) {
                    Terminado = true;
                    retorno = 1;
                    break;
                }
                let Parte1 = Arreglo1[i];
                let Parte2 = Arreglo2[i];
                var A = parseInt(Parte1);
                var B = parseInt(Parte2);
                if (isNaN(A)) {
                    A = Parte1;
                }
                if (isNaN(B)) {
                    B = Parte2;
                }
                i++;
                if (A < B) {
                    retorno = -1;
                    Terminado = true;
                    break;
                } else if (A > B) {
                    retorno = 1;
                    Terminado = true;
                    break;
                } else {
                    continue;
                }
            }
            return invertido ? -retorno : retorno;
        };
    }

    SortBy(campo) {
        if (this.CampoSorteando != campo) {
            this.CampoSorteando = campo;
        } else {
            this.Invertido = !this.Invertido;
        }
        //Genero copia del listado
        var ListaCopia = [...this.ListReportProd];
        //Lo sorteo
        var ListaCopiaSorteada: string[][] = ListaCopia.sort(this.SortearPorPropiedadMetodo(campo, this.Invertido));
        this.ListReportProd = ListaCopiaSorteada;
    }

    showList() {
        this.checked = false;
        this.calcsubtotal();
    }

    async changeCheked(el) {
        if (el) {
            for (let i = 0; i < this.ListChecked.length; i++) {
                this.ListChecked[i] = true;
            }
        }
    }

    allChecked(el) {
        this.changeCheked(el).then(response => {
            CPrint(this.ListChecked);
            this.calcsubtotal()
        })
    }

    async getVehicles() {

        this.http2.get(Urlbase.tienda + "/pedidos/vehiculos").subscribe(response => {
            this.ListVehicles = response;
            this.SelectedVehicle = response[0].id_VEHICULO;
            //@ts-ignore
            response.forEach(element => {
            this.allVehicles.push(element.id_VEHICULO)

      });
        })

    }
    sendProducts(){
        this.http2.post(Urlbase.facturacion + "/pedidos/sendPedidosV2?idbpedido="+this.data.elem.id_BILL+"&idstoreprov="+this.data.elem.id_STORE+"&idstoreclient="+this.data.elem.id_STORE_CLIENT+"&idplanilla="+this.selectedPlanilla,{}).subscribe(idBillVent => {
            if(idBillVent!=0){
                this.http2.get(Urlbase.facturacion+"/billing/UniversalPDF?id_bill="+idBillVent+"&pdf=-1&cash=0&size="+false,{responseType: 'text'}).subscribe(response =>{
                    //-----------------------------------------------------------------------------------------------------------------
                    window.open(Urlbase.facturas+"/"+response, "_blank");
                    this.dialogRef.close();
                    this.mostrandoCargando = false;
                    this.http2.put(Urlbase.facturacion +"/billing/domiciliario?id_bill=" + idBillVent + "&id_third=-1", {}).subscribe(responseItem => {
                        CPrint("THIS IS ITEM, " + responseItem);
                    });
                    //-----------------------------------------------------------------------------------------------------------------
                });
            }else{
                alert("La factura resultante tenia detalles vacios por falta de inventario.");
                this.dialogRef.close();
                this.mostrandoCargando = false;
                this.http2.put(Urlbase.facturacion +"/billing/domiciliario?id_bill=" + idBillVent + "&id_third=-1", {}).subscribe(responseItem => {
                    CPrint("THIS IS ITEM, " + responseItem);
                });
            }
        })
    }

    sendProductsOR() {
        let cont = 0;
        this.alttotal = 0;
        this.altsubtotal = 0;
        this.alttax = 0;
        let listToPost = [];
        this.mostrandoCargando = true;
        this.http2.get(Urlbase.facturacion + "/pedidos/billtoupdate?idstore=" + this.data.elem.id_STORE_CLIENT + "&idstoreclient=" + this.data.elem.id_STORE + "&numpedido=" + this.data.elem.numpedido).subscribe(element => {
            this.estadoCargando = "Procesando - 1";
            let idToUpDate = this.data.elem.id_BILL;
            //@ts-ignore
            let idToUpDate2 = element.id_bill;
            //@ts-ignore
            let idEmployeeC = element.id_third_employee;
            //@ts-ignore
            let idthirdc = element.id_third;
            let billType1 = 1;
            let billType2 = 46;
            if (idthirdc == this.locStorage.getThird().id_third) {
                billType1 = 4;
                billType2 = 47;
            }

            //@ts-ignore
            CPrint("I WILL USE THIS TO MY ADVANTAGE: ", this.data.elem.id_BILL, element.id_bill);
            this.http2.put(Urlbase.facturacion + "/pedidos/billstate?billstate=82&billid=" + idToUpDate, null).subscribe(a => {
                this.estadoCargando = "Procesando - 2";
                this.http2.put(Urlbase.facturacion + "/pedidos/billstate?billstate=81&billid=" + idToUpDate2, null).subscribe(a => {
                    this.estadoCargando = "Procesando - 3";
                    this.checkDetails().then(item => {
                        CPrint("THIS IS JSON: ", {
                            id_third_employee: this.locStorage.getPerson().id_person,
                            id_third: this.locStorage.getThird().id_third,
                            id_store: this.locStorage.getIdStore(),
                            totalprice: Math.round(this.subtotal + this.tax),
                            subtotal: this.subtotal,
                            tax: this.tax,
                            id_bill_state: 1,
                            id_bill_type: billType1,
                            id_third_destinity: idthirdc,
                            id_store_cliente: this.data.elem.id_STORE_CLIENT,
                            num_documento_cliente: this.elem.numpedido
                        });
                        this.http2.post(Urlbase.facturacion + "/pedidos/create2", {
                            id_third_employee: this.locStorage.getPerson().id_person,
                            id_third: this.locStorage.getThird().id_third,
                            id_store: this.locStorage.getIdStore(),
                            totalprice: Math.round(this.subtotal + this.tax),
                            subtotal: this.subtotal,
                            tax: this.tax,
                            id_bill_state: 1,
                            id_bill_type: billType1,
                            id_third_destinity: idthirdc,
                            id_store_cliente: this.data.elem.id_STORE_CLIENT,
                            num_documento_cliente: this.elem.numpedido
                        }).subscribe(idBillVent => {

                            CPrint("LOGRE ENTRAR #1");
                            this.http2.post(Urlbase.facturacion + "/pedidos/create2", {
                                id_third_employee: idEmployeeC,
                                id_third: idthirdc,
                                id_store: this.data.elem.id_STORE_CLIENT,
                                totalprice: Math.round(this.subtotal + this.tax),
                                subtotal: this.subtotal,
                                tax: this.tax,
                                id_bill_state: 1,
                                id_bill_type: billType2,
                                id_third_destinity: this.locStorage.getThird().id_third,
                                id_store_cliente: this.locStorage.getIdStore(),
                                num_documento_cliente: this.elem.numpedido
                            }).subscribe(idBillVent2 => {
                                CPrint("THIS IDBILLVENTA: ", idBillVent + "THIS IDBILLVENTA2: ", idBillVent2);
                                this.http2.post(Urlbase.facturacion + "/pedidos/create2", {
                                    id_third_employee: this.locStorage.getPerson().id_person,
                                    id_third: this.locStorage.getThird().id_third,
                                    id_store: this.locStorage.getIdStore(),
                                    totalprice: Math.round(this.subtotal + this.tax),
                                    subtotal: this.subtotal,
                                    tax: this.tax,
                                    id_bill_state: 1,
                                    id_bill_type: 88,
                                    id_third_destinity: idthirdc,
                                    id_store_cliente: this.data.elem.id_STORE_CLIENT,
                                    num_documento_cliente: this.elem.numpedido
                                }).subscribe(result => {
                                    CPrint("ENTRE FINAL");
                                    this.estadoCargando = "Procesando - 4";
                                    if (this.ListChecked.includes(false)) {
                                        this.estadoCargando = "Procesando - 5";
                                        CPrint("PUDE ENTRAR AL IF");
                                        this.http2.post(Urlbase.facturacion + "/pedidos/create2", {
                                            id_third_employee: this.locStorage.getPerson().id_person,
                                            id_third: this.locStorage.getThird().id_third,
                                            id_store: this.locStorage.getIdStore(),
                                            totalprice: 1,
                                            subtotal: 1,
                                            tax: this.tax,
                                            id_bill_state: 65,
                                            id_bill_type: 89,
                                            id_third_destinity: idthirdc,
                                            id_store_cliente: this.data.elem.id_STORE_CLIENT,
                                            num_documento_cliente: this.elem.numpedido
                                        }).subscribe(altBillId => {

                                            this.http2.post(Urlbase.facturacion + "/pedidos/create2", {
                                                id_third_employee: this.locStorage.getPerson().id_person,
                                                id_third: idthirdc,
                                                id_store: this.data.elem.id_STORE_CLIENT,
                                                totalprice: 1,
                                                subtotal: 1,
                                                tax: this.tax,
                                                id_bill_state: 67,
                                                id_bill_type: 90,
                                                id_third_destinity: this.locStorage.getThird().id_third,
                                                id_store_cliente: this.locStorage.getIdStore(),
                                                num_documento_cliente: this.elem.numpedido
                                            }).subscribe(altBillId2 => {
                                                this.postAll(altBillId, altBillId2).then(thing2 => {
                                                    this.getAll(billType1, result, idBillVent, idBillVent2).then(thing => {
                                                        this.http2.put(Urlbase.facturacion + "/pedidos/billvalues2?idbill=" + idBillVent, {}, ).subscribe(a => {
                                                            this.http2.put(Urlbase.facturacion + "/pedidos/billvalues2?idbill=" + idBillVent2, {}, ).subscribe(a => {
                                                                this.http2.put(Urlbase.facturacion + "/pedidos/billvalues2?idbill=" + result, {}, ).subscribe(a => {
                                                                    this.http2.put(Urlbase.facturacion + "/pedidos/billvalues2?idbill=" + altBillId, {}, ).subscribe(a => {
                                                                        this.http2.put(Urlbase.facturacion + "/pedidos/billvalues2?idbill=" + altBillId2, {}, ).subscribe(a => {

                                                                            this.http2.get(Urlbase.facturacion + "/billing/detail?id_bill=" + idBillVent).subscribe(datasets => {
                                                                                CPrint("THIS IS 1st Detail Check: ", datasets);
                                                                            });
                                                                            this.estadoCargando = "Procesando - 6";
                                                                            CPrint("THIS IS RESULT: ", result, ", and THIS IS STORE: ", this.locStorage.getIdStore() + ", and THIS IS THIRD: ", this.locStorage.getThird().id_third);
                                                                            this.http2.get(Urlbase.facturacion + "/billing/master2?id_bill=" + idBillVent + "&id_store=" + this.locStorage.getIdStore()).subscribe(
                                                                                dataresult => {
                                                                                    CPrint("THIS IS THE DATARESULT,", dataresult);
                                                                                    if (idthirdc != this.locStorage.getThird().id_third) {
                                                                                        //@ts-ignore
                                                                                        this.prefix = dataresult.prefix_BILL;
                                                                                    } else {
                                                                                        this.prefix = "SA"
                                                                                    }
                                                                                    let clientData = new ClientData(true, 'Cliente Ocasional', ' ', ' ', ' ', ' ', ' ', null);
                                                                                    this.http2.get(Urlbase.facturacion + "/pedidos/procedimiento?idbventa=" + idBillVent + "&idcompra=" + idBillVent2 + "&idremision=" + result).subscribe(flagDo => {
                                                                                        CPrint("THIS IS FLAGDO: ", flagDo);
                                                                                        this.http2.get(Urlbase.facturacion + "/billing/detail?id_bill=" + idBillVent).subscribe(datasets => {
                                                                                            CPrint("THIS IS 2nd Detail Check: ", datasets);
                                                                                        });
                                                                                        if (flagDo == 1) {
                                                                                            this.http2.get(Urlbase.facturacion + "/billing/legaldata?id_third=" + this.locStorage.getThird().id_third).subscribe(legalData => {
                                                                                                CPrint("THIS IS MY LEGAL DATA,", legalData);
                                                                                                CPrint("THIS IS MY CONSULTA, ", Urlbase.facturacion + "/billing/legaldata?id_third=" + this.locStorage.getThird().id_third);
                                                                                                CPrint("this is pdfData1: ", JSON.stringify(this.pdfDatas));

                                                                                                this.http2.put(Urlbase.facturacion + "/pedidos/billvalues2?idbill=" + idBillVent, {}, {
                                                                                                    responseType: 'text'
                                                                                                }).subscribe(a => {
                                                                                                    this.http2.put(Urlbase.facturacion + "/pedidos/billvalues2?idbill=" + idBillVent2, {}, {
                                                                                                        responseType: 'text'
                                                                                                    }).subscribe(a => {
                                                                                                        this.http2.put(Urlbase.facturacion + "/pedidos/billvalues2?idbill=" + result, {}, {
                                                                                                            responseType: 'text'
                                                                                                        }).subscribe(a => {
                                                                                                            this.http2.put(Urlbase.facturacion + "/pedidos/billvalues2?idbill=" + altBillId, {}, {
                                                                                                                responseType: 'text'
                                                                                                            }).subscribe(a => {
                                                                                                                this.http2.put(Urlbase.facturacion + "/pedidos/billvalues2?idbill=" + altBillId2, {}, {
                                                                                                                    responseType: 'text'
                                                                                                                }).subscribe(a => {
                                                                                                                    this.http2.get(Urlbase.facturacion + "/billing/detail?id_bill=" + result).subscribe(datasets => {
                                                                                                                        this.http2.post(Urlbase.facturacion + "/pedidos/procedure2?idvehiculo=" + this.selectedPlanilla + "&idbventa=" + idBillVent + "&idbcompra=" + idBillVent2 + "&idbremision=" + result + "&idstorecliente=" + this.data.elem.id_STORE_CLIENT + "&idstoreproveedor=" + this.locStorage.getIdStore() + "&idbpedidoproveedor=" + idToUpDate, {}).subscribe(dat => {
                                                                                                                            this.http2.get(Urlbase.facturacion + "/billing/detail?id_bill=" + result).subscribe(dataset => {
                                                                                                                                this.http2.get(Urlbase.facturacion + "/billing/detail?id_bill=" + idBillVent).subscribe(datasetsu => {
                                                                                                                                    CPrint("THIS IS 3rd Detail Check: ", datasetsu);
                                                                                                                                });
                                                                                                                                this.estadoCargando = "Procesando - 7";
                                                                                                                                //@ts-ignore
                                                                                                                                this.pdfDatas = new pdfData(this.locStorage.getThird().info.type_document + " " + this.locStorage.getThird().info.document_number, "Régimen Simplificado", "Efectivo", dataresult.fullname, dataresult.store_NAME, dataresult.purchase_DATE, "-1", this.prefix + " - " + dataresult.consecutive, dataset, dataresult.subtotal, dataresult.tax, dataresult.totalprice, this.locStorage.getPerson().first_name + " " + this.locStorage.getPerson().first_lastname, 0, legalData[0].city_NAME + ", " + legalData[0].address, legalData[0].phone1, clientData.document_type + ": " + clientData.document_number, this.data.elem.cliente, clientData.address, clientData.phone, legalData[0].resolucion_DIAN, legalData[0].regimen_TRIBUTARIO, legalData[0].prefix_BILL, legalData[0].initial_RANGE, legalData[0].final_RANGE, 2);

                                                                                                                                CPrint("billType1 es " + billType1);
                                                                                                                                if (billType1 == 4) {
                                                                                                                                    //@ts-ignore
                                                                                                                                    CPrint("this is pdf data ill use, ENTRADA: ", new pdfData(this.locStorage.getThird().info.type_document + " " + this.locStorage.getThird().info.document_number, "Régimen Simplificado", "Efectivo", dataresult.fullname, dataresult.store_NAME, dataresult.purchase_DATE, "-1", this.prefix + " - " + dataresult.consecutive, dataset, dataresult.subtotal, dataresult.tax, dataresult.totalprice, this.locStorage.getPerson().first_name + " " + this.locStorage.getPerson().first_lastname, 0, legalData[0].city_NAME + ", " + legalData[0].address, legalData[0].phone1, clientData.document_type + ": " + clientData.document_number, this.data.elem.cliente, clientData.address, clientData.phone, legalData[0].resolucion_DIAN, legalData[0].regimen_TRIBUTARIO, legalData[0].prefix_BILL, legalData[0].initial_RANGE, legalData[0].final_RANGE, 2));
                                                                                                                                    this.http2.put(Urlbase.facturacion + "/pedidos/billvalues2?idbill=" + idBillVent, {}, ).subscribe(a => {
                                                                                                                                        this.http2.get(Urlbase.facturacion + "/billing/master2?id_bill=" + idBillVent + "&id_store=" + this.locStorage.getIdStore()).subscribe(
                                                                                                                                            dataresult => {
                                                                                                                                                this.http2.get(Urlbase.facturacion + "/pedidos/datosClientePedido?idbill=" + idBillVent).subscribe(dataClient => {
                                                                                                                                                    this.http2.post(Urlbase.facturacion + "/billing/createPaymentDetail?idbill=" + idBillVent, {}).subscribe(didIMadePaymentDetail => {
                                                                                                                                                        //IMPLEMENTO METODO PDF UNIVERSAL
                                                                                                                                                        this.http2.get(Urlbase.facturacion+"/billing/UniversalPDF?id_bill="+idBillVent+"&pdf=-1&cash=0&size="+false,{responseType: 'text'}).subscribe(response =>{
                                                                                                                                                            //-----------------------------------------------------------------------------------------------------------------
                                                                                                                                                            window.open(Urlbase.facturas+"/"+response, "_blank");
                                                                                                                                                            this.dialogRef.close();
                                                                                                                                                            this.mostrandoCargando = false;
                                                                                                                                                            this.http2.put(Urlbase.facturacion +"/billing/domiciliario?id_bill=" + idBillVent + "&id_third=-1", {}).subscribe(responseItem => {
                                                                                                                                                                CPrint("THIS IS ITEM, " + responseItem);
                                                                                                                                                            });
                                                                                                                                                            //-----------------------------------------------------------------------------------------------------------------
                                                                                                                                                        });
                                                                                                                                                    })
                                                                                                                                                })
                                                                                                                                            });
                                                                                                                                    });
                                                                                                                                } else {
                                                                                                                                    //@ts-ignore
                                                                                                                                    CPrint("this is pdf data ill use, VENTA: ", JSON.stringify((new pdfData(this.locStorage.getThird().info.type_document + " " + this.locStorage.getThird().info.document_number, "Régimen Simplificado", "Efectivo", dataresult.fullname, dataresult.store_NAME, dataresult.purchase_DATE, "-1", this.prefix + " - " + dataresult.consecutive, dataset, dataresult.subtotal, dataresult.tax, dataresult.totalprice, this.locStorage.getPerson().first_name + " " + this.locStorage.getPerson().first_lastname, 0, legalData[0].city_NAME + ", " + legalData[0].address, legalData[0].phone1, clientData.document_type + ": " + clientData.document_number, this.data.elem.cliente, clientData.address, clientData.phone, legalData[0].resolucion_DIAN, legalData[0].regimen_TRIBUTARIO, legalData[0].prefix_BILL, legalData[0].initial_RANGE, legalData[0].final_RANGE, 2))));
                                                                                                                                    this.http2.put(Urlbase.facturacion + "/pedidos/billvalues2?idbill=" + idBillVent, {}, ).subscribe(a => {
                                                                                                                                        this.http2.get(Urlbase.facturacion + "/billing/master2?id_bill=" + idBillVent + "&id_store=" + this.locStorage.getIdStore()).subscribe(
                                                                                                                                            dataresult => {
                                                                                                                                                this.http2.get(Urlbase.facturacion + "/pedidos/datosClientePedido?idbill=" + idBillVent).subscribe(dataClient => {
                                                                                                                                                    this.http2.post(Urlbase.facturacion + "/billing/createPaymentDetail?idbill=" + idBillVent, {}).subscribe(resp => {
                                                                                                                                                        //IMPLEMENTO METODO PDF UNIVERSAL
                                                                                                                                                        this.http2.get(Urlbase.facturacion+"/billing/UniversalPDF?id_bill="+idBillVent+"&pdf=-1&cash=0&size="+false,{responseType: 'text'}).subscribe(response =>{
                                                                                                                                                            //-----------------------------------------------------------------------------------------------------------------
                                                                                                                                                            window.open(Urlbase.facturas+"/"+response, "_blank");
                                                                                                                                                            this.dialogRef.close();
                                                                                                                                                            this.mostrandoCargando = false;
                                                                                                                                                            this.http2.put(Urlbase.facturacion +"/billing/domiciliario?id_bill=" + idBillVent + "&id_third=-1", {}).subscribe(responseItem => {
                                                                                                                                                                CPrint("THIS IS ITEM, " + responseItem);
                                                                                                                                                            });
                                                                                                                                                            //-----------------------------------------------------------------------------------------------------------------
                                                                                                                                                        });
                                                                                                                                                    })
                                                                                                                                                })
                                                                                                                                            })
                                                                                                                                    });
                                                                                                                                }
                                                                                                                            })
                                                                                                                        })
                                                                                                                    })
                                                                                                                })
                                                                                                            })
                                                                                                        });
                                                                                                    });
                                                                                                });
                                                                                            });
                                                                                        } else {
                                                                                            this.mostrandoCargando = false;
                                                                                            this.showNotification('top', 'center', 3, "<h3>El pedido se movio a pedidos faltantes pues no habia inventario disponible.</h3> ", 'info')
                                                                                        }
                                                                                    });
                                                                                });
                                                                        });
                                                                    });
                                                                });
                                                            })
                                                        });
                                                    });
                                                });
                                            });
                                        });
                                    } else {
                                        this.estadoCargando = "Procesando - 8";
                                        this.getAll(billType1, result, idBillVent, idBillVent2).then(thing => {
                                            this.http2.put(Urlbase.facturacion + "/pedidos/billvalues2?idbill=" + idBillVent, {}, ).subscribe(a => {
                                                this.http2.put(Urlbase.facturacion + "/pedidos/billvalues2?idbill=" + idBillVent2, {}, ).subscribe(a => {
                                                    this.http2.put(Urlbase.facturacion + "/pedidos/billvalues2?idbill=" + result, {}, ).subscribe(a => {

                                                        this.http2.get(Urlbase.facturacion + "/billing/detail?id_bill=" + idBillVent).subscribe(datasets => {
                                                            CPrint("THIS IS 1st Detail Check: ", datasets);
                                                        });
                                                        this.estadoCargando = "Procesando - 9";
                                                        CPrint("THIS IS RESULT: ", result, ", and THIS IS STORE: ", this.locStorage.getIdStore() + ", and THIS IS THIRD: ", this.locStorage.getThird().id_third);
                                                        this.http2.get(Urlbase.facturacion + "/billing/master2?id_bill=" + idBillVent + "&id_store=" + this.locStorage.getIdStore()).subscribe(
                                                            dataresult => {
                                                                if (idthirdc != this.locStorage.getThird().id_third) {
                                                                    //@ts-ignore
                                                                    this.prefix = dataresult.prefix_BILL;
                                                                } else {
                                                                    this.prefix = "SA"
                                                                }
                                                                let clientData = new ClientData(true, 'Cliente Ocasional', ' ', ' ', ' ', ' ', ' ', null);
                                                                CPrint("THIS IS DATA RESULT, ", dataresult);
                                                                CPrint(Urlbase.facturacion + "/pedidos/procedimiento?idbventa=" + idBillVent + "&idcompra=" + idBillVent2 + "&idremision=" + result);
                                                                this.http2.get(Urlbase.facturacion + "/pedidos/procedimiento?idbventa=" + idBillVent + "&idcompra=" + idBillVent2 + "&idremision=" + result).subscribe(flagDo => {
                                                                    this.http2.get(Urlbase.facturacion + "/billing/detail?id_bill=" + idBillVent).subscribe(datasets => {
                                                                        CPrint("THIS IS 2nd Detail Check: ", datasets);
                                                                    });
                                                                    if (flagDo == 1) {
                                                                        CPrint("ENTRE");
                                                                        CPrint(Urlbase.facturacion + "/pedidos/procedure2?idvehiculo=" + this.selectedPlanilla + "&idbventa=" + idBillVent + "&idbcompra=" + idBillVent2 + "&idbremision=" + result + "&idstorecliente=" + this.data.elem.id_STORE_CLIENT + "&idstoreproveedor=" + this.locStorage.getIdStore() + "&idbpedidoproveedor=" + idToUpDate);
                                                                        this.http2.post(Urlbase.facturacion + "/pedidos/procedure2?idvehiculo=" + this.selectedPlanilla + "&idbventa=" + idBillVent + "&idbcompra=" + idBillVent2 + "&idbremision=" + result + "&idstorecliente=" + this.data.elem.id_STORE_CLIENT + "&idstoreproveedor=" + this.locStorage.getIdStore() + "&idbpedidoproveedor=" + idToUpDate, {}).subscribe(dat => {
                                                                            this.http2.get(Urlbase.facturacion + "/billing/detail?id_bill=" + idBillVent).subscribe(datasets => {
                                                                                CPrint("THIS IS 3rd Detail Check: ", datasets);
                                                                            });
                                                                            this.http2.get(Urlbase.facturacion + "/billing/legaldata?id_third=" + this.locStorage.getThird().id_third).subscribe(legalData => {
                                                                                this.http2.get(Urlbase.facturacion + "/billing/detail?id_bill=" + result).subscribe(dataset => {
                                                                                    CPrint("THIS IS MY LEGAL DATA,", legalData);

                                                                                    CPrint("THIS IS MY CONSULTA, ", Urlbase.facturacion + "/billing/legaldata?id_third=" + this.locStorage.getThird().id_third);
                                                                                    //@ts-ignore
                                                                                    this.pdfDatas = new pdfData(this.locStorage.getThird().info.type_document + " " + this.locStorage.getThird().info.document_number, "Régimen Simplificado", "Efectivo", dataresult.fullname, dataresult.store_NAME, dataresult.purchase_DATE, "-1", this.prefix + " - " + dataresult.consecutive, dataset, dataresult.subtotal, dataresult.tax, dataresult.totalprice, this.locStorage.getPerson().first_name + " " + this.locStorage.getPerson().first_lastname, 0, legalData[0].city_NAME + ", " + legalData[0].address, legalData[0].phone1, clientData.document_type + ": " + clientData.document_number, this.data.elem.cliente, clientData.address, clientData.phone, legalData[0].resolucion_DIAN, legalData[0].regimen_TRIBUTARIO, legalData[0].prefix_BILL, legalData[0].initial_RANGE, legalData[0].final_RANGE, 2);


                                                                                    CPrint("this is pdfData1: ", JSON.stringify(this.pdfDatas));



                                                                                    this.http2.put(Urlbase.facturacion + "/pedidos/billvalues2?idbill=" + idBillVent, {}, {
                                                                                        responseType: 'text'
                                                                                    }).subscribe(a => {
                                                                                        this.http2.put(Urlbase.facturacion + "/pedidos/billvalues2?idbill=" + idBillVent2, {}, {
                                                                                            responseType: 'text'
                                                                                        }).subscribe(a => {
                                                                                            this.http2.put(Urlbase.facturacion + "/pedidos/billvalues2?idbill=" + result, {}, {
                                                                                                responseType: 'text'
                                                                                            }).subscribe(a => {
                                                                                                this.estadoCargando = "Procesando - 10";
                                                                                                CPrint("THIS IS DATARESULT,", dataresult);
                                                                                                if (billType1 == 4) {

                                                                                                    this.http2.put(Urlbase.facturacion + "/pedidos/billvalues2?idbill=" + idBillVent, {}, {
                                                                                                        responseType: 'text'
                                                                                                    }).subscribe(a => {
                                                                                                        this.http2.get(Urlbase.facturacion + "/billing/master2?id_bill=" + idBillVent + "&id_store=" + this.locStorage.getIdStore()).subscribe(
                                                                                                            dataresult => {
                                                                                                                this.http2.get(Urlbase.facturacion + "/pedidos/datosClientePedido?idbill=" + idBillVent).subscribe(dataClient => {
                                                                                                                    this.http2.post(Urlbase.facturacion + "/billing/createPaymentDetail?idbill=" + idBillVent, {}).subscribe(resp => {
                                                                                                                        //IMPLEMENTO METODO PDF UNIVERSAL
                                                                                                                        this.http2.get(Urlbase.facturacion+"/billing/UniversalPDF?id_bill="+idBillVent+"&pdf=-1&cash=0&size="+false,{responseType: 'text'}).subscribe(response =>{
                                                                                                                            //-----------------------------------------------------------------------------------------------------------------
                                                                                                                            window.open(Urlbase.facturas+"/"+response, "_blank");
                                                                                                                            this.dialogRef.close();
                                                                                                                            this.mostrandoCargando = false;
                                                                                                                            this.http2.put(Urlbase.facturacion+"/billing/domiciliario?id_bill=" + idBillVent + "&id_third=-1", {}).subscribe(responseItem => {
                                                                                                                                CPrint("THIS IS ITEM, " + responseItem);
                                                                                                                            })
                                                                                                                            //-----------------------------------------------------------------------------------------------------------------
                                                                                                                        })
                                                                                                                    });
                                                                                                                })
                                                                                                            })
                                                                                                    })
                                                                                                } else {
                                                                                                    this.http2.put(Urlbase.facturacion + "/pedidos/billvalues2?idbill=" + idBillVent, {}, {
                                                                                                        responseType: 'text'
                                                                                                    }).subscribe(a => {
                                                                                                        this.http2.get(Urlbase.facturacion + "/billing/master2?id_bill=" + idBillVent + "&id_store=" + this.locStorage.getIdStore()).subscribe(
                                                                                                            dataresult => {
                                                                                                                this.http2.get(Urlbase.facturacion + "/pedidos/datosClientePedido?idbill=" + idBillVent).subscribe(dataClient => {
                                                                                                                    this.http2.post(Urlbase.facturacion + "/billing/createPaymentDetail?idbill=" + idBillVent, {}).subscribe(resp => {
                                                                                                                        //IMPLEMENTO METODO PDF UNIVERSAL
                                                                                                                        this.http2.get(Urlbase.facturacion+"/billing/UniversalPDF?id_bill="+idBillVent+"&pdf=-1&cash=0&size="+false,{responseType: 'text'}).subscribe(response =>{
                                                                                                                            //-----------------------------------------------------------------------------------------------------------------
                                                                                                                            window.open(Urlbase.facturas+"/"+response, "_blank");
                                                                                                                            this.dialogRef.close();
                                                                                                                            this.mostrandoCargando = false;
                                                                                                                            this.http2.put(Urlbase.facturacion+"/billing/domiciliario?id_bill=" + idBillVent + "&id_third=-1", {}).subscribe(responseItem => {
                                                                                                                                CPrint("THIS IS ITEM, " + responseItem);
                                                                                                                            })
                                                                                                                            //-----------------------------------------------------------------------------------------------------------------
                                                                                                                        });
                                                                                                                    });
                                                                                                                })
                                                                                                            })
                                                                                                    })
                                                                                                }
                                                                                            })
                                                                                        })
                                                                                    })
                                                                                })
                                                                            });
                                                                        });
                                                                    }
                                                                });
                                                            });


                                                    });
                                                });
                                            });
                                        })
                                    }
                                })
                            })
                        })
                    })
                })
            })
        });
        CPrint("I NEDD THIS; ", listToPost);
    }

    async getAlts() {
        this.ListReportProd.array.forEach((element, index) => {
            if (!this.ListChecked[index]) {
                this.http2.get(Urlbase.facturacion + "/pedidos/price?idps=" + element.id_PRODUCT_THIRD).subscribe(r => {
                    CPrint("this is element 1: ", element.id_PRODUCT_THIRD);
                    this.http2.get(Urlbase.facturacion + "/pedidos/tax?idps=" + element.id_PRODUCT_THIRD).subscribe(rE => {
                        CPrint("this is element 2: ", element.id_PRODUCT_THIRD);
                    });
                });
            }
        });
    }

    async checkDetails() {
        this.ListReportProd.forEach((element, index) => {
            //@ts-ignore
            this.http2.get(Urlbase.facturacion + "/pedidos/quantity?id_product_store=" + element.id_PRODUCT_THIRD).subscribe(response => {
                //@ts-ignore
                CPrint("PSID: " + element.id_PRODUCT_THIRD + ", INVENTORY QUANTITY: " + response + ", INDEX: " + index);
                //@ts-ignore
                if ((response - element.cantidad) < 0) {
                    CPrint("ENTRE AL IF DE CANTIDADES");
                    this.ListChecked[index] = false;
                }
            });
        });

    }

    async postAll(result, result2) {
        this.ListChecked.forEach((element, index) => {
            if (!element) {
                let quantity = this.ListReportProd[index].cantidad;
                let thise = this.ListReportProd[index];
                this.http2.get(Urlbase.facturacion + "/pedidos/quantity?id_product_store=" + this.ListReportProd[index].id_PRODUCT_THIRD).subscribe(res => {
                    //@ts-ignore
                    if ((quantity - res) > 0 && ((res - quantity) > quantity)) {
                        this.http2.get(Urlbase.facturacion + "/pedidos/price?idps=" + thise.id_PRODUCT_THIRD).subscribe(r => {
                            this.http2.get(Urlbase.facturacion + "/pedidos/tax?idps=" + thise.id_PRODUCT_THIRD).subscribe(rE => {

                                //@ts-ignore
                                this.http2.post(Urlbase.facturacion + "/pedidos/detail?id_bill=" + result + "&cantidad=" + quantity + "&id_ps=" + thise.id_PRODUCT_THIRD + "&price=" + r + "&tax=" + rE, null).subscribe(
                                    rta => {
                                        this.http2.get(Urlbase.facturacion + "/pedidos/ps?id_product_store=" + thise.id_PRODUCT_THIRD, {
                                            responseType: 'text'
                                        }).subscribe(answer => {
                                            this.http2.get(Urlbase.facturacion + "/pedidos/own?code=" + answer + "&id_store=" + this.data.elem.id_STORE_CLIENT).subscribe(answer2 => {
                                                //@ts-ignore
                                                this.http2.post(Urlbase.facturacion + "/pedidos/detail?id_bill=" + result2 + "&cantidad=" + quantity + "&id_ps=" + answer2 + "&price=" + r + "&tax=" + rE, null).subscribe(
                                                    rta => {})
                                            })
                                        })
                                    })
                            })
                        })
                    } else {
                        //@ts-ignore
                        if ((quantity - res) > 0) {
                            this.http2.get(Urlbase.facturacion + "/pedidos/price?idps=" + thise.id_PRODUCT_THIRD).subscribe(r => {
                                this.http2.get(Urlbase.facturacion + "/pedidos/tax?idps=" + thise.id_PRODUCT_THIRD).subscribe(rE => {

                                    //@ts-ignore
                                    this.http2.post(Urlbase.facturacion + "/pedidos/detail?id_bill=" + result + "&cantidad=" + (quantity - res) + "&id_ps=" + thise.id_PRODUCT_THIRD + "&price=" + r + "&tax=" + rE, null).subscribe(
                                        rta => {
                                            this.http2.get(Urlbase.facturacion + "/pedidos/ps?id_product_store=" + thise.id_PRODUCT_THIRD, {
                                                responseType: 'text'
                                            }).subscribe(answer => {
                                                this.http2.get(Urlbase.facturacion + "/pedidos/own?code=" + answer + "&id_store=" + this.data.elem.id_STORE_CLIENT).subscribe(answer2 => {
                                                    //@ts-ignore
                                                    this.http2.post(Urlbase.facturacion + "/pedidos/detail?id_bill=" + result2 + "&cantidad=" + (quantity - res) + "&id_ps=" + answer2 + "&price=" + r + "&tax=" + rE, null).subscribe(
                                                        rta => {})
                                                })
                                            })
                                        })
                                })
                            })
                        }
                    }
                })
            }
        })
    }

    showNotification(from, align, id_type ? , msn ? , typeStr ? ) {
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

    async getAll(type, result, idBillVent, idBillVent2) {
        let cont = 0;
        this.ListChecked.forEach((element, index) => {
            if (element) {
                CPrint("THIS IS THE LIST ILL NEED, ", this.ListReportProd);
                let quantity = this.ListReportProd[cont].cantidad;
                let thise = this.ListReportProd[cont];

                this.http2.get(Urlbase.facturacion + "/pedidos/price?idps=" + this.ListReportProd[cont].id_PRODUCT_THIRD).subscribe(r => {
                    CPrint("THIS ELEMENT IS MY PRICE: " + r);
                    this.http2.get(Urlbase.facturacion + "/pedidos/tax?idps=" + thise.id_PRODUCT_THIRD).subscribe(rE => {

                        if (type == 1) {
                            //@ts-ignore
                            this.http2.post(Urlbase.facturacion + "/pedidos/detail?id_bill=" + idBillVent + "&cantidad=" + quantity + "&id_ps=" + thise.id_PRODUCT_THIRD + "&price=" + r + "&tax=" + rE, null).subscribe(
                                rta => {}
                            );

                            //@ts-ignore
                            this.http2.post(Urlbase.facturacion + "/pedidos/detail?id_bill=" + idBillVent2 + "&cantidad=" + quantity + "&id_ps=" + thise.id_PRODUCT_THIRD + "&price=" + r + "&tax=" + rE, null).subscribe(
                                rta => {}
                            );
                            //@ts-ignore
                            this.http2.post(Urlbase.facturacion + "/pedidos/detail?id_bill=" + result + "&cantidad=" + quantity + "&id_ps=" + thise.id_PRODUCT_THIRD + "&price=" + r + "&tax=" + rE, null).subscribe(
                                rta => {}
                            )
                        } else {
                            if (type == 4) {
                                //@ts-ignore
                                this.http2.post(Urlbase.facturacion + "/pedidos/detail?id_bill=" + idBillVent + "&cantidad=" + quantity + "&id_ps=" + thise.id_PRODUCT_THIRD + "&price=" + r + "&tax=" + rE, null).subscribe(
                                    rta => {}
                                );

                                //@ts-ignore
                                this.http2.post(Urlbase.facturacion + "/pedidos/detail?id_bill=" + idBillVent2 + "&cantidad=" + quantity + "&id_ps=" + thise.id_PRODUCT_THIRD + "&price=" + r + "&tax=" + rE, null).subscribe(
                                    rta => {}
                                );
                                //@ts-ignore
                                this.http2.post(Urlbase.facturacion + "/pedidos/detail?id_bill=" + result + "&cantidad=" + quantity + "&id_ps=" + thise.id_PRODUCT_THIRD + "&price=" + r + "&tax=" + rE, null).subscribe(
                                    rta => {}
                                )
                            }
                        }
                    })
                });



                this.http2.put(Urlbase.facturacion + "/pedidos/quantity?quantity=" + quantity + "&id_product_store=" + thise.id_PRODUCT_THIRD, null).subscribe(
                    rta => {

                    }
                )
            } else {
                let quantity = this.ListReportProd[cont].cantidad;
                let thise = this.ListReportProd[cont];
                this.http2.get(Urlbase.facturacion + "/pedidos/quantity?id_product_store=" + this.ListReportProd[cont].id_PRODUCT_THIRD).subscribe(res => {
                    //@ts-ignore
                    this.ListReportProd2[index].cantidad = res;
                    //@ts-ignore
                    this.ListReportProd2[index].costototal = res * this.ListReportProd2[index].costo;

                    this.http2.get(Urlbase.facturacion + "/pedidos/price?idps=" + thise.id_PRODUCT_THIRD).subscribe(r => {
                        this.http2.get(Urlbase.facturacion + "/pedidos/tax?idps=" + thise.id_PRODUCT_THIRD).subscribe(rE => {

                            //@ts-ignore
                            this.http2.post(Urlbase.facturacion + "/pedidos/detail?id_bill=" + idBillVent + "&cantidad=" + res + "&id_ps=" + thise.id_PRODUCT_THIRD + "&price=" + r + "&tax=" + rE, null).subscribe(
                                rta => {}
                            );

                            //@ts-ignore
                            this.http2.post(Urlbase.facturacion + "/pedidos/detail?id_bill=" + idBillVent2 + "&cantidad=" + res + "&id_ps=" + thise.id_PRODUCT_THIRD + "&price=" + r + "&tax=" + rE, null).subscribe(
                                rta => {}
                            );
                            //@ts-ignore
                            this.http2.post(Urlbase.facturacion + "/pedidos/detail?id_bill=" + result + "&cantidad=" + res + "&id_ps=" + thise.id_PRODUCT_THIRD + "&price=" + r + "&tax=" + rE, null).subscribe(
                                rta => {}
                            )

                        })
                    });


                    //@ts-ignore
                    this.http2.put(Urlbase.facturacion + "/pedidos/quantity?quantity=" + res + "&id_product_store=" + thise.id_PRODUCT_THIRD, null).subscribe(
                        rta => {

                        }
                    )




                })
            }
            cont++;
        })
    }

    GetElemReady = false;
    async getElem() {
        let cont = 0;
        this.GetElemReady = false;
        let conteo = 0;
        this.ListChecked.forEach(element => {
            if (element) {
                let elem = this.ListReportProd[cont];
                this.http2.get(Urlbase.facturacion + "/pedidos/price?idps=" + elem.id_PRODUCT_THIRD).subscribe(r => {
                    CPrint(r);
                    //@ts-ignore
                    this.subtotal += r * elem.cantidad;
                    this.http2.get(Urlbase.facturacion + "/pedidos/tax?idps=" + elem.id_PRODUCT_THIRD).subscribe(rE => {
                      CPrint("IVA", rE);
                      //@ts-ignore
                      this.tax += (r * elem.cantidad * rE / 100);
                      conteo += 1;
                      if(conteo == this.ListChecked.length){
                        this.GetElemReady = true;
                      }
                    })
                })


            }
            cont++;
        })
    }

    calcsubtotal() {

        this.subtotal = 0;
        this.tax = 0;
        this.total = 0;
        this.getElem().then(responser => {
            CPrint("WTF");
            CPrint(this.subtotal + this.tax)

        });
        this.total = this.subtotal + this.tax;
    }
}



export interface DialogData {
    elem: any,
    autoPilot: any,
    idVehicle: any,
    index: any
}


export class pdfData {
    nit: String;
    regimen: String;
    medio: String;
    empresa: String;
    tienda: String;
    fecha: String;
    caja: String;
    consecutivo: String;
    detalles: [String[]];
    subtotal: number;
    tax: number;
    total: number;
    nombreCajero: String;
    cambio: number;
    direccion: String;
    telefono: String;
    cedula: String;
    cliente: String;
    direccionC: String;
    telefonoC: String;
    resolucion_DIAN: String;
    regimenT: String;
    prefix: String;
    initial_RANGE: String;
    final_RANGE: String;
    pdfSize: number;
    clientData: any;
    constructor(
        clientData: any,
        nit: String,
        regimen: String,
        medio: String,
        empresa: String,
        tienda: String,
        fecha: String,
        caja: String,
        consecutivo: String,
        detalles: [String[]],
        subtotal: number,
        tax: number,
        total: number,
        nombreCajero: string,
        cambio: number,
        direccion: String,
        telefono: String,
        cedula: String,
        cliente: String,
        direccionC: String,
        telefonoC: String,
        resolucion_DIAN: String,
        regimenT: String,
        prefix: String,
        initial_RANGE: String,
        final_RANGE: String,
        pdfSize: number) {
        this.clientData = clientData;
        this.resolucion_DIAN = resolucion_DIAN;
        this.regimenT = regimenT;
        this.prefix = prefix;
        this.initial_RANGE = initial_RANGE;
        this.final_RANGE = final_RANGE;
        this.nombreCajero = nombreCajero;
        this.cambio = cambio;
        this.nit = nit;
        this.regimen = regimen;
        this.medio = medio;
        this.empresa = empresa;
        this.tienda = tienda;
        this.fecha = fecha;
        this.caja = caja;
        this.consecutivo = consecutivo;
        this.detalles = detalles;
        this.subtotal = subtotal;
        this.tax = tax;
        this.total = total;
        this.direccion = direccion;
        this.telefono = telefono;
        this.cedula = cedula;
        this.cliente = cliente;
        this.direccionC = direccionC;
        this.telefonoC = telefonoC;
        this.pdfSize = pdfSize;

    }
}

export class ClientData {
    is_natural_person: boolean;
    fullname: string;
    document_type: string;
    document_number: string;
    address: string;
    phone: string;
    email: string;
    id_third: number;

    constructor(
        is_natural_person, fullname, document_type, document_number, address, phone, email, id_third
    ) {
        this.is_natural_person = is_natural_person;
        this.fullname = fullname;
        this.document_type = document_type;
        this.document_number = document_number;
        this.address = address;
        this.phone = phone;
        this.email = email;
        this.id_third = id_third;
    }
}
