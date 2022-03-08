import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosDomiciliosCalificadosComponent } from './pedidos-domicilios-calificados.component';

describe('PedidosDomiciliosCalificadosComponent', () => {
  let component: PedidosDomiciliosCalificadosComponent;
  let fixture: ComponentFixture<PedidosDomiciliosCalificadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidosDomiciliosCalificadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidosDomiciliosCalificadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
