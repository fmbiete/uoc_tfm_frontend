import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule, CurrencyPipe, TitleCasePipe } from '@angular/common';
import { Dish, PageDishes } from 'src/app/dishes/models/dish.dto';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule, Table, TableLazyLoadEvent } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import { first } from 'rxjs';
import { SnackbarService } from 'src/app/common/services/snackbar.service';
import { DishService } from 'src/app/admin/services/dish.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { NewComponent } from '../new/new.component';
import { EditComponent } from '../edit/edit.component';

@Component({
  selector: 'app-list',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    FormsModule,
    TitleCasePipe,
    ButtonModule,
    ConfirmDialogModule,
    DialogModule,
    InputTextModule,
    TableModule,
    TagModule,
    TooltipModule,
  ],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
  providers: [ConfirmationService, DialogService],
})
export class ListComponent implements OnInit, OnDestroy {
  @ViewChild('table') table!: Table;

  private dialogRef: DynamicDialogRef | undefined;

  dishes: Dish[];
  loading: boolean;
  fakeTotalDishes: number;

  constructor(
    private snackbar: SnackbarService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService,
    private dishService: DishService
  ) {
    this.dishes = new Array<Dish>();
    this.loading = true;
    // mark the total as 1+row size to have pagination
    this.fakeTotalDishes = 10 + 1;
  }

  ngOnInit(): void {
    this.loading = true;
    // lazy load
  }

  ngOnDestroy(): void {
    if (this.dialogRef) this.dialogRef.close();
  }

  applyFilterGlobal(table: Table, $event: any, stringVal: any) {
    console.debug($event);
    console.debug(stringVal);
    table.filterGlobal(($event.target as HTMLInputElement).value, stringVal);
  }

  loadDishes(event: TableLazyLoadEvent): void {
    // pageSize is the value selected or 10
    const pageSize = event.rows ?? 10;
    // pageCount is 0 based in the table, but 1 based in the API
    // first contains the number of elements
    const pageCount = event.first == undefined ? 1 : event.first / pageSize + 1;
    this._subscribeDishes(pageSize, pageCount);
  }

  resetFilter(table: Table) {
    table.clear();
  }

  onRowDelete(dish: Dish): void {
    this.confirmationService.confirm({
      message: $localize`Do you want to delete this Dish?\n${dish.Name}`,
      header: $localize`Delete Confirmation`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._deleteDish(dish);
      },
    });
  }

  onRowEdit(dish: Dish, idx: number): void {
    this.dialogRef = this.dialogService.open(EditComponent, {
      header: $localize`Modify Dish`,
      width: '90%',
      height: '100vh',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      data: {
        dish: dish,
      },
    });

    this.dialogRef.onClose.subscribe((result: Dish | undefined) => {
      if (result) this.dishes[idx] = result;
    });
  }

  onRowEditPromotion(dish: Dish, idx: number): void {}

  openCreate(): void {
    this.dialogRef = this.dialogService.open(NewComponent, {
      header: $localize`Create Dish`,
      width: '90%',
      height: '100vh',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
    });

    this.dialogRef.onClose.subscribe((result: Dish | undefined) => {
      if (result) this._addDish(result);
    });
  }

  private _addDish(value: Dish) {
    const found = this.dishes.find((c) => c.ID == value.ID);
    if (!found) {
      this.dishes.push(value);
      this.dishes.sort((a, b) => {
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

  private _deleteDish(dish: Dish): void {
    this.dishService
      .delete$(dish.ID)
      .pipe(first())
      .subscribe({
        next: () => {
          this.snackbar.show(null, $localize`Dish was deleted`);
          this.dishes = this.dishes.filter((c: Dish) => c.ID !== dish.ID);
          this.table.reset();
        },
        error: (err: any) => {
          this.snackbar.show(err, $localize`Failed to delete Dish`);
        },
      });
  }

  private _subscribeDishes(pageSize: number, pageCount: number): void {
    this.dishService
      .list$(pageSize, pageCount)
      .pipe(first())
      .subscribe({
        next: (value: PageDishes) => {
          this.dishes = value.dishes;
          if (value.dishes.length == pageSize) {
            // If this page is full of elements (we exactly have pageSize),
            // we add 1 to our fake total to enable "next page"
            this.fakeTotalDishes = pageSize * pageCount + 1;
          } else {
            // If this page is not full
            // we add only what we have; this will disable "next page"
            this.fakeTotalDishes =
              pageSize * (pageCount - 1) + value.dishes.length;
          }
          this.loading = false;
        },
        error: (err: any) => {
          this.snackbar.show(err, $localize`Failed to list Users`);
        },
      });
  }
}
