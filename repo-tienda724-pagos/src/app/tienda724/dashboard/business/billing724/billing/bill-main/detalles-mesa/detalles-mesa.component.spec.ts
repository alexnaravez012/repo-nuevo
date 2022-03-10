import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesMesaComponent } from './detalles-mesa.component';

describe('DetallesMesaComponent', () => {
  let component: DetallesMesaComponent;
  let fixture: ComponentFixture<DetallesMesaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetallesMesaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallesMesaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
