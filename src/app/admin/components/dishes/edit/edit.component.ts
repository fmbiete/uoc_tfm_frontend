import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  DialogService,
  DynamicDialogConfig,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormGroup,
  UntypedFormControl,
  UntypedFormBuilder,
  Validators,
} from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputNumberModule } from 'primeng/inputnumber';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { InputTextareaModule } from 'primeng/inputtextarea';
import { first } from 'rxjs';
import { AllergenService } from 'src/app/admin/services/allergen.service';
import { CategoryService } from 'src/app/admin/services/category.service';
import { IngredientService } from 'src/app/admin/services/ingredient.service';
import { SnackbarService } from 'src/app/common/services/snackbar.service';
import { Allergen } from 'src/app/dishes/models/allergen.dto';
import { Category } from 'src/app/dishes/models/category.dto';
import { Dish } from 'src/app/dishes/models/dish.dto';
import { Ingredient } from 'src/app/dishes/models/ingredient.dto';
import { DishService } from 'src/app/admin/services/dish.service';

@Component({
  selector: 'app-edit',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputNumberModule,
    InputTextModule,
    InputTextareaModule,
    MultiSelectModule,
  ],
  templateUrl: './edit.component.html',
  styleUrls: ['./edit.component.scss'],
  providers: [DialogService],
})
export class EditComponent implements OnInit {
  modifyForm: UntypedFormGroup;
  name: UntypedFormControl;
  description: UntypedFormControl;
  cost: UntypedFormControl;
  allergens: UntypedFormControl;
  categories: UntypedFormControl;
  ingredients: UntypedFormControl;

  existingAllergens: Array<Allergen>;
  existingCategories: Array<Category>;
  existingIngredients: Array<Ingredient>;

  private dish: Dish;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private snackbar: SnackbarService,
    private allergenService: AllergenService,
    private categoryService: CategoryService,
    private dishService: DishService,
    private ingredientService: IngredientService,
    public ref: DynamicDialogRef,
    public config: DynamicDialogConfig
  ) {
    this.dish = config.data.dish;

    this.existingAllergens = new Array<Allergen>();
    this.existingCategories = new Array<Category>();
    this.existingIngredients = new Array<Ingredient>();

    this.name = new UntypedFormControl(this.dish.Name, [
      Validators.required,
      Validators.maxLength(250),
    ]);
    this.description = new UntypedFormControl(this.dish.Description, [
      Validators.required,
      Validators.maxLength(2000),
    ]);
    this.cost = new UntypedFormControl(this.dish.Cost, [
      Validators.required,
      Validators.min(0),
    ]);
    this.allergens = new UntypedFormControl(this.dish.Allergens, []);
    this.categories = new UntypedFormControl(this.dish.Categories, [
      Validators.required,
    ]);
    this.ingredients = new UntypedFormControl(this.dish.Ingredients, []);

    this.modifyForm = this.formBuilder.group({
      name: this.name,
      description: this.description,
      cost: this.cost,
      allergens: this.allergens,
      categories: this.categories,
      ingredients: this.ingredients,
    });
  }

  ngOnInit(): void {
    this._loadAllergens();
    this._loadCategories();
    this._loadIngredients();
  }

  cancel(): void {
    this.ref.close(null);
  }

  modify(): void {
    this.dish.Name = this.name.value;
    this.dish.Description = this.description.value;
    this.dish.Cost = this.cost.value;
    this.dish.Categories = this.categories.value;
    this.dish.Allergens = this.allergens.value;
    this.dish.Ingredients = this.ingredients.value;

    this.dishService.modify$(this.dish).subscribe({
      next: (value: Dish) => {
        this.snackbar.show(null, $localize`Dish Modification succeded`);
        this.ref.close(value);
      },
      error: (err: any) => {
        this.snackbar.show(err, $localize`Dish Modification failed`);
        this.ref.close(null);
      },
    });
  }

  private _loadAllergens(): void {
    this.allergenService
      .list$()
      .pipe(first())
      .subscribe({
        next: (value: Allergen[]) => {
          this.existingAllergens = value;
        },
        error: (err: any) => {
          this.snackbar.show(err, $localize`Failed to list Allergens`);
        },
      });
  }

  private _loadCategories(): void {
    this.categoryService
      .list$()
      .pipe(first())
      .subscribe({
        next: (value: Category[]) => {
          this.existingCategories = value;
        },
        error: (err: any) => {
          this.snackbar.show(err, $localize`Failed to list Categories`);
        },
      });
  }

  private _loadIngredients(): void {
    this.ingredientService
      .list$()
      .pipe(first())
      .subscribe({
        next: (value: Ingredient[]) => {
          this.existingIngredients = value;
        },
        error: (err: any) => {
          this.snackbar.show(err, $localize`Failed to list Ingredients`);
        },
      });
  }
}
