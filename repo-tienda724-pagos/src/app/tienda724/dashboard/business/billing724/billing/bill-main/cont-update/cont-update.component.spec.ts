import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {ContUpdateComponent} from './cont-update.component';

describe('ContUpdateComponent', () => {
  let component: ContUpdateComponent;
  let fixture: ComponentFixture<ContUpdateComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ContUpdateComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ContUpdateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
