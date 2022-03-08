import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosDomiciliosFinalizadosNComponent } from './pedidos-domicilios-finalizados-n.component';

describe('PedidosDomiciliosFinalizadosNComponent', () => {
  let component: PedidosDomiciliosFinalizadosNComponent;
  let fixture: ComponentFixture<PedidosDomiciliosFinalizadosNComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidosDomiciliosFinalizadosNComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidosDomiciliosFinalizadosNComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
