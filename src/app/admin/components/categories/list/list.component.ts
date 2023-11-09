import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { Table, TableModule } from 'primeng/table';
import { SnackbarService } from 'src/app/common/services/snackbar.service';
import { Category } from 'src/app/dishes/models/category.dto';
import { CategoryService } from 'src/app/dishes/services/category.service';
import { FormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'admin-categories-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    TableModule,
  ],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent {
  categories: Category[];
  loading: boolean;
  // Backup for edits
  clonedCategories: { [s: string]: Category } = {};

  @Input('newCategory') set newCategory(value: Category) {
    console.debug(value);
    if (value) {
      this._addCategory(value);
    }
  }

  constructor(
    private snackbar: SnackbarService,
    private router: Router,
    private categoryService: CategoryService
  ) {
    this.categories = new Array<Category>();
    this.loading = true;
  }

  ngOnInit(): void {
    this._subscribeCategories();
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
    }
  }

  private _subscribeCategories(): void {
    this.categoryService.listCategories$().subscribe({
      next: (value: Category[]) => {
        this.categories = value;
        this.loading = false;
      },
      error: (err: any) => {
        this.snackbar.show(err, $localize`Failed to list categories`);
      },
    });
  }

  // Filters
  applyFilterGlobal(table: Table, $event: any, stringVal: any) {
    table.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  resetFilter(table: Table) {
    table.clear();
  }

  // Edit
  onRowEditInit(category: Category) {
    // save original row
    this.clonedCategories[category.ID.toString()] = { ...category };
  }

  onRowEditSave(category: Category) {
    console.debug(`Modified`);
    console.debug(category);

    this.categoryService.modifyCategory$(category).subscribe({
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

  onRowEditCancel(category: Category, index: number) {
    // restore original row
    this.categories[index] = this.clonedCategories[category.ID.toString()];
    delete this.clonedCategories[category.ID.toString()];
  }
}
