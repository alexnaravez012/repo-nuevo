import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosDomiciliosEntregadosNComponent } from './pedidos-domicilios-entregados-n.component';

describe('PedidosDomiciliosEntregadosNComponent', () => {
  let component: PedidosDomiciliosEntregadosNComponent;
  let fixture: ComponentFixture<PedidosDomiciliosEntregadosNComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidosDomiciliosEntregadosNComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidosDomiciliosEntregadosNComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
