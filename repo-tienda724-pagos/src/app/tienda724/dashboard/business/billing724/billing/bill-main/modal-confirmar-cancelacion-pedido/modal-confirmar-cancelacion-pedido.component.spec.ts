import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConfirmarCancelacionPedidoComponent } from './modal-confirmar-cancelacion-pedido.component';

describe('ModalConfirmarCancelacionPedidoComponent', () => {
  let component: ModalConfirmarCancelacionPedidoComponent;
  let fixture: ComponentFixture<ModalConfirmarCancelacionPedidoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalConfirmarCancelacionPedidoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalConfirmarCancelacionPedidoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
