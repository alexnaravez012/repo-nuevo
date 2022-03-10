import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CerrarPlanillasCajaComponent } from './cerrar-planillas-caja.component';

describe('CerrarPlanillasCajaComponent', () => {
  let component: CerrarPlanillasCajaComponent;
  let fixture: ComponentFixture<CerrarPlanillasCajaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CerrarPlanillasCajaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CerrarPlanillasCajaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
