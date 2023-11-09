import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CategoryService } from 'src/app/dishes/services/category.service';
import { Category } from 'src/app/dishes/models/category.dto';
import {
  UntypedFormGroup,
  UntypedFormControl,
  UntypedFormBuilder,
  Validators,
  FormsModule,
  ReactiveFormsModule,
} from '@angular/forms';
import { SnackbarService } from 'src/app/common/services/snackbar.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'admin-categories-new',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    InputTextModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss'],
})
export class NewComponent {
  @Output() newCategory: EventEmitter<Category> = new EventEmitter();

  createForm: UntypedFormGroup;
  name: UntypedFormControl;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private snackbar: SnackbarService,
    private categoryService: CategoryService
  ) {
    this.name = new UntypedFormControl('', [
      Validators.required,
      Validators.maxLength(250),
    ]);

    this.createForm = this.formBuilder.group({
      name: this.name,
    });
  }

  ngOnInit(): void {
    return;
  }

  create(): void {
    const category: Category = {
      ID: 0,
      Name: this.name.value,
    };

    this.categoryService.create$(category).subscribe({
      next: (value: Category) => {
        this.newCategory.emit(value);
        this.snackbar.show(null, $localize`Category Creation succeded`);
      },
      error: (err: any) => {
        this.snackbar.show(err, $localize`Category Creation failed`);
      },
    });
  }
}
