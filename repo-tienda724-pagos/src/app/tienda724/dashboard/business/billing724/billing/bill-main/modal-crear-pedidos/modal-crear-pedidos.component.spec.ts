import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCrearPedidosComponent } from './modal-crear-pedidos.component';

describe('ModalCrearPedidosComponent', () => {
  let component: ModalCrearPedidosComponent;
  let fixture: ComponentFixture<ModalCrearPedidosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCrearPedidosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCrearPedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
