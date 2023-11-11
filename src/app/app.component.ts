import { Component, OnInit } from '@angular/core';
import { AuthResponse } from './shared/models/auth.dto';
import { LocalStorageService } from './shared/services/local-storage.service';
import { SnackbarService } from './shared/services/snackbar.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit {
  authenticated: boolean;
  admin: boolean;

  constructor(
    private snackbar: SnackbarService,
    private localStorage: LocalStorageService
  ) {
    this.authenticated = this.localStorage.isUserLogged();
    this.admin = this.localStorage.isUserAdmin();
  }

  ngOnInit(): void {
    this.subscribeAuthentication();
  }

  private subscribeAuthentication(): void {
    this.localStorage.authenticationResponse$().subscribe({
      next: (value: AuthResponse) => {
        this.authenticated = value.id > 0;
        this.admin = value.admin;
      },
      error: (err: any) => {
        this.snackbar.show(
          err,
          $localize`Failed to receive authentication status`
        );
      },
    });
  }
}
