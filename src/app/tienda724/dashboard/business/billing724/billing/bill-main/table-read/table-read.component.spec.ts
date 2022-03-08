import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { TableReadComponent } from './table-read.component';

describe('TableReadComponent', () => {
  let component: TableReadComponent;
  let fixture: ComponentFixture<TableReadComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TableReadComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TableReadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
