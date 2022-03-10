import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidoConfirmacionCancelacionComponent } from './pedido-confirmacion-cancelacion.component';

describe('PedidoConfirmacionCancelacionComponent', () => {
  let component: PedidoConfirmacionCancelacionComponent;
  let fixture: ComponentFixture<PedidoConfirmacionCancelacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidoConfirmacionCancelacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidoConfirmacionCancelacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
