import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DataViewModule } from 'primeng/dataview';
import { Subscription, finalize, first } from 'rxjs';
import { Dish, PageDishes } from 'src/app/shared/models/dish.dto';
import { DishService } from 'src/app/shared/services/dish.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { InputTextModule } from 'primeng/inputtext';
import { GridItemComponent } from '../grid-item/grid-item.component';

@Component({
  selector: 'dishes-search',
  standalone: true,
  imports: [
    CommonModule,
    DataViewModule,
    InputTextModule,
    InfiniteScrollModule,
    GridItemComponent,
  ],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  private pageSize: number;
  private pageCount: number;
  private searchRequests: Array<Subscription>;

  dishes: Array<Dish>;
  searchTerm: string;

  constructor(
    private snackbar: SnackbarService,
    private dishService: DishService
  ) {
    this.pageSize = 9;
    this.pageCount = 1;
    this.searchTerm = '';
    this.searchRequests = new Array<Subscription>();
    this.dishes = new Array<Dish>();
  }

  ngOnInit(): void {
    this.searchByTerm();
  }

  onKeyUp(event: KeyboardEvent): void {
    const text = (event?.target as HTMLInputElement)?.value;
    if (text !== this.searchTerm) {
      // new search
      this.pageCount = 1;
      this.searchTerm = text;
      this.dishes.length = 0;
      this.cancelPendingRequests();
      this.searchByTerm();
    }
  }

  onScroll(): void {
    // Only search if there is no requests in progress
    if (this.searchRequests.length == 0) {
      this.pageCount++;
      this.searchByTerm();
    }
  }

  private searchByTerm(): void {
    const subscription = this.dishService
      .search$(this.searchTerm, this.pageSize, this.pageCount)
      .pipe(
        first(),
        finalize(() => {
          // remove this request as it's done
          this.searchRequests.pop();
        })
      )
      .subscribe({
        next: (value: PageDishes) => {
          this.dishes = this.dishes.concat(value.dishes);
        },
        error: (err) => {
          this.snackbar.show(err, $localize`Failed to search dishes`);
        },
      });
    this.searchRequests.push(subscription);
  }

  private cancelPendingRequests(): void {
    let subscription: Subscription | undefined;
    while ((subscription = this.searchRequests.pop())) {
      subscription.unsubscribe();
    }
  }
}
