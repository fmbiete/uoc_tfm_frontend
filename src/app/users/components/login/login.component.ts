import { Component, OnDestroy, OnInit } from '@angular/core';
import {
  Validators,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormGroup,
  UntypedFormControl,
  UntypedFormBuilder,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from 'src/app/shared/services/auth.service';
import { AuthChallenge } from 'src/app/shared/models/auth.dto';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { HeaderService } from 'src/app/shared/services/header.service';
import { RegisterComponent } from '../register/register.component';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    DialogModule,
    InputTextModule,
    PasswordModule,
    ReactiveFormsModule,
  ],
  providers: [DialogService],
})
export class LoginComponent implements OnInit, OnDestroy {
  loginForm: UntypedFormGroup;
  email: UntypedFormControl;
  password: UntypedFormControl;
  dialogRegisterRef: DynamicDialogRef | undefined;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private snackbar: SnackbarService,
    private authService: AuthService,
    private localStorageService: LocalStorageService,
    private headerService: HeaderService,
    private dialogService: DialogService,
    public ref: DynamicDialogRef
  ) {
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
    // this.email.setValue('user1@tfm.es');
    this.email.setValue('admin@tfm.es');
    this.password.setValue('password');
  }

  ngOnDestroy(): void {
    if (this.dialogRegisterRef) this.dialogRegisterRef.close();
  }

  close(): void {
    this.ref.close(false);
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
      this.snackbar.show(null, $localize`Welcome back!`);
      this.ref.close(true);
    } catch (error: any) {
      // we stay in the dialog and show error
      this.headerService.showUnauthenticated();
      this.snackbar.show(error, $localize`User Authentication failed`);
    }
  }

  register(): void {
    this.dialogRegisterRef = this.dialogService.open(RegisterComponent, {
      header: $localize`User Registration`,
      // width: '75vw',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
    });
  }
}