import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosDomiciliosCanceladosComponent } from './pedidos-domicilios-cancelados.component';

describe('PedidosDomiciliosCanceladosComponent', () => {
  let component: PedidosDomiciliosCanceladosComponent;
  let fixture: ComponentFixture<PedidosDomiciliosCanceladosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidosDomiciliosCanceladosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidosDomiciliosCanceladosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
