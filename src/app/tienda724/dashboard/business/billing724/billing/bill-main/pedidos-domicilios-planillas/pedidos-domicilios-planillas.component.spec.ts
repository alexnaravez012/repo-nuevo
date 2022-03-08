import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosDomiciliosPlanillasComponent } from './pedidos-domicilios-planillas.component';

describe('PedidosDomiciliosPlanillasComponent', () => {
  let component: PedidosDomiciliosPlanillasComponent;
  let fixture: ComponentFixture<PedidosDomiciliosPlanillasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidosDomiciliosPlanillasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidosDomiciliosPlanillasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
