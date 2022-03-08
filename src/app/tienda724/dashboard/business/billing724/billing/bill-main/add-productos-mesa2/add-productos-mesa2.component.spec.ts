import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductosMesa2Component } from './add-productos-mesa2.component';

describe('AddProductosMesa2Component', () => {
  let component: AddProductosMesa2Component;
  let fixture: ComponentFixture<AddProductosMesa2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AddProductosMesa2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductosMesa2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
