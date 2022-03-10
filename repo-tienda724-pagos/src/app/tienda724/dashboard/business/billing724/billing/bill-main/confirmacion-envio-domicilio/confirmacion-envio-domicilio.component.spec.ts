import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConfirmacionEnvioDomicilioComponent } from './confirmacion-envio-domicilio.component';

describe('ConfirmacionEnvioDomicilioComponent', () => {
  let component: ConfirmacionEnvioDomicilioComponent;
  let fixture: ComponentFixture<ConfirmacionEnvioDomicilioComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConfirmacionEnvioDomicilioComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConfirmacionEnvioDomicilioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
