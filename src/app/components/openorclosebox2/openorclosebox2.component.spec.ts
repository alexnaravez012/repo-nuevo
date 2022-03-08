import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { Openorclosebox2Component } from './openorclosebox2.component';

describe('Openorclosebox2Component', () => {
  let component: Openorclosebox2Component;
  let fixture: ComponentFixture<Openorclosebox2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ Openorclosebox2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(Openorclosebox2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
