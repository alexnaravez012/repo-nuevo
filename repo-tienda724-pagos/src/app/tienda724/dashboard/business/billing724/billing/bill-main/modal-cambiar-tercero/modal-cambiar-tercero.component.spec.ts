import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCambiarTerceroComponent } from './modal-cambiar-tercero.component';

describe('ModalCambiarTerceroComponent', () => {
  let component: ModalCambiarTerceroComponent;
  let fixture: ComponentFixture<ModalCambiarTerceroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCambiarTerceroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCambiarTerceroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
