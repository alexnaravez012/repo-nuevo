import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {UpdateNewProductComponent} from './update-new-product.component';

describe('UpdateNewProductComponent', () => {
  let component: UpdateNewProductComponent;
  let fixture: ComponentFixture<UpdateNewProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateNewProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateNewProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
