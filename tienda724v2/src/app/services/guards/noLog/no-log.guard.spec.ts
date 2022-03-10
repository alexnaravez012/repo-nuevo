import { TestBed } from '@angular/core/testing';

import { NoLogGuard } from './no-log.guard';

describe('NoLogGuard', () => {
  let guard: NoLogGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(NoLogGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
