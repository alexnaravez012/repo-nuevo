import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { SelectCancelAdminComponent } from './select-cancel-admin.component';

describe('SelectCancelAdminComponent', () => {
  let component: SelectCancelAdminComponent;
  let fixture: ComponentFixture<SelectCancelAdminComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ SelectCancelAdminComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(SelectCancelAdminComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
