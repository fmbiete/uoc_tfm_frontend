import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MenuModule } from 'primeng/menu';
import { LoginComponent } from 'src/app/common/components/login/login.component';
import { AuthResponse } from 'src/app/common/models/auth.dto';
import { LocalStorageService } from 'src/app/common/services/local-storage.service';
import { SnackbarService } from 'src/app/common/services/snackbar.service';

@Component({
  selector: 'users-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DialogModule,
    MenuModule,
    LoginComponent,
  ],
  providers: [DialogService],
})
export class MenuComponent implements OnInit, OnDestroy {
  authenticated: boolean;

  userMenuItems: MenuItem[] | undefined;

  dialogLoginRef: DynamicDialogRef | undefined;

  constructor(
    private router: Router,
    private localStorage: LocalStorageService,
    private snackbar: SnackbarService,
    private dialogService: DialogService
  ) {
    this.authenticated = false;
  }

  ngOnInit(): void {
    this._subscribeAuthentication();
    this._defineUserMenu(this.localStorage.isUserAdmin());
  }

  ngOnDestroy(): void {
    if (this.dialogLoginRef) this.dialogLoginRef.close();
  }

  editCredentials(): void {
    this.router.navigateByUrl('/users/credentials');
  }

  private _subscribeAuthentication(): void {
    this.localStorage.authenticationResponse$().subscribe({
      next: (value: AuthResponse) => {
        this.authenticated = value.id > 0;
        this._defineUserMenu(value.admin);
      },
      error: (err: any) => {
        this.snackbar.show(
          err,
          $localize`Failed to receive authentication status`
        );
      },
    });
  }

  private _defineUserMenu(isAdmin: boolean): void {
    this.userMenuItems = [
      {
        label: $localize`Personal Information`,
        icon: 'pi pi-user-edit',
        command: () => this.editProfile(),
      },
      {
        label: $localize`Email and Password`,
        icon: 'pi pi-lock',
        command: () => this.editCredentials(),
      },
      {
        label: $localize`Logout`,
        icon: 'pi pi-sign-out',
        command: () => this.logout(),
      },
    ];

    // Admin should not make orders - hide this option
    if (!isAdmin) {
      this.userMenuItems.unshift({
        label: $localize`Orders`,
        icon: 'pi pi-cog',
        command: () => this.showOrders(),
      });
    }
  }

  showOrders(): void {
    this.router.navigateByUrl('/orders');
  }

  editProfile(): void {
    this.router.navigateByUrl('/users/profile');
  }

  login(): void {
    this.dialogLoginRef = this.dialogService.open(LoginComponent, {
      header: $localize`User Access`,
      // styleClass: 'tfm-dynamic-dialog-responsive-sm',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
    });

    this.dialogLoginRef.onClose.subscribe((result: boolean | undefined) => {
      console.debug(`Dialog result: ${result}`);
    });
  }

  logout(): void {
    this.localStorage.resetLogin();
    this.router.navigateByUrl('/');
    this.snackbar.show(null, $localize`See you soon!`);
  }
}
