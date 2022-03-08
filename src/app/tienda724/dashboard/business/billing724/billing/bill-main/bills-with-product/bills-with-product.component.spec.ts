import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {BillsWithProductComponent} from './bills-with-product.component';

describe('BillsWithProductComponent', () => {
  let component: BillsWithProductComponent;
  let fixture: ComponentFixture<BillsWithProductComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BillsWithProductComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BillsWithProductComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
