import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TransactionConfirmDialog2Component } from './transaction-confirm-dialog2.component';

describe('TransactionConfirmDialog2Component', () => {
  let component: TransactionConfirmDialog2Component;
  let fixture: ComponentFixture<TransactionConfirmDialog2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TransactionConfirmDialog2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TransactionConfirmDialog2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
