import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarMeseroComponent } from './editar-mesero.component';

describe('EditarMeseroComponent', () => {
  let component: EditarMeseroComponent;
  let fixture: ComponentFixture<EditarMeseroComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditarMeseroComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditarMeseroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
