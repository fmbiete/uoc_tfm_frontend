import { Component, Input, OnInit } from '@angular/core';
import { Dish, PageDishes } from 'src/app/dishes/models/dish.dto';
import { DishService } from 'src/app/dishes/services/dish.service';
import { SnackbarService } from '../../services/snackbar.service';
import { NgFor, NgForOf, NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ThumbnailComponent } from 'src/app/dishes/components/thumbnail/thumbnail.component';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, NgForOf, NgxSkeletonLoaderModule, ThumbnailComponent],
})
export class CarouselComponent implements OnInit {
  @Input() filter: string = 'favourites';

  loaded: boolean;
  dishes: Dish[];

  constructor(
    private snackbar: SnackbarService,
    private dishService: DishService
  ) {
    this.loaded = false;
    this.dishes = new Array<Dish>();
  }

  ngOnInit(): void {
    if (this.filter == 'promotions') {
      this.promotions();
    } else {
      this.favourites();
    }
  }

  favourites(): void {
    this.dishService.favourites().subscribe({
      next: (page: PageDishes) => {
        this.dishes = page.dishes;
        this.loaded = true;
      },
      error: (err: HttpErrorResponse) => {
        this.snackbar.show(err.error, $localize`List Favourite Dishes Failed`);
      },
    });
  }

  promotions(): void {
    this.dishService.favourites().subscribe({
      next: (page: PageDishes) => {
        this.dishes = page.dishes;
        this.loaded = true;
      },
      error: (err: HttpErrorResponse) => {
        this.snackbar.show(err.error, $localize`List Promotion Dishes Failed`);
      },
    });
  }
}
