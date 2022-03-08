import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosDomiciliosEntregadosSComponent } from './pedidos-domicilios-entregados-s.component';

describe('PedidosDomiciliosEntregadosSComponent', () => {
  let component: PedidosDomiciliosEntregadosSComponent;
  let fixture: ComponentFixture<PedidosDomiciliosEntregadosSComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidosDomiciliosEntregadosSComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidosDomiciliosEntregadosSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
