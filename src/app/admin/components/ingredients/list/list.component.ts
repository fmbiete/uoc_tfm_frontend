import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Ingredient } from 'src/app/shared/models/ingredient.dto';
import { IngredientService } from 'src/app/shared/services/ingredient.service';
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
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { NewComponent } from '../new/new.component';

@Component({
  selector: 'admin-ingredients-list',
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
export class ListComponent implements OnDestroy, OnInit {
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
    this._subscribeIngredients();
  }

  ngOnDestroy(): void {
    if (this.dialogRef) this.dialogRef.close();
  }

  applyFilterGlobal(table: Table, $event: Event, stringVal: string) {
    table.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  resetFilter(table: Table) {
    table.clear();
  }

  onRowDelete(ingredient: Ingredient) {
    this.confirmationService.confirm({
      message: $localize`Do you want to delete this Ingredient?\n${ingredient.Name}`,
      header: $localize`Delete Confirmation`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._deleteIngredient(ingredient);
      },
    });
  }

  onRowEditCancel(ingredient: Ingredient, index: number) {
    // restore original row
    this.ingredients[index] = this.clonedIngredients[ingredient.ID.toString()];
    delete this.clonedIngredients[ingredient.ID.toString()];
  }

  // Edit
  onRowEditInit(ingredient: Ingredient) {
    // save original row
    this.clonedIngredients[ingredient.ID.toString()] = { ...ingredient };
  }

  onRowEditSave(ingredient: Ingredient) {
    this.ingredientService.modify$(ingredient).subscribe({
      next: (value: Ingredient) => {
        // row is already updated in memory
        // delete backup
        delete this.clonedIngredients[value.ID.toString()];
      },
      error: (err) => {
        this.snackbar.show(err, $localize`Failed to modify ingredient`);
        // find original id
        const index = this.ingredients.findIndex((v) => v.ID == ingredient.ID);
        // restore original row
        this.ingredients[index] =
          this.clonedIngredients[ingredient.ID.toString()];
        delete this.clonedIngredients[ingredient.ID.toString()];
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

  private _deleteIngredient(ingredient: Ingredient): void {
    this.ingredientService
      .delete$(ingredient.ID)
      .pipe(first())
      .subscribe({
        next: () => {
          this.snackbar.show(null, $localize`Ingredient was deleted`);
          this.ingredients = this.ingredients.filter(
            (c: Ingredient) => c.ID !== ingredient.ID
          );
          this.table.reset();
        },
        error: (err) => {
          this.snackbar.show(err, $localize`Failed to delete Ingredient`);
        },
      });
  }

  private _subscribeIngredients(): void {
    this.ingredientService
      .list$()
      .pipe(first())
      .subscribe({
        next: (value: Ingredient[]) => {
          this.ingredients = value;
          this.loading = false;
        },
        error: (err) => {
          this.snackbar.show(err, $localize`Failed to list Ingredients`);
        },
      });
  }
}
