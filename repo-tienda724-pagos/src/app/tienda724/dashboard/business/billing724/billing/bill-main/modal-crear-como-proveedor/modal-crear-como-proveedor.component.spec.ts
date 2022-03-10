import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalCrearComoProveedorComponent } from './modal-crear-como-proveedor.component';

describe('ModalCrearComoProveedorComponent', () => {
  let component: ModalCrearComoProveedorComponent;
  let fixture: ComponentFixture<ModalCrearComoProveedorComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalCrearComoProveedorComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalCrearComoProveedorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
