import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PedidosRestaurantesCreadosComponent } from './pedidos-restaurantes-creados.component';

describe('PedidosRestaurantesCreadosComponent', () => {
  let component: PedidosRestaurantesCreadosComponent;
  let fixture: ComponentFixture<PedidosRestaurantesCreadosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PedidosRestaurantesCreadosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PedidosRestaurantesCreadosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
