import { Component } from '@angular/core';
import {
  Validators,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormGroup,
  UntypedFormControl,
  UntypedFormBuilder,
} from '@angular/forms';
import { NgIf } from '@angular/common';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { UserService } from 'src/app/shared/services/user.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { User } from 'src/app/shared/models/user.dto';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { FormActionsComponent } from '../form-actions/form-actions.component';
import { first } from 'rxjs';

@Component({
  selector: 'users-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.scss'],
  standalone: true,
  imports: [
    ButtonModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
    FormActionsComponent,
    NgIf,
  ],
})
export class ProfileComponent {
  name: UntypedFormControl;
  surname: UntypedFormControl;
  address1: UntypedFormControl;
  address2: UntypedFormControl;
  address3: UntypedFormControl;
  city: UntypedFormControl;
  postalCode: UntypedFormControl;
  phone: UntypedFormControl;

  profileForm: UntypedFormGroup;

  profileUser: User;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private localStorage: LocalStorageService,
    private snackbar: SnackbarService,
    private userService: UserService
  ) {
    this.profileUser = new User();

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
    this.postalCode = new UntypedFormControl('', [
      Validators.required,
      Validators.maxLength(10),
    ]);
    this.phone = new UntypedFormControl('', [
      Validators.required,
      Validators.maxLength(20),
    ]);

    this.profileForm = this.formBuilder.group({
      name: this.name,
      surname: this.surname,
      address1: this.address1,
      address2: this.address2,
      address3: this.address3,
      city: this.city,
      postalCode: this.postalCode,
      phone: this.phone,
    });
  }

  ngOnInit(): void {
    // load user data
    const userId = this.localStorage.getUserId();

    this.userService
      .get$(userId)
      .pipe(first())
      .subscribe({
        next: (value: User) => {
          this.setProfile(value);
        },
        error: (err: any) => {
          this.snackbar.show(err, $localize`User Retrieval Failed`);
        },
      });
  }

  private setProfile(data: User | undefined) {
    if (data === undefined) {
      this.snackbar.show(null, $localize`User Retrieval Failed\nUnknown error`);
    } else {
      console.debug(data);
      this.name.setValue(data.Name);
      this.surname.setValue(data.Surname);
      this.address1.setValue(data.Address1);
      this.address2.setValue(data.Address2);
      this.address3.setValue(data.Address3);
      this.city.setValue(data.City);
      this.postalCode.setValue(data.PostalCode);
      this.phone.setValue(data.Phone);
    }
  }

  update(): void {
    const userId = this.localStorage.getUserId();

    this.profileUser = this.profileForm.value;
    this.profileUser.ID = userId;
    this.profileUser.Email = this.localStorage.getUserEmail();

    this.userService
      .modify$(this.profileUser)
      .pipe(first())
      .subscribe({
        next: (value: User) => {
          this.snackbar.show(null, $localize`User Modified Successfully`);
        },
        error: (err: any) => {
          this.snackbar.show(err, $localize`User Modification Failed`);
        },
      });
  }
}
