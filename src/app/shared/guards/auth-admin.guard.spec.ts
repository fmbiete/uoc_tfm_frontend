import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { AuthAdminGuard } from './auth-admin.guard';

describe('authAdminGuard', () => {
  let authAdminGuard: AuthAdminGuard;
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() =>
      authAdminGuard.canActivate(...guardParameters)
    );

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
