import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { FacturarMesas2Component } from './facturar-mesas2.component';

describe('FacturarMesas2Component', () => {
  let component: FacturarMesas2Component;
  let fixture: ComponentFixture<FacturarMesas2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ FacturarMesas2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FacturarMesas2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
