import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormControl,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Dish } from 'src/app/dishes/models/dish.dto';
import { Allergen } from 'src/app/dishes/models/allergen.dto';
import { Category } from 'src/app/dishes/models/category.dto';
import { ButtonModule } from 'primeng/button';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { SnackbarService } from 'src/app/common/services/snackbar.service';
import { Promotion } from 'src/app/dishes/models/promotion.dto';
import { DishService } from 'src/app/admin/services/dish.service';
import { InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';
import { Ingredient } from 'src/app/dishes/models/ingredient.dto';
import { CategoryService } from 'src/app/admin/services/category.service';
import { first } from 'rxjs';
import { AllergenService } from 'src/app/admin/services/allergen.service';
import { IngredientService } from 'src/app/admin/services/ingredient.service';
import { InputTextareaModule } from 'primeng/inputtextarea';

@Component({
  selector: 'app-new',
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
  templateUrl: './new.component.html',
  styleUrls: ['./new.component.scss'],
  providers: [DialogService],
})
export class NewComponent implements OnInit {
  createForm: UntypedFormGroup;
  name: UntypedFormControl;
  description: UntypedFormControl;
  cost: UntypedFormControl;
  allergens: UntypedFormControl;
  categories: UntypedFormControl;
  ingredients: UntypedFormControl;

  existingAllergens: Array<Allergen>;
  existingCategories: Array<Category>;
  existingIngredients: Array<Ingredient>;

  constructor(
    private formBuilder: UntypedFormBuilder,
    private snackbar: SnackbarService,
    private allergenService: AllergenService,
    private categoryService: CategoryService,
    private dishService: DishService,
    private ingredientService: IngredientService,
    public ref: DynamicDialogRef
  ) {
    this.existingAllergens = new Array<Allergen>();
    this.existingCategories = new Array<Category>();
    this.existingIngredients = new Array<Ingredient>();

    this.name = new UntypedFormControl('', [
      Validators.required,
      Validators.maxLength(250),
    ]);
    this.description = new UntypedFormControl('', [
      Validators.required,
      Validators.maxLength(2000),
    ]);
    this.cost = new UntypedFormControl(0, [
      Validators.required,
      Validators.min(0),
    ]);
    this.allergens = new UntypedFormControl('', []);
    this.categories = new UntypedFormControl('', [Validators.required]);
    this.ingredients = new UntypedFormControl('', []);

    this.createForm = this.formBuilder.group({
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

  create(): void {
    const dish: Dish = {
      ID: 0,
      Name: this.name.value,
      Description: this.description.value,
      Cost: this.cost.value,
      Categories: this.categories.value,
      Allergens: this.allergens.value,
      Ingredients: this.ingredients.value,
      Promotions: Array<Promotion>(),
      Likes: 0,
      Dislikes: 0,
    };

    this.dishService.create$(dish).subscribe({
      next: (value: Dish) => {
        this.snackbar.show(null, $localize`Dish Creation succeded`);
        this.ref.close(value);
      },
      error: (err: any) => {
        this.snackbar.show(err, $localize`Dish Creation failed`);
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
