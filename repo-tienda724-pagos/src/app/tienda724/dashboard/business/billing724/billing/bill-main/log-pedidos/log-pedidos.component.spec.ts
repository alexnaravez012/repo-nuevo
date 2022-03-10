import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LogPedidosComponent } from './log-pedidos.component';

describe('LogPedidosComponent', () => {
  let component: LogPedidosComponent;
  let fixture: ComponentFixture<LogPedidosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LogPedidosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LogPedidosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
