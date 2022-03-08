import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ObservationsNotesComponent } from './observations-notes.component';

describe('ObservationsNotesComponent', () => {
  let component: ObservationsNotesComponent;
  let fixture: ComponentFixture<ObservationsNotesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ObservationsNotesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ObservationsNotesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
