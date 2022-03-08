import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosDomiciliosProcesadosNComponent } from './pedidos-domicilios-procesados-n.component';

describe('PedidosDomiciliosProcesadosNComponent', () => {
  let component: PedidosDomiciliosProcesadosNComponent;
  let fixture: ComponentFixture<PedidosDomiciliosProcesadosNComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidosDomiciliosProcesadosNComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidosDomiciliosProcesadosNComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
