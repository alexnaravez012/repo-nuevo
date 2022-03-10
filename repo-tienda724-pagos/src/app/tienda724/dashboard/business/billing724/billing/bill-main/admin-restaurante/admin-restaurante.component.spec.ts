import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminRestauranteComponent } from './admin-restaurante.component';

describe('AdminRestauranteComponent', () => {
  let component: AdminRestauranteComponent;
  let fixture: ComponentFixture<AdminRestauranteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AdminRestauranteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminRestauranteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
