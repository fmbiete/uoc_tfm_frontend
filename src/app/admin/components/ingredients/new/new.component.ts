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
import { IngredientService } from 'src/app/shared/services/ingredient.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { Ingredient } from 'src/app/shared/models/ingredient.dto';

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
    private ingredientService: IngredientService,
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
    const ingredient: Ingredient = {
      ID: 0,
      Name: this.name.value,
    };

    this.ingredientService.create$(ingredient).subscribe({
      next: (value: Ingredient) => {
        this.snackbar.show(null, $localize`Ingredient Creation succeded`);
        this.ref.close(value);
      },
      error: (err: any) => {
        this.snackbar.show(err, $localize`Ingredient Creation failed`);
        this.ref.close(null);
      },
    });
  }
}
