import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesModal2Component } from './notes-modal2.component';

describe('NotesModal2Component', () => {
  let component: NotesModal2Component;
  let fixture: ComponentFixture<NotesModal2Component>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotesModal2Component ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotesModal2Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
