import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosAprobarNovedadComponent } from './pedidos-aprobar-novedad.component';

describe('PedidosAprobarNovedadComponent', () => {
  let component: PedidosAprobarNovedadComponent;
  let fixture: ComponentFixture<PedidosAprobarNovedadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidosAprobarNovedadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidosAprobarNovedadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
