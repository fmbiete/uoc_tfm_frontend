import { Component, Input, OnInit } from '@angular/core';
import { Dish, PageDishes } from 'src/app/shared/models/dish.dto';
import { DishService } from 'src/app/shared/services/dish.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { CommonModule } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ThumbnailComponent } from '../thumbnail/thumbnail.component';
import { CarouselModule } from 'primeng/carousel';
import { first } from 'rxjs';

@Component({
  selector: 'dish-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  standalone: true,
  imports: [CommonModule, ThumbnailComponent, CarouselModule],
})
export class CarouselComponent implements OnInit {
  @Input() filter: string = 'favourites';

  loaded: boolean;
  dishes: Dish[];
  responsiveOptions: any[] | undefined;

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

    this.responsiveOptions = [
      {
        breakpoint: '1199px',
        numVisible: 1,
        numScroll: 1,
      },
      {
        breakpoint: '991px',
        numVisible: 1,
        numScroll: 1,
      },
      {
        breakpoint: '767px',
        numVisible: 1,
        numScroll: 1,
      },
    ];
  }

  favourites(): void {
    this.dishService
      .favourites$()
      .pipe(first())
      .subscribe({
        next: (page: PageDishes) => {
          this.dishes = page.dishes;
          this.loaded = true;
        },
        error: (err: HttpErrorResponse) => {
          this.snackbar.show(
            err.error,
            $localize`List Favourite Dishes Failed`
          );
        },
      });
  }

  promotions(): void {
    this.dishService
      .favourites$()
      .pipe(first())
      .subscribe({
        next: (page: PageDishes) => {
          this.dishes = page.dishes;
          this.loaded = true;
        },
        error: (err: HttpErrorResponse) => {
          this.snackbar.show(
            err.error,
            $localize`List Promotion Dishes Failed`
          );
        },
      });
  }
}
