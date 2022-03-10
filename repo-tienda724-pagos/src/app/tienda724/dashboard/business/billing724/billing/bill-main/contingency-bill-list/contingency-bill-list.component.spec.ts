import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ContingencyBillListComponent} from './contingency-bill-list.component';

describe('ContingencyBillListComponent', () => {
  let component: ContingencyBillListComponent;
  let fixture: ComponentFixture<ContingencyBillListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContingencyBillListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContingencyBillListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
