import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConfirmCreateProviderComponent } from './modal-confirm-create-provider.component';

describe('ModalConfirmCreateProviderComponent', () => {
  let component: ModalConfirmCreateProviderComponent;
  let fixture: ComponentFixture<ModalConfirmCreateProviderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalConfirmCreateProviderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalConfirmCreateProviderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
