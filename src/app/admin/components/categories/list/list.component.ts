import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Table, TableModule } from 'primeng/table';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { Category } from 'src/app/shared/models/category.dto';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { first } from 'rxjs';
import { ConfirmationService } from 'primeng/api';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { TooltipModule } from 'primeng/tooltip';
import { NewComponent } from '../new/new.component';
import { DialogModule } from 'primeng/dialog';
import { CategoryService } from 'src/app/shared/services/category.service';

@Component({
  selector: 'admin-categories-list',
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
export class ListComponent implements OnInit, OnDestroy {
  @ViewChild('table') table!: Table;

  categories: Category[];
  loading: boolean;
  // Backup for edits
  private clonedCategories: { [s: string]: Category } = {};
  private dialogRef: DynamicDialogRef | undefined;

  constructor(
    private snackbar: SnackbarService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService,
    private categoryService: CategoryService
  ) {
    this.categories = new Array<Category>();
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

  onRowDelete(category: Category) {
    this.confirmationService.confirm({
      message: $localize`Do you want to delete this Category?\n${category.Name}`,
      header: $localize`Delete Confirmation`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._deleteCategory(category);
      },
    });
  }

  onRowEditCancel(category: Category, index: number) {
    // restore original row
    this.categories[index] = this.clonedCategories[category.ID.toString()];
    delete this.clonedCategories[category.ID.toString()];
  }

  // Edit
  onRowEditInit(category: Category) {
    // save original row
    this.clonedCategories[category.ID.toString()] = { ...category };
  }

  onRowEditSave(category: Category) {
    this.categoryService.modify$(category).subscribe({
      next: (value: Category) => {
        // row is already updated in memory
        // delete backup
        delete this.clonedCategories[category.ID.toString()];
      },
      error: (err: any) => {
        this.snackbar.show(err, $localize`Failed to modify category`);
        // find original id
        const index = this.categories.findIndex((v) => v.ID == category.ID);
        // restore original row
        this.categories[index] = this.clonedCategories[category.ID.toString()];
        delete this.clonedCategories[category.ID.toString()];
      },
    });
  }

  openCreate(): void {
    this.dialogRef = this.dialogService.open(NewComponent, {
      header: $localize`Create Category`,
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
    });

    this.dialogRef.onClose.subscribe((result: Category | undefined) => {
      if (result) this._addCategory(result);
    });
  }

  private _addCategory(value: Category) {
    const found = this.categories.find((c) => c.ID == value.ID);
    if (!found) {
      this.categories.push(value);
      this.categories.sort((a, b) => {
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

  private _deleteCategory(category: Category): void {
    this.categoryService
      .delete$(category.ID)
      .pipe(first())
      .subscribe({
        next: () => {
          this.snackbar.show(null, $localize`Category was deleted`);
          this.categories = this.categories.filter(
            (c: Category) => c.ID !== category.ID
          );
          this.table.reset();
        },
        error: (err: any) => {
          this.snackbar.show(err, $localize`Failed to delete Category`);
        },
      });
  }

  private _subscribeCategories(): void {
    this.categoryService
      .list$()
      .pipe(first())
      .subscribe({
        next: (value: Category[]) => {
          this.categories = value;
          this.loading = false;
        },
        error: (err: any) => {
          this.snackbar.show(err, $localize`Failed to list categories`);
        },
      });
  }
}
