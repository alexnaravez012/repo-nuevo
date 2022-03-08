import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReOrdenPerfectaComponent } from './re-orden-perfecta.component';

describe('ReOrdenPerfectaComponent', () => {
  let component: ReOrdenPerfectaComponent;
  let fixture: ComponentFixture<ReOrdenPerfectaComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReOrdenPerfectaComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReOrdenPerfectaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
