import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModalConfirmEmptyInventoryComponent } from './modal-confirm-empty-inventory.component';

describe('ModalConfirmEmptyInventoryComponent', () => {
  let component: ModalConfirmEmptyInventoryComponent;
  let fixture: ComponentFixture<ModalConfirmEmptyInventoryComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModalConfirmEmptyInventoryComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModalConfirmEmptyInventoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
