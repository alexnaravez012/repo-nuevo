import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailMesaComponent } from './detail-mesa.component';

describe('DetailMesaComponent', () => {
  let component: DetailMesaComponent;
  let fixture: ComponentFixture<DetailMesaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ DetailMesaComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DetailMesaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
