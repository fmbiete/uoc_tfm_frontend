import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import {
  CommonModule,
  CurrencyPipe,
  DatePipe,
  TitleCasePipe,
} from '@angular/common';
import { Dish, ISearchDish, PageDishes } from 'src/app/shared/models/dish.dto';
import { FormsModule } from '@angular/forms';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { DialogModule } from 'primeng/dialog';
import { InputTextModule } from 'primeng/inputtext';
import { TableModule, Table, TableLazyLoadEvent } from 'primeng/table';
import { TooltipModule } from 'primeng/tooltip';
import { TagModule } from 'primeng/tag';
import {
  Subject,
  Subscription,
  debounceTime,
  distinctUntilChanged,
  first,
  switchMap,
} from 'rxjs';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { DishService } from 'src/app/shared/services/dish.service';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { NewComponent } from '../new/new.component';
import { EditComponent } from '../edit/edit.component';
import { Promotion } from 'src/app/shared/models/promotion.dto';
import { NewComponent as NewPromotionComponent } from '../../promotions/new/new.component';
import { PromotionService } from 'src/app/shared/services/promotion.service';
import { CalendarModule } from 'primeng/calendar';
import { InputNumberModule } from 'primeng/inputnumber';

@Component({
  selector: 'admin-dishes-list',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    DatePipe,
    TitleCasePipe,
    FormsModule,
    ButtonModule,
    CalendarModule,
    ConfirmDialogModule,
    DialogModule,
    InputNumberModule,
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
  @ViewChild('filterBox') filterBox!: HTMLInputElement;

  private clonedPromotions: { [s: string]: Promotion } = {};
  private dialogRefDish: DynamicDialogRef | undefined;
  private dialogRefPromotion: DynamicDialogRef | undefined;

  private subscription!: Subscription;
  searchTerm: string;
  private searchText$: Subject<ISearchDish>;
  private pageSize: number;
  private pageCount: number;

  dishes: Dish[];
  loading: boolean;
  fakeTotalDishes: number;

  startTime: Date;
  endTime: Date;

  constructor(
    private snackbar: SnackbarService,
    private confirmationService: ConfirmationService,
    private dialogService: DialogService,
    private dishService: DishService,
    private promotionService: PromotionService
  ) {
    this.pageSize = 10;
    this.pageCount = 1;
    this.searchText$ = new Subject<ISearchDish>();
    this.searchTerm = '';
    this.startTime = this.endTime = new Date();
    this.dishes = new Array<Dish>();
    this.loading = true;
    // mark the total as 1+row size to have pagination
    this.fakeTotalDishes = this.pageSize + 1;
  }

  ngOnInit(): void {
    this.loading = true;
    // lazy load
    this.subscription = this.searchText$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((value: ISearchDish) => {
          return this.dishService.search$(
            value.filter,
            value.pageSize,
            value.pageCount
          );
        })
      )
      .subscribe({
        next: (value: PageDishes) => {
          // this.table.clear();
          // we only show the current page
          this.dishes = value.dishes;
          if (value.dishes.length == this.pageSize) {
            // If this page is full of elements (we exactly have pageSize),
            // we add 1 to our fake total to enable "next page"
            this.fakeTotalDishes = this.pageSize * this.pageCount + 1;
          } else {
            // If this page is not full
            // we add only what we have; this will disable "next page"
            this.fakeTotalDishes =
              this.pageSize * (this.pageCount - 1) + value.dishes.length;
          }
          this.loading = false;
        },
        error: (err) => {
          this.snackbar.show(err, $localize`Failed to search dishes`);
        },
      });
  }

  ngOnDestroy(): void {
    if (this.dialogRefDish) this.dialogRefDish.close();
    if (this.dialogRefPromotion) this.dialogRefPromotion.close();
    if (this.subscription) this.subscription.unsubscribe();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onKeyUp(event: KeyboardEvent): void {
    // clear resets pagination
    this.table.clear();
    this.loading = true;

    // key pressed - new search always?
    this.pageCount = 1;

    const data: ISearchDish = {
      filter: this.searchTerm,
      pageCount: this.pageCount,
      pageSize: this.pageSize,
    };

    this.searchText$.next(data);
  }

  loadDishes(event: TableLazyLoadEvent): void {
    this.loading = true;
    // pageSize is the value selected or our default
    this.pageSize = event.rows ?? this.pageSize;
    // pageCount is 0 based in the table, but 1 based in the API
    // first contains the number of elements
    this.pageCount =
      event.first == undefined ? 1 : event.first / this.pageSize + 1;

    const data: ISearchDish = {
      filter: this.searchTerm,
      pageCount: this.pageCount,
      pageSize: this.pageSize,
    };

    this.searchText$.next(data);
  }

  resetFilter(table: Table) {
    this.searchTerm = '';
    this.pageCount = 1;

    const data: ISearchDish = {
      filter: this.searchTerm,
      pageCount: this.pageCount,
      pageSize: this.pageSize,
    };

    this.searchText$.next(data);

    // clear resets pagination
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

  onPromotionRowDelete(dish: Dish, promotion: Promotion): void {
    this.confirmationService.confirm({
      message: $localize`Do you want to delete this Promotion?`,
      header: $localize`Delete Confirmation`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this._deletePromotion(dish, promotion);
      },
    });
  }

  onPromotionRowEditCancel(
    dish: Dish,
    promotion: Promotion,
    index: number
  ): void {
    // restore original row
    dish.Promotions[index] = this.clonedPromotions[promotion.ID.toString()];
    delete this.clonedPromotions[promotion.ID.toString()];
  }

  onPromotionRowEditInit(promotion: Promotion): void {
    // save original row
    this.clonedPromotions[promotion.ID.toString()] = { ...promotion };
    // the calendar object requires Date, and the HttpClient JSON deserializer creates an string even with Date type
    this.startTime = new Date(promotion.StartTime);
    this.endTime = new Date(promotion.EndTime);
  }

  onPromotionRowEditSave(dish: Dish, promotion: Promotion): void {
    promotion.StartTime = this.startTime;
    promotion.EndTime = this.endTime;
    this.promotionService.modify$(promotion).subscribe({
      next: (value: Promotion) => {
        // row is already updated in memory
        // delete backup
        delete this.clonedPromotions[value.ID.toString()];
      },
      error: (err) => {
        this.snackbar.show(err, $localize`Failed to modify Dish Promotion`);
        // find original id
        const index = dish.Promotions.findIndex((v) => v.ID == promotion.ID);
        // restore original row
        dish.Promotions[index] = this.clonedPromotions[promotion.ID.toString()];
        delete this.clonedPromotions[promotion.ID.toString()];
      },
    });
  }

  onRowEdit(dish: Dish, idx: number): void {
    this.dialogRefDish = this.dialogService.open(EditComponent, {
      header: $localize`Modify Dish`,
      width: '90%',
      height: '100vh',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      data: {
        dish: dish,
      },
    });

    this.dialogRefDish.onClose.subscribe((result: Dish | undefined) => {
      if (result) this.dishes[idx] = result;
    });
  }

  openCreate(): void {
    this.dialogRefDish = this.dialogService.open(NewComponent, {
      header: $localize`Create Dish`,
      width: '90%',
      height: '100vh',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
    });

    this.dialogRefDish.onClose.subscribe((result: Dish | undefined) => {
      if (result) this._addDish(result);
    });
  }

  openCreatePromotion(dish: Dish): void {
    this.dialogRefPromotion = this.dialogService.open(NewPromotionComponent, {
      header: $localize`Create Promotion`,
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      data: {
        dish: dish,
      },
    });

    this.dialogRefPromotion.onClose.subscribe(
      (result: Promotion | undefined) => {
        if (result) dish.Promotions.push(result);
      }
    );
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
        error: (err) => {
          this.snackbar.show(err, $localize`Failed to delete Dish`);
        },
      });
  }

  private _deletePromotion(dish: Dish, promotion: Promotion): void {
    this.promotionService
      .delete$(promotion.ID)
      .pipe(first())
      .subscribe({
        next: () => {
          this.snackbar.show(null, $localize`Dish Promotion was deleted`);
          dish.Promotions = dish.Promotions.filter(
            (c: Promotion) => c.ID !== promotion.ID
          );
          this.table.reset();
        },
        error: (err) => {
          this.snackbar.show(err, $localize`Failed to delete Dish Promotion`);
        },
      });
  }
}
