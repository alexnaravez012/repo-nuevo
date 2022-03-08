import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UpdateThirdInfoComponent } from './update-third-info.component';

describe('UpdateThirdInfoComponent', () => {
  let component: UpdateThirdInfoComponent;
  let fixture: ComponentFixture<UpdateThirdInfoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UpdateThirdInfoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UpdateThirdInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
