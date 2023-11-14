import { Component, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataViewModule } from 'primeng/dataview';
import {
  Subject,
  Subscription,
  debounceTime,
  distinctUntilChanged,
  finalize,
  first,
  switchMap,
} from 'rxjs';
import { Dish, ISearchDish, PageDishes } from 'src/app/shared/models/dish.dto';
import { DishService } from 'src/app/shared/services/dish.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { InputTextModule } from 'primeng/inputtext';
import { GridItemComponent } from '../grid-item/grid-item.component';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'dishes-search',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    DataViewModule,
    InputTextModule,
    InfiniteScrollModule,
    GridItemComponent,
  ],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit, OnDestroy {
  private subscription!: Subscription;
  searchTerm: string;
  private searchText$: Subject<ISearchDish>;
  private pageSize: number;
  private pageCount: number;

  dishes: Array<Dish>;

  constructor(
    private snackbar: SnackbarService,
    private dishService: DishService
  ) {
    this.pageSize = 9;
    this.pageCount = 1;
    this.searchText$ = new Subject<ISearchDish>();
    this.searchTerm = '';
    this.dishes = new Array<Dish>();
  }

  ngOnInit(): void {
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
          if (value.page == 1) {
            this.dishes.length = 0;
            this.dishes = value.dishes;
          } else {
            this.dishes = this.dishes.concat(value.dishes);
          }
        },
        error: (err) => {
          this.snackbar.show(err, $localize`Failed to search dishes`);
        },
      });

    const data: ISearchDish = {
      filter: this.searchTerm,
      pageCount: this.pageCount,
      pageSize: this.pageSize,
    };

    this.searchText$.next(data);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onKeyUp(event: KeyboardEvent): void {
    // key pressed - new search always?
    this.pageCount = 1;

    const data: ISearchDish = {
      filter: this.searchTerm,
      pageCount: this.pageCount,
      pageSize: this.pageSize,
    };

    this.searchText$.next(data);
  }

  onScroll(): void {
    this.pageCount++;
    const data: ISearchDish = {
      filter: this.searchTerm,
      pageCount: this.pageCount,
      pageSize: this.pageSize,
    };

    this.searchText$.next(data);
  }
}
