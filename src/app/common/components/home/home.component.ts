import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LocalStorageService } from '../../services/local-storage.service';
import { AuthResponse } from '../../models/auth.dto';
import { SnackbarService } from '../../services/snackbar.service';
import { HomeUserComponent } from '../home-user/home-user.component';
import { HomeAdminComponent } from '../home-admin/home-admin.component';

@Component({
  selector: 'app-home',
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
      error: (err: any) => {
        this.snackbar.show(
          err,
          $localize`Failed to receive authentication status`
        );
      },
    });
  }
}
