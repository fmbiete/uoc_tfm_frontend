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
import { SnackbarService } from 'src/app/common/services/snackbar.service';
import { User } from '../../models/user.dto';
import { UserService } from '../../services/user.service';
import { LocalStorageService } from 'src/app/common/services/local-storage.service';
import { Router } from '@angular/router';
import { CustomValidators } from 'src/app/common/validators/custom.validator';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { PasswordModule } from 'primeng/password';

@Component({
  selector: 'app-credentials',
  templateUrl: './credentials.component.html',
  styleUrls: ['./credentials.component.scss'],
  standalone: true,
  imports: [
    ButtonModule,
    InputTextModule,
    PasswordModule,
    FormsModule,
    ReactiveFormsModule,
    NgIf,
  ],
})
export class CredentialsComponent implements OnInit {
  credentialsForm: UntypedFormGroup;
  email: UntypedFormControl;
  password: UntypedFormControl;
  password2: UntypedFormControl;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private snackbar: SnackbarService,
    private userService: UserService,
    private localStorage: LocalStorageService,
    private router: Router
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
    this.password2 = new UntypedFormControl('', [
      Validators.required,
      Validators.maxLength(64),
    ]);
    this.password2.addValidators(
      CustomValidators.match(this.password, this.password2)
    );

    this.credentialsForm = this.formBuilder.group({
      email: this.email,
      password: this.password,
      password2: this.password2,
    });
  }

  ngOnInit(): void {
    this.email.setValue(this.localStorage.getUserEmail());
  }

  async update(): Promise<void> {
    const userId = this.localStorage.getUserId();

    try {
      let user = new User();
      user.ID = userId;
      user.Email = this.email.value;
      user.Password = this.password.value;

      await this.userService.update(user);
      this.snackbar.show(
        null,
        $localize`User Credentials Modified Successfully\nPlease login again`
      );
      this.localStorage.resetLogin();
      this.router.navigateByUrl('/');
    } catch (error: any) {
      this.snackbar.show(
        error,
        $localize`User Credentials Modification Failed`
      );
    }
  }
}
