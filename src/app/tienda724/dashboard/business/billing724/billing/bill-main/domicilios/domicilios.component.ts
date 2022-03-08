import { Component, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { PedidosDomiciliosCanceladosComponent } from '../pedidos-domicilios-cancelados/pedidos-domicilios-cancelados.component';
import { PedidosDomiciliosRecibidosComponent } from '../pedidos-domicilios-recibidos/pedidos-domicilios-recibidos.component';
import { PedidosDomiciliosProcesadosSComponent } from '../pedidos-domicilios-procesados-s/pedidos-domicilios-procesados-s.component';
import { PedidosDomiciliosProcesadosNComponent } from '../pedidos-domicilios-procesados-n/pedidos-domicilios-procesados-n.component';
import { PedidosDomiciliosEncaminoComponent } from '../pedidos-domicilios-encamino/pedidos-domicilios-encamino.component';
import { PedidosDomiciliosEntregadosSComponent } from '../pedidos-domicilios-entregados-s/pedidos-domicilios-entregados-s.component';
import { PedidosDomiciliosEntregadosNComponent } from '../pedidos-domicilios-entregados-n/pedidos-domicilios-entregados-n.component';
import { PedidosFacturadosComponent } from '../pedidos-facturados/pedidos-facturados.component';
import { PedidosDomiciliosFinalizadosSComponent } from '../pedidos-domicilios-finalizados-s/pedidos-domicilios-finalizados-s.component';
import { PedidosDomiciliosFinalizadosNComponent } from '../pedidos-domicilios-finalizados-n/pedidos-domicilios-finalizados-n.component';
import {FCMservice} from '../../../../../../../services/fcmservice.service';
import {NgxCoolDialogsService} from 'ngx-cool-dialogs';
import {valueReferenceToExpression} from '@angular/compiler-cli/src/ngtsc/annotations/src/util';
import {CPrint} from '../../../../../../../shared/util/CustomGlobalFunctions';
import * as jQuery from 'jquery';

import 'bootstrap-notify';
import {ToastrService} from 'ngx-toastr';
import { PedidosDomiciliosCalificadosComponent } from '../pedidos-domicilios-calificados/pedidos-domicilios-calificados.component';
let $: any = jQuery;

@Component({
  selector: 'app-domicilios',
  templateUrl: './domicilios.component.html',
  styleUrls: ['./domicilios.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class DomiciliosComponent implements OnInit {

  VariableSuscriptor:any = null;

  constructor(private fcmService: FCMservice,private coolDialogs: NgxCoolDialogsService,private toastr: ToastrService) { }

  ngOnInit(): void {
    localStorage.setItem("currentBox",String(2));
 

    if(localStorage.getItem("FCMrequest") != "true"){
      setTimeout(() => {
        this.coolDialogs.alert("Se le va a solicitar permiso de notificaciones, por favor conceder el permiso para poder generar las notificaciones de los cambios de estado").subscribe(res => {
          this.fcmService.requestPermission();
          this.fcmService.receiveMessage();
        })
        //
      },2000,this)
    }else{
      this.fcmService.requestPermission();
      this.fcmService.receiveMessage();
    }

    this.VariableSuscriptor = this.fcmService.currentMessage.subscribe((message:any) => {
      console.log("Mensaje FCM entrante:");
      let retorno = this.toastr.success(message.notification.body, message.notification.title,{closeButton:true,disableTimeOut:true});
      retorno.onHidden.subscribe(value => {
        console.log('solo cerrar');
      })
      retorno.onTap.subscribe(value => {
        console.log('click en la notificación');
        if(message.data.stateP == 99){
          this.setTabIndexGlobal(8);
        }
        if(message.data.stateP == 801){
          this.setTabIndexGlobal(1);
        }
        if(message.data.stateP == 802){
          this.setTabIndexGlobal(2);
          this.setTabIndexProcesados(1);
        }
        if(message.data.stateP == 807){
          this.setTabIndexGlobal(2);
          this.setTabIndexProcesados(0);
        }
        if(message.data.stateP == 804){
          this.setTabIndexGlobal(5);
          this.setTabIndexEntregados(1);
        }
        if(message.data.stateP == 808){
          this.setTabIndexGlobal(5);
          this.setTabIndexEntregados(0);
        }
        if(message.data.stateP == 803){
          this.setTabIndexGlobal(4);
        }
        if(message.data.stateP == 902){
          this.setTabIndexGlobal(3);
        }
        if(message.data.stateP == 806){
          this.setTabIndexGlobal(6);
          this.setTabIndexFinalizados(1);
        }
        if(message.data.stateP == 809){
          this.setTabIndexGlobal(6);
          this.setTabIndexFinalizados(0);
        }
        if(message.data.stateP == 705){
          this.setTabIndexGlobal(7);
        }
      })
      console.log(message);
      if(message.data.stateP == 705){
        this.compUpdate11.ngOnInit();
        this.compUpdate5.updateData();
        this.compUpdate6.updateData();
      }
      if(message.data.stateP == 99){
        this.compUpdate.updateData();
      }
      if(message.data.stateP == 801){
        this.compUpdate2.updateDataRecibidos();
      }
      if(message.data.stateP == 802){
        this.compUpdate3.updateData();
      }
      if(message.data.stateP == 807){
        this.compUpdate4.updateData();
      }
      if(message.data.stateP == 804){
        this.compUpdate5.updateData();
      }
      if(message.data.stateP == 808){
        this.compUpdate6.updateData();
      }
      if(message.data.stateP == 803){
        this.compUpdate7.updateData();
      }
      if(message.data.stateP == 902){
        this.compUpdate8.updateDataRecibidos();
      }
      if(message.data.stateP == 806){
        this.compUpdate9.updateData();
      }
      if(message.data.stateP == 809){
        this.compUpdate10.updateData();
      }
      //this.showNotification('top','right',3,"Notificación entrante <p>"+message.notification.title+"</p>",'info');
    });
  }
  ngOnDestroy() {
    console.log("Se elimina el suscribe")
    //prevent memory leak when component destroyed
    this.VariableSuscriptor.unsubscribe();

  }
  @ViewChild("cancelados") compUpdate: PedidosDomiciliosCanceladosComponent;
  @ViewChild("recibidos") compUpdate2: PedidosDomiciliosRecibidosComponent;
  @ViewChild("procesadosSinNovedad") compUpdate3: PedidosDomiciliosProcesadosSComponent;
  @ViewChild("procesadosNovedad") compUpdate4: PedidosDomiciliosProcesadosNComponent;
  @ViewChild("entregadoSinNovedad") compUpdate5: PedidosDomiciliosEntregadosSComponent;
  @ViewChild("entregadoConNovedad") compUpdate6: PedidosDomiciliosEntregadosNComponent;
  @ViewChild("enCamino") compUpdate7: PedidosDomiciliosEncaminoComponent;
  @ViewChild("facturados") compUpdate8: PedidosFacturadosComponent;
  @ViewChild("finalizadoSinNovedad") compUpdate9: PedidosDomiciliosFinalizadosSComponent;
  @ViewChild("finalizadoConNovedad") compUpdate10: PedidosDomiciliosFinalizadosNComponent;
  @ViewChild("calificados") compUpdate11: PedidosDomiciliosCalificadosComponent;


  SelectedTabIndexGlobal = 0;
  SelectedTabIndexProcesados = 0;
  SelectedTabIndexEntregados = 0;
  SelectedTabIndexFinalizados=0;

  setTabIndexGlobal(index){
    this.SelectedTabIndexGlobal = index;
  }

  setTabIndexProcesados(index){
    this.SelectedTabIndexProcesados = index;
  }

  setTabIndexEntregados(index){
    this.SelectedTabIndexEntregados = index;
  }

  setTabIndexFinalizados(index){
    this.SelectedTabIndexFinalizados = index;
  }


  async SendFCMpush(title,body,data,id_third,nombre,idapp){
    try {
      //Ajuste
      let Llaves = Object.keys(data);
      for(let n = 0;n<Llaves.length;n++){
        data[Llaves[n]] += "";//esto es para estar seguros de que todo se vaya como string
      }
      //
      let Resultado = await this.fcmService.SendMessageToThird(title,body,data,id_third,idapp);
      if(Resultado != "Empty"){
        this.showNotification('top','right',3,"Notificación enviada a <p>"+nombre+"</p>",'success');
      }
    }catch (e) {
      CPrint(e);
      this.showNotification('top','right',3,"No se pudo enviar la notificación a  <p>"+nombre+"</p>",'danger');
    }
  }

  // Notification
  showNotification(from, align,id_type?, msn?, typeStr?){
    const type = ['','info','success','warning','danger'];

    const color = Math.floor((Math.random() * 4) + 1);

    $.notify({
      icon: "notifications",
      message: msn?msn:"<b>Noficación automatica </b>"

    },{
      type: typeStr? typeStr:type[id_type?id_type:2],
      timer: 200,
      placement: {
        from: from,
        align: align
      }
    });
  }
}
