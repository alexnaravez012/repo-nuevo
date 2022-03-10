import { TestBed } from '@angular/core/testing';

import { OpenBoxGuard } from './open-box.guard';

describe('OpenBoxGuard', () => {
  let guard: OpenBoxGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(OpenBoxGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
