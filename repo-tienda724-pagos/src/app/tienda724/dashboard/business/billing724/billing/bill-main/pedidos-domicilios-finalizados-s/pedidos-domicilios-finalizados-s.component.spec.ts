import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosDomiciliosFinalizadosSComponent } from './pedidos-domicilios-finalizados-s.component';

describe('PedidosDomiciliosFinalizadosSComponent', () => {
  let component: PedidosDomiciliosFinalizadosSComponent;
  let fixture: ComponentFixture<PedidosDomiciliosFinalizadosSComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidosDomiciliosFinalizadosSComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidosDomiciliosFinalizadosSComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
