import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DomiciliosTelefonicosComponent } from './domicilios-telefonicos.component';

describe('DomiciliosTelefonicosComponent', () => {
  let component: DomiciliosTelefonicosComponent;
  let fixture: ComponentFixture<DomiciliosTelefonicosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DomiciliosTelefonicosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DomiciliosTelefonicosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
