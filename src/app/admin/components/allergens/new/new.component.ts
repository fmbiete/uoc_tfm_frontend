import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormGroup,
  UntypedFormControl,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { AllergenService } from 'src/app/admin/services/allergen.service';
import { SnackbarService } from 'src/app/common/services/snackbar.service';
import { Allergen } from 'src/app/dishes/models/allergen.dto';

@Component({
  selector: 'app-new',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
  ],
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss'],
  providers: [DialogService],
})
export class NewComponent {
  createForm: UntypedFormGroup;
  name: UntypedFormControl;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private snackbar: SnackbarService,
    private allergenService: AllergenService,
    public ref: DynamicDialogRef
  ) {
    this.name = new UntypedFormControl('', [
      Validators.required,
      Validators.maxLength(250),
    ]);

    this.createForm = this.formBuilder.group({
      name: this.name,
    });
  }

  cancel(): void {
    this.ref.close(null);
  }

  create(): void {
    const allergen: Allergen = {
      ID: 0,
      Name: this.name.value,
    };

    this.allergenService.create$(allergen).subscribe({
      next: (value: Allergen) => {
        this.snackbar.show(null, $localize`Allergen Creation succeded`);
        this.ref.close(value);
      },
      error: (err: any) => {
        this.snackbar.show(err, $localize`Allergen Creation failed`);
        this.ref.close(null);
      },
    });
  }
}
