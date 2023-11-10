import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';

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
export class NewComponent implements OnInit {
  @Output() newCategory: EventEmitter<Category> = new EventEmitter();

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

  ngOnInit(): void {
    return;
  }

  ngOnDestroy(): void {
    return;
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
        // this.newCategory.emit(value);
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
