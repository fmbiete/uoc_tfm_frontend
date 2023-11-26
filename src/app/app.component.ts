import { Component, OnDestroy, OnInit } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';
import { AuthResponse } from './shared/models/auth.dto';
import { LocalStorageService } from './shared/services/local-storage.service';
import { SnackbarService } from './shared/services/snackbar.service';
import { Title } from '@angular/platform-browser';
import { environment } from 'src/environments/environment';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements OnInit, OnDestroy {
  authenticated: boolean;
  admin: boolean;

  private subscription!: Subscription;

  constructor(
    private titleService: Title,
    private primengConfig: PrimeNGConfig,
    private snackbar: SnackbarService,
    private localStorage: LocalStorageService
  ) {
    this.authenticated = this.localStorage.isUserLogged();
    this.admin = this.localStorage.isUserAdmin();
  }

  ngOnInit(): void {
    // Enable ripple animation
    this.primengConfig.ripple = true;
    // Set application title
    this.titleService.setTitle(environment.title);
    this.subscribeAuthentication();
  }

  ngOnDestroy(): void {
    if (this.subscription) this.subscription.unsubscribe();
  }

  private subscribeAuthentication(): void {
    this.subscription = this.localStorage.authenticationResponse$().subscribe({
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
