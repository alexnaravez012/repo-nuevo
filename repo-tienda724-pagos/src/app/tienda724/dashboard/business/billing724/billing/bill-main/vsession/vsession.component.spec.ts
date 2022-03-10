import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VsessionComponent } from './vsession.component';

describe('VsessionComponent', () => {
  let component: VsessionComponent;
  let fixture: ComponentFixture<VsessionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VsessionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VsessionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
