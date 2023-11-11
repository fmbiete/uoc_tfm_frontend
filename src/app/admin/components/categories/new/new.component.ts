import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Category } from 'src/app/shared/models/category.dto';
import {
  UntypedFormGroup,
  UntypedFormControl,
  UntypedFormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { CategoryService } from 'src/app/shared/services/category.service';

@Component({
  selector: 'admin-categories-new',
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
    private categoryService: CategoryService,
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
    const category: Category = {
      ID: 0,
      Name: this.name.value,
    };

    this.categoryService.create$(category).subscribe({
      next: (value: Category) => {
        this.snackbar.show(null, $localize`Category Creation succeded`);
        this.ref.close(value);
      },
      error: (err: any) => {
        this.snackbar.show(err, $localize`Category Creation failed`);
        this.ref.close(null);
      },
    });
  }
}
