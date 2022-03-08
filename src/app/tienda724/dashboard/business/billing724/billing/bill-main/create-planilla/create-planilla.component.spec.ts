import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {CreatePlanillaComponent} from './create-planilla.component';

describe('CreatePlanillaComponent', () => {
  let component: CreatePlanillaComponent;
  let fixture: ComponentFixture<CreatePlanillaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CreatePlanillaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CreatePlanillaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
