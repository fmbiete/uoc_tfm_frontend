import { Component, OnInit } from '@angular/core';
import {
  Validators,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormGroup,
  UntypedFormControl,
  UntypedFormBuilder,
} from '@angular/forms';
import { CommonModule } from '@angular/common';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { User } from 'src/app/shared/models/user.dto';
import { UserService } from 'src/app/shared/services/user.service';
import { CustomValidators } from 'src/app/shared/validators/custom.validator';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogModule } from 'primeng/dialog';
import { DynamicDialogRef } from 'primeng/dynamicdialog';
import { first } from 'rxjs';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    DialogModule,
    FormsModule,
    ReactiveFormsModule,
  ],
})
export class RegisterComponent implements OnInit {
  hide: boolean;

  registerForm: UntypedFormGroup;
  email: UntypedFormControl;
  password: UntypedFormControl;
  password2: UntypedFormControl;
  name: UntypedFormControl;
  surname: UntypedFormControl;
  address1: UntypedFormControl;
  address2: UntypedFormControl;
  address3: UntypedFormControl;
  city: UntypedFormControl;
  postal_code: UntypedFormControl;
  phone: UntypedFormControl;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private snackbar: SnackbarService,
    private userService: UserService,
    private dialogRef: DynamicDialogRef
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
    this.password2 = new UntypedFormControl('', [
      Validators.required,
      Validators.maxLength(64),
    ]);
    this.password2.addValidators(
      CustomValidators.match(this.password, this.password2)
    );
    this.name = new UntypedFormControl('', [
      Validators.required,
      Validators.maxLength(250),
    ]);
    this.surname = new UntypedFormControl('', [
      Validators.required,
      Validators.maxLength(250),
    ]);
    this.address1 = new UntypedFormControl('', [
      Validators.required,
      Validators.maxLength(250),
    ]);
    this.address2 = new UntypedFormControl('', [Validators.maxLength(250)]);
    this.address3 = new UntypedFormControl('', [Validators.maxLength(250)]);
    this.city = new UntypedFormControl('', [
      Validators.required,
      Validators.maxLength(250),
    ]);
    this.postal_code = new UntypedFormControl('', [
      Validators.required,
      Validators.maxLength(10),
    ]);
    this.phone = new UntypedFormControl('', [
      Validators.required,
      Validators.maxLength(20),
    ]);

    this.registerForm = this.formBuilder.group({
      email: this.email,
      password: this.password,
      password2: this.password2,
      name: this.name,
      surname: this.surname,
      address1: this.address1,
      address2: this.address2,
      address3: this.address3,
      city: this.city,
      postal_code: this.postal_code,
      phone: this.phone,
    });
  }

  ngOnInit(): void {
    return;
  }

  close(): void {
    this.dialogRef.close();
  }

  register(): void {
    const user: User = {
      ID: -1,
      Email: this.email.value,
      Password: this.password.value,
      Name: this.name.value,
      Surname: this.surname.value,
      Address1: this.address1.value,
      Address2: this.address2.value,
      Address3: this.address3.value,
      City: this.city.value,
      PostalCode: this.postal_code.value,
      Phone: this.phone.value,
      IsAdmin: false,
    };

    this.userService
      .create$(user)
      .pipe(first())
      .subscribe({
        next: (value: User) => {
          this.snackbar.show(
            null,
            $localize`User Creation succeded\nYou can now login`
          );
          this.dialogRef.close();
        },
        error: (err: any) => {
          // we stay in the dialog and show the error
          this.snackbar.show(err, $localize`User Creation failed`);
        },
      });
  }
}
