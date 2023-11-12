import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { AuthResponse } from 'src/app/shared/models/auth.dto';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { HomeComponent as HomeUserComponent } from 'src/app/dishes/components/home/home.component';
import { HomeComponent as HomeAdminComponent } from 'src/app/admin/components/home/home.component';

@Component({
  selector: 'landing-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  standalone: true,
  imports: [CommonModule, HomeAdminComponent, HomeUserComponent],
})
export class HomeComponent implements OnInit {
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
      error: (err) => {
        this.snackbar.show(
          err,
          $localize`Failed to receive authentication status`
        );
      },
    });
  }
}
