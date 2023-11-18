import { Component, OnDestroy, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule, TitleCasePipe } from '@angular/common';
import { Subscription, first } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { Dish, PageDishes } from 'src/app/shared/models/dish.dto';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { MessageModule } from 'primeng/message';
import { TagModule } from 'primeng/tag';
import { RatingPipe } from '../../pipes/rating.pipe';
import { GridItemComponent } from '../grid-item/grid-item.component';
import { RatingComponent } from '../rating/rating.component';
import { CategoryService } from 'src/app/shared/services/category.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';

@Component({
  selector: 'dishes-browse',
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
export class BrowseComponent implements OnInit, OnDestroy {
  categoryId: number;
  categoryName!: string;
  dishes: Array<Dish>;
  pageSize: number;
  pageCount: number;

  private routeSubscription!: Subscription;

  constructor(
    private activatedRoute: ActivatedRoute,
    private route: ActivatedRoute,
    private snackbar: SnackbarService,
    private categoryService: CategoryService
  ) {
    this.categoryId = 0;
    this.dishes = new Array<Dish>();
    this.pageCount = 1;
    this.pageSize = 9;
  }

  ngOnInit(): void {
    this.routeSubscription = this.activatedRoute.queryParams.subscribe(() => {
      this.listDishes();
    });
  }

  ngOnDestroy(): void {
    this.routeSubscription.unsubscribe();
  }

  onScroll(): void {
    this.pageCount++;
    this.listDishes();
  }

  private listDishes() {
    if (this.route.snapshot.queryParams['categoryId'] != this.categoryId) {
      // Change of category - reset dishes
      this.dishes.length = 0;
      this.pageCount = 1;
    }

    this.categoryId = this.route.snapshot.queryParams['categoryId'];
    this.categoryName = this.route.snapshot.queryParams['categoryName'];

    this.categoryService
      .listDishes$(this.categoryId, this.pageSize, this.pageCount)
      .pipe(first())
      .subscribe({
        next: (page: PageDishes) => {
          this.dishes = this.dishes.concat(page.dishes);
        },
        error: (err) => {
          this.snackbar.show(err, $localize`Failed to load dishes`);
        },
      });
  }
}
