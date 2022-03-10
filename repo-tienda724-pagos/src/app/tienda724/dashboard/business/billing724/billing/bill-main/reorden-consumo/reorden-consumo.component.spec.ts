import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ReordenConsumoComponent } from './reorden-consumo.component';

describe('ReordenConsumoComponent', () => {
  let component: ReordenConsumoComponent;
  let fixture: ComponentFixture<ReordenConsumoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ReordenConsumoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ReordenConsumoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
