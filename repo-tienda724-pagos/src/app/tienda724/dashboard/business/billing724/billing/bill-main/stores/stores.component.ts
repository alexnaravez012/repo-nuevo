import {Component, OnInit} from '@angular/core';
import {CPrint} from 'src/app/shared/util/CustomGlobalFunctions';
import {BillingService} from '../../../../../../../services/billing.service';
import {ThirdService} from '../../../../../../../services/third.service';
import {LocalStorage} from '../../../../../../../services/localStorage';

@Component({
  selector: 'app-stores',
  templateUrl: './stores.component.html',
  styleUrls: ['./stores.component.scss']
})
export class StoresComponent implements OnInit {
  // Ids
  id_employee;
  idThirdFather;


  // store
  stores;
  boxes;
  storages;
  store =  {
    id_third:null,
    description:"",
    store_number:null,
    entrada_consecutive_initial:null,
    salida_consecutive_initial:null
  }
  box ={
    id_store: null,
    description: "",
    caja_number: null
  }
  storage = {
    id_store:null,
    description:"",
    storage_number:null
  }

  //ionic modal description
  modals= [{
    name: "main", //main modal
    value: true
  },{
    name: "store", //store menu modal
    value: true
  },
  {
    name: "editStore", //store edit modal
    value: true
  },
  {
    name: "editBox", //box edit modal
    value: true
  },
  {
    name: "editStorage", //storage edit modal
    value: true
  }]
  currentModal = "main"

  //edit conditionals
  editingStore = false;
  editingBox = false;
  editingStorage = false;

  // edit elements
  currentIdStore;
  currentIdBox;
  currentIdStorage;
  constructor(private storeService: BillingService, private locStorage: LocalStorage, private thirdService: ThirdService) { }

  ngOnInit() {
    this.currentModal = "main"

    //edit conditionals
    this.editingStore = false;
    this.editingBox = false;
    this.editingStorage = false;

    // edit elements
    this.currentIdStore = null;
    this.currentIdBox = null;
    this.currentIdStorage = null;
    this.store =  {
      id_third:null,
      description:"",
      store_number:null,
      entrada_consecutive_initial:null,
      salida_consecutive_initial:null
    }
    this.storages = null;
    this.boxes = null;
    this.box ={
      id_store: null,
      description: "",
      caja_number: null
    }
    this.storage = {
      id_store:null,
      description:"",
      storage_number:null
    }

        this.idThirdFather = this.locStorage.getToken().id_third_father;
        this.storeService.getStoresByThird(this.idThirdFather).subscribe(res=>{
          this.stores = res;
          CPrint(this.stores)
        })


    // //ionic navbar
    // this.setBackButtonAction()
  }

  async getIdEmployee(){
    this.id_employee = this.locStorage.getPerson().id_person;

  }

  cancelStorage(){
    this.storage = {
      id_store:null,
      description:"",
      storage_number:null
    }
    this.editingStorage = false;
  }

  cancelBox(){
    this.box ={
      id_store: null,
      description: "",
      caja_number: null
    }
    this.editingBox = false;
  }

  cancelStore(){
    this.store =  {
      id_third:null,
      description:"",
      store_number:null,
      entrada_consecutive_initial:null,
      salida_consecutive_initial:null
    }
    this.editingStore = false;
  }

  changeModal(modalName){
    this.modals.forEach((element)=>{
      if(element.value === modalName){
        element.value = true;
      }else{
        element.value = false;
      }
    })
    this.currentModal = modalName;
  }



  loadStore(store){
    CPrint(store,"storesssss")
    if(!this.editingStore){
      this.storeService.getStoragesByStore(store.id_STORE).subscribe(res=>{
        CPrint(res)
        this.storages = res;
      })
      this.storeService.getBoxByStore(store.id_STORE).subscribe(res=>{
        this.boxes = res;
        this.currentIdStore = store.id_STORE;
        CPrint(res)
        this.changeModal("store")
      })
    }else{
      this.currentModal = "editStore";
      this.currentIdStore = store.id_STORE;
      this.store.store_number = store.store_NUMBER;
      this.store.description = store.store_NAME;
      this.store.entrada_consecutive_initial = store.entrada_CONSECUTIVE_INITIAL
      this.store.salida_consecutive_initial = store.salida_CONSECUTIVE_INITIAL
    }

  }

  editBox(box){
    if(this.editingBox){
      this.currentIdBox = box.id_CAJA;
      this.box.description = box.caja_NAME;
      this.box.caja_number = box.caja_NUMBER;
      this.currentModal = "editBox";
    }

  }

  editStorage(storage){
    if(this.editingStorage){
      CPrint("editing")
      this.currentIdStorage = storage.id_storage;
      this.storage.description = storage.storage_name;
      this.storage.storage_number = storage.storage_number;
      this.currentModal = "editStorage";

    }
  }

  //Create and edit methods

  createNewStore(){
    this.store.id_third = this.idThirdFather
    if(this.editingStore){
      CPrint("editing")
      this.storeService.putStore(this.store,this.currentIdStore).subscribe(res=>{
        CPrint(res)
        this.ngOnInit()
      })
    }else{
      CPrint("creating")
      this.storeService.postStore(this.store).subscribe(res=>{
        CPrint(res)
        this.ngOnInit()
      })
    }
  }

  createNewBox(){
    this.box.id_store = this.currentIdStore
    CPrint(this.box)
    if(this.editingBox){
      CPrint("editing")
      this.storeService.putBox(this.box,this.currentIdBox).subscribe(res=>{
        CPrint(res)
        this.ngOnInit()
      })
    }else{
      CPrint("creating")
      this.storeService.postBoxStore(this.box).subscribe(res=>{
        CPrint(res)
        this.ngOnInit()
      })
    }
  }

  createNewStorage(){
    this.storage.id_store = this.currentIdStore
    if(this.editingStorage){
      CPrint("editing")
      this.storeService.putStorage(this.storage,this.currentIdStorage).subscribe(res=>{
        CPrint(res)
        this.ngOnInit()
      })
    }else{
      CPrint("creating")
      this.storeService.postStorage(this.storage).subscribe(res=>{
        CPrint(res)
        this.ngOnInit()
      })
    }
  }


  // // ionic back button
  // setBackButtonAction(){
  //   this.navBar.backButtonClick = () => {
  //   if(this.currentModal !== "main"){
  //     if(this.currentModal === "editStore" || this.currentModal === "store"){
  //       this.currentModal = "main";
  //       this.ngOnInit();
  //     }else{
  //       this.currentModal = "store";
  //     }
  //   }else{
  //     this.navCtrl.pop();
  //   }
  //   }
  // }


}
