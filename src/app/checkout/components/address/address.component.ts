import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { User } from 'src/app/users/models/user.dto';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { LocalStorageService } from 'src/app/common/services/local-storage.service';
import { Router } from '@angular/router';
import { SnackbarService } from 'src/app/common/services/snackbar.service';
import { UserService } from 'src/app/users/services/user.service';
import { CheckboxModule } from 'primeng/checkbox';
import { InputTextModule } from 'primeng/inputtext';
import { ButtonModule } from 'primeng/button';
import { FormActionsComponent } from '../form-actions/form-actions.component';

@Component({
  selector: 'checkout-address',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    CheckboxModule,
    InputTextModule,
    FormActionsComponent,
  ],
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.scss'],
})
export class AddressComponent {
  saveAsDefault: boolean;

  name: string;
  surname: string;
  address1: UntypedFormControl;
  address2: UntypedFormControl;
  address3: UntypedFormControl;
  city: UntypedFormControl;
  postalCode: UntypedFormControl;
  phone: UntypedFormControl;

  addressForm: UntypedFormGroup;

  constructor(
    private router: Router,
    private formBuilder: UntypedFormBuilder,
    private localStorage: LocalStorageService,
    private snackbar: SnackbarService,
    private userService: UserService
  ) {
    this.saveAsDefault = false;
    this.name = '';
    this.surname = '';

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

    this.addressForm = this.formBuilder.group({
      address1: this.address1,
      address2: this.address2,
      address3: this.address3,
      city: this.city,
      postalCode: this.postalCode,
      phone: this.phone,
    });
  }

  async ngOnInit(): Promise<void> {
    // load user data
    const userId = this.localStorage.getUserId();

    try {
      const data = await this.userService.get(userId);
      this.setAddress(data);
    } catch (error: any) {
      this.snackbar.show(error, $localize`User Address Retrieval Failed`);
    }
  }

  private setAddress(data: User | undefined) {
    if (data === undefined) {
      this.snackbar.show(
        null,
        $localize`User Address Retrieval Failed\nUnknown error`
      );
    } else {
      this.name = data.Name;
      this.surname = data.Surname;
      this.address1.setValue(data.Address1);
      this.address2.setValue(data.Address2);
      this.address3.setValue(data.Address3);
      this.city.setValue(data.City);
      this.postalCode.setValue(data.PostalCode);
      this.phone.setValue(data.Phone);
    }
  }

  goCart(): void {
    this.router.navigate(['cart']);
  }

  async goPayment(): Promise<void> {
    const userId = this.localStorage.getUserId();

    if (this.saveAsDefault) {
      // Modify user profile with this address
      try {
        let user = this.addressForm.value;
        user.Name = this.name;
        user.Surname = this.surname;
        user.ID = userId;
        user.Email = this.localStorage.getUserEmail();

        await this.userService.update(user);
        this.snackbar.show(null, $localize`User Modified Successfully`);
      } catch (error: any) {
        this.snackbar.show(error, $localize`User Modification Failed`);
      }
    }

    // TODO: save address
    this.router.navigate(['checkout', 'payment']);
  }
}
