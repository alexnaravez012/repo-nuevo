import {async, ComponentFixture, TestBed} from '@angular/core/testing';

import {DetallePlanillasComponent} from './detalle-planillas.component';

describe('DetallePlanillasComponent', () => {
  let component: DetallePlanillasComponent;
  let fixture: ComponentFixture<DetallePlanillasComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DetallePlanillasComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DetallePlanillasComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
