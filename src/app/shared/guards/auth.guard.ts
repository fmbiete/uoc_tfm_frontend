import { Injectable } from '@angular/core';
import {
  ActivatedRouteSnapshot,
  Router,
  RouterStateSnapshot,
  UrlTree,
} from '@angular/router';
import { Observable } from 'rxjs';
import { SnackbarService } from '../services/snackbar.service';
import { LocalStorageService } from '../services/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AuthGuard {
  constructor(
    private router: Router,
    private localStorageService: LocalStorageService,
    private snackbar: SnackbarService
  ) {}

  canActivate(
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    route: ActivatedRouteSnapshot,
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    state: RouterStateSnapshot
  ):
    | Observable<boolean | UrlTree>
    | Promise<boolean | UrlTree>
    | boolean
    | UrlTree {
    if (!this.localStorageService.isUserLogged()) {
      this.snackbar.show(
        new Error($localize`Restricted Access`),
        $localize`This section is restricted to users authenticated\nPlease Log In with your account`
      );
      this.router.navigateByUrl('/');
      return false;
    }

    return true;
  }
}
