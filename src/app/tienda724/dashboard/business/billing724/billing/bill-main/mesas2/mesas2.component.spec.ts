import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Mesas2Component } from './mesas2.component';

describe('Mesas2Component', () => {
  let component: Mesas2Component;
  let fixture: ComponentFixture<Mesas2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Mesas2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Mesas2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
