import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddProductsMesaComponent } from './add-products-mesa.component';

describe('AddProductsMesaComponent', () => {
  let component: AddProductsMesaComponent;
  let fixture: ComponentFixture<AddProductsMesaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddProductsMesaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AddProductsMesaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
