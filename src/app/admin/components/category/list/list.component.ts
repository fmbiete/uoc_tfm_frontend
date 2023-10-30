import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EditableRow, Table, TableModule } from 'primeng/table';
import { ButtonModule } from 'primeng/button';
import { SnackbarService } from 'src/app/common/services/snackbar.service';
import { Router } from '@angular/router';
import { CategoryService } from 'src/app/dishes/services/category.service';
import { Category } from 'src/app/dishes/models/category.dto';
import { InputTextModule } from 'primeng/inputtext';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'admin-category-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ButtonModule,
    InputTextModule,
    TableModule,
  ],
  providers: [EditableRow],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  categories: Category[];
  loading: boolean;
  // Backup for edits
  clonedCategories: { [s: string]: Category } = {};

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
    // TODO: API modify
    // Replace in memory category??
    // delete this.clonedCategories[category.ID as unknown as string];
  }

  onRowEditCancel(category: Category, index: number) {
    // restore original row
    this.categories[index] = this.clonedCategories[category.ID.toString()];
    delete this.clonedCategories[category.ID.toString()];
  }
}
