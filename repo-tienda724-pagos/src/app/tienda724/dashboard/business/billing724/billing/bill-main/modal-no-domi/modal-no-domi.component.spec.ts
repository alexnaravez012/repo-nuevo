import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalNoDomiComponent } from './modal-no-domi.component';

describe('ModalNoDomiComponent', () => {
  let component: ModalNoDomiComponent;
  let fixture: ComponentFixture<ModalNoDomiComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalNoDomiComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalNoDomiComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
