import { Component, OnInit } from '@angular/core';
import {
  Validators,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormGroup,
  UntypedFormControl,
  UntypedFormBuilder,
} from '@angular/forms';
import { NgIf } from '@angular/common';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { AuthService } from '../../services/auth.service';
import { AuthChallenge } from '../../models/auth.dto';
import { LocalStorageService } from 'src/app/common/services/local-storage.service';
import { HeaderService } from 'src/app/common/services/header.service';
import { RegisterComponent } from '../../../users/components/register/register.component';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatIconModule,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
  ],
})
export class LoginComponent implements OnInit {
  hide: boolean;
  loginForm: UntypedFormGroup;
  email: UntypedFormControl;
  password: UntypedFormControl;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private snackbar: SnackbarService,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private headerService: HeaderService,
    private dialog: MatDialog,
    private dialogRef: MatDialogRef<LoginComponent>
  ) {
    this.hide = true;
    this.email = new UntypedFormControl('', [
      Validators.required,
      Validators.pattern('[a-z0-9._%+-]+@[a-z0-9.-]+.[a-z]{2,4}$'),
      Validators.maxLength(100),
    ]);
    this.password = new UntypedFormControl('', [
      Validators.required,
      Validators.maxLength(64),
    ]);
    this.loginForm = this.formBuilder.group({
      email: this.email,
      password: this.password,
    });
  }

  ngOnInit(): void {
    // Speedup development
    this.email.setValue('user1@tfm.es');
    this.password.setValue('password');
  }

  async login(): Promise<void> {
    this.localStorageService.resetLogin();

    try {
      const authChallenge: AuthChallenge = {
        username: this.email.value,
        password: this.password.value,
      };

      const authResponse = await this.authService.login(authChallenge);
      this.localStorageService.saveLogin(
        authResponse?.id,
        authResponse?.email,
        authResponse?.token,
        authResponse?.admin
      );

      this.headerService.showAuthenticated(authResponse?.admin);
      this.dialogRef.close();
      this.snackbar.show(null, $localize`Welcome back!`);
    } catch (error: any) {
      // we stay in the dialog and show error
      this.headerService.showUnauthenticated();
      this.snackbar.show(error, $localize`User Authentication failed`);
    }
  }

  register(): void {
    const dialogRef = this.dialog.open(RegisterComponent);
    dialogRef.afterClosed().subscribe((result) => {
      console.debug(`Dialog result: ${result}`);
    });
  }
}
