import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ingredient } from 'src/app/dishes/models/ingredient.dto';
import { IngredientService } from 'src/app/admin/services/ingredient.service';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule, Table } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { first } from 'rxjs';
import { SnackbarService } from 'src/app/common/services/snackbar.service';
import { NewComponent } from '../new/new.component';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    ConfirmDialogModule,
    DialogModule,
    InputTextModule,
    TableModule,
    TooltipModule,
  ],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [ConfirmationService, DialogService],
})
export class ListComponent {
  @ViewChild('table') table!: Table;

  ingredients: Ingredient[];
  loading: boolean;
  // Backup for edits
  private clonedIngredients: { [s: string]: Ingredient } = {};
  private dialogRef: DynamicDialogRef | undefined;

  constructor(
    private snackbar: SnackbarService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService,
    private ingredientService: IngredientService
  ) {
    this.ingredients = new Array<Ingredient>();
    this.loading = true;
  }

  ngOnInit(): void {
    this._subscribeCategories();
  }

  ngOnDestroy(): void {
    if (this.dialogRef) this.dialogRef.close();
  }

  // Filters
  applyFilterGlobal(table: Table, $event: any, stringVal: any) {
    table.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  resetFilter(table: Table) {
    table.clear();
  }

  onRowDelete(category: Ingredient) {
    this.confirmationService.confirm({
      message: $localize`Do you want to delete this Ingredient?\n${category.Name}`,
      header: $localize`Delete Confirmation`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._deleteIngredient(category);
      },
    });
  }

  onRowEditCancel(category: Ingredient, index: number) {
    // restore original row
    this.ingredients[index] = this.clonedIngredients[category.ID.toString()];
    delete this.clonedIngredients[category.ID.toString()];
  }

  // Edit
  onRowEditInit(category: Ingredient) {
    // save original row
    this.clonedIngredients[category.ID.toString()] = { ...category };
  }

  onRowEditSave(category: Ingredient) {
    this.ingredientService.modify$(category).subscribe({
      next: (value: Ingredient) => {
        // row is already updated in memory
        // delete backup
        delete this.clonedIngredients[category.ID.toString()];
      },
      error: (err: any) => {
        this.snackbar.show(err, $localize`Failed to modify category`);
        // find original id
        const index = this.ingredients.findIndex((v) => v.ID == category.ID);
        // restore original row
        this.ingredients[index] =
          this.clonedIngredients[category.ID.toString()];
        delete this.clonedIngredients[category.ID.toString()];
      },
    });
  }

  openCreate(): void {
    this.dialogRef = this.dialogService.open(NewComponent, {
      header: $localize`Create Ingredient`,
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
    });

    this.dialogRef.onClose.subscribe((result: Ingredient | undefined) => {
      if (result) this._addIngredient(result);
    });
  }

  private _addIngredient(value: Ingredient) {
    const found = this.ingredients.find((c) => c.ID == value.ID);
    if (!found) {
      this.ingredients.push(value);
      this.ingredients.sort((a, b) => {
        if (a.Name < b.Name) {
          return -1;
        }
        if (a.Name > b.Name) {
          return 1;
        }
        return 0;
      });
      this.table.reset();
    }
  }

  private _deleteIngredient(category: Ingredient): void {
    this.ingredientService
      .delete$(category.ID)
      .pipe(first())
      .subscribe({
        next: () => {
          this.snackbar.show(null, $localize`Ingredient was deleted`);
          this.ingredients = this.ingredients.filter(
            (c: Ingredient) => c.ID !== category.ID
          );
          this.table.reset();
        },
        error: (err: any) => {
          this.snackbar.show(err, $localize`Failed to delete Ingredient`);
        },
      });
  }

  private _subscribeCategories(): void {
    this.ingredientService
      .list$()
      .pipe(first())
      .subscribe({
        next: (value: Ingredient[]) => {
          this.ingredients = value;
          this.loading = false;
        },
        error: (err: any) => {
          this.snackbar.show(err, $localize`Failed to list categories`);
        },
      });
  }
}
