import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { RegistrarPedidoRestauranteComponent } from './registrar-pedido-restaurante.component';

describe('RegistrarPedidoRestauranteComponent', () => {
  let component: RegistrarPedidoRestauranteComponent;
  let fixture: ComponentFixture<RegistrarPedidoRestauranteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ RegistrarPedidoRestauranteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(RegistrarPedidoRestauranteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
