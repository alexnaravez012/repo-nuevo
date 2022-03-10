import { TestBed } from '@angular/core/testing';

import { InTableGuard } from './in-table.guard';

describe('InTableGuard', () => {
  let guard: InTableGuard;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    guard = TestBed.inject(InTableGuard);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });
});
