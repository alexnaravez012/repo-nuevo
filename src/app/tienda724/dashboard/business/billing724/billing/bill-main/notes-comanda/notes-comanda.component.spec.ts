import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { NotesComandaComponent } from './notes-comanda.component';

describe('NotesComandaComponent', () => {
  let component: NotesComandaComponent;
  let fixture: ComponentFixture<NotesComandaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ NotesComandaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(NotesComandaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
