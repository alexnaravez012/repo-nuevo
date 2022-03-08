import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarPedidoRestauranteComponent } from './editar-pedido-restaurante.component';

describe('EditarPedidoRestauranteComponent', () => {
  let component: EditarPedidoRestauranteComponent;
  let fixture: ComponentFixture<EditarPedidoRestauranteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarPedidoRestauranteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarPedidoRestauranteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
