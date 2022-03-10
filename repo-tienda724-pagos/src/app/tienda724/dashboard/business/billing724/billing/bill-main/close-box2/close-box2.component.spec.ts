import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CloseBox2Component} from './close-box2.component';

describe('CloseBox2Component', () => {
  let component: CloseBox2Component;
  let fixture: ComponentFixture<CloseBox2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CloseBox2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CloseBox2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
