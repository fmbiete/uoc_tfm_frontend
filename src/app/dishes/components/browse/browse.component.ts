import { Component, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule, TitleCasePipe } from '@angular/common';
import {
  Observable,
  Subscription,
  debounceTime,
  distinctUntilChanged,
  map,
  switchMap,
} from 'rxjs';
import { ActivatedRoute, Router } from '@angular/router';
import { CartService } from 'src/app/cart/services/cart.service';
import { LocalStorageService } from 'src/app/common/services/local-storage.service';
import { Dish, PageDishes } from '../../models/dish.dto';
import { DishService } from '../../services/dish.service';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { MessageModule } from 'primeng/message';
import { TagModule } from 'primeng/tag';
import { RatingPipe } from '../../pipes/rating.pipe';
import { GridItemComponent } from '../grid-item/grid-item.component';
import { RatingComponent } from '../rating/rating.component';
import { CategoryService } from '../../services/category.service';
import { SnackbarService } from 'src/app/common/services/snackbar.service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@Component({
  selector: 'app-browse',
  standalone: true,
  imports: [
    AsyncPipe,
    TitleCasePipe,
    RatingPipe,
    CommonModule,
    ButtonModule,
    DataViewModule,
    MessageModule,
    TagModule,
    RatingComponent,
    GridItemComponent,
    InfiniteScrollModule,
  ],
  templateUrl: './browse.component.html',
  styleUrls: ['./browse.component.scss'],
})
export class BrowseComponent implements OnInit {
  categoryId: number;
  categoryName!: string;
  dishes: Array<Dish>;
  refSubscription!: Subscription;
  pageSize: number;
  pageCount: number;

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private route: ActivatedRoute,
    private snackbar: SnackbarService,
    private categoryService: CategoryService,
    private localStorage: LocalStorageService,
    private cartService: CartService
  ) {
    this.categoryId = 0;
    this.dishes = new Array<Dish>();
    this.pageCount = 1;
    this.pageSize = 9;
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((params) => {
      this._subscribeDishes();
    });

    this._subscribeDishes();
  }

  onScroll(): void {
    this.pageCount++;
    if (this.refSubscription) this.refSubscription.unsubscribe();

    this._subscribeDishes();
  }

  private _subscribeDishes() {
    if (this.route.snapshot.queryParams['categoryId'] != this.categoryId) {
      this.dishes.length = 0;
    }

    this.categoryId = this.route.snapshot.queryParams['categoryId'];
    this.categoryName = this.route.snapshot.queryParams['categoryName'];

    this.refSubscription = this.categoryService
      .listDishes$(this.categoryId, this.pageSize, this.pageCount)
      .subscribe({
        next: (page: PageDishes) => {
          this.dishes = this.dishes.concat(page.dishes);
          if (this.refSubscription) this.refSubscription.unsubscribe();
        },
        error: (err: any) => {
          this.snackbar.show(err, $localize`Failed to load dishes`);
        },
      });
  }
}
