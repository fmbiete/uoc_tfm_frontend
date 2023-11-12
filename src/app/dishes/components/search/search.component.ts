import { Component, Input, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { first } from 'rxjs';
import { Router } from '@angular/router';
import { CartService } from 'src/app/shared/services/cart.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { Dish, PageDishes } from 'src/app/shared/models/dish.dto';
import { DishService } from 'src/app/shared/services/dish.service';
import { MessageModule } from 'primeng/message';
import { TagModule } from 'primeng/tag';
import { RatingComponent } from '../rating/rating.component';
import { RatingPipe } from '../../pipes/rating.pipe';
import { GridItemComponent } from '../grid-item/grid-item.component';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@Component({
  selector: 'dishes-search',
  standalone: true,
  imports: [
    AsyncPipe,
    RatingPipe,
    CommonModule,
    ButtonModule,
    DataViewModule,
    MessageModule,
    TagModule,
    RatingComponent,
    GridItemComponent,
    DataViewModule,
    InfiniteScrollModule,
  ],
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss'],
})
export class SearchComponent implements OnInit {
  pageCount: number;
  _searchTerm!: string;
  dishes: Array<Dish>;

  @Input() set searchTerm(value: string) {
    this.dishes.length = 0;
    this.pageCount = 1;
    this._searchTerm = value;
    this.searchByTerm();
  }
  get searchTerm(): string {
    return this._searchTerm;
  }

  constructor(
    private router: Router,
    private snackbar: SnackbarService,
    private dishService: DishService,
    private localStorage: LocalStorageService,
    private cartService: CartService
  ) {
    this.pageCount = 1;
    this.dishes = new Array<Dish>();
  }

  ngOnInit(): void {
    this.searchByTerm();
  }

  onScroll(): void {
    this.pageCount++;
    this.searchByTerm();
  }

  private searchByTerm(): void {
    console.debug(this._searchTerm);
    this.dishService
      .favourites$()
      .pipe(first())
      .subscribe({
        next: (value: PageDishes) => {
          this.dishes = value.dishes;
        },
        error: (err) => {
          this.snackbar.show(err, $localize`Failed to search dishes`);
        },
      });
  }
}
