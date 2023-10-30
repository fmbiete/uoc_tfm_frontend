import { AsyncPipe, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MenuModule } from 'primeng/menu';
import { Observable } from 'rxjs';
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
    NgIf,
    AsyncPipe,
    ButtonModule,
    DialogModule,
    MenuModule,
    LoginComponent,
  ],
  providers: [DialogService],
})
export class MenuComponent implements OnInit {
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
    this._defineUserMenu();
  }

  ngOnDestroy(): void {
    if (this.dialogLoginRef) {
      this.dialogLoginRef.close();
    }
  }

  editCredentials(): void {
    this.router.navigateByUrl('/users/credentials');
  }

  private _subscribeAuthentication(): void {
    this.localStorage.authenticationResponse$().subscribe({
      next: (value: AuthResponse) => {
        this.authenticated = value.id > 0;
      },
      error: (err: any) => {
        this.snackbar.show(
          err,
          $localize`Failed to receive authentication status`
        );
      },
    });
  }

  private _defineUserMenu(): void {
    this.userMenuItems = [
      {
        label: $localize`Orders`,
        icon: 'pi pi-cog',
        command: () => this.showOrders(),
      },
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
