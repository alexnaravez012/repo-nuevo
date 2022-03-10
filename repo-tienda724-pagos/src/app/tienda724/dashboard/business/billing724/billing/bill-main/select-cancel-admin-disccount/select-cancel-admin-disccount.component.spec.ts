import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCancelAdminDisccountComponent } from './select-cancel-admin-disccount.component';

describe('SelectCancelAdminDisccountComponent', () => {
  let component: SelectCancelAdminDisccountComponent;
  let fixture: ComponentFixture<SelectCancelAdminDisccountComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectCancelAdminDisccountComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectCancelAdminDisccountComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
