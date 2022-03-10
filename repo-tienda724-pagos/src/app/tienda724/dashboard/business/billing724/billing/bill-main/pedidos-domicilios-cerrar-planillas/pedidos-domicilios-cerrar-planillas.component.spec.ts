import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosDomiciliosCerrarPlanillasComponent } from './pedidos-domicilios-cerrar-planillas.component';

describe('PedidosDomiciliosCerrarPlanillasComponent', () => {
  let component: PedidosDomiciliosCerrarPlanillasComponent;
  let fixture: ComponentFixture<PedidosDomiciliosCerrarPlanillasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidosDomiciliosCerrarPlanillasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidosDomiciliosCerrarPlanillasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
