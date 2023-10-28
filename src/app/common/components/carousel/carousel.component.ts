import { Component, Input, OnInit } from '@angular/core';
import { Dish, PageDishes } from 'src/app/dishes/models/dish.dto';
import { DishService } from 'src/app/dishes/services/dish.service';
import { SnackbarService } from '../../services/snackbar.service';
import { NgFor, NgForOf, NgIf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';
import { ThumbnailComponent } from 'src/app/dishes/components/thumbnail/thumbnail.component';
import { CarouselModule } from 'primeng/carousel';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, NgForOf, ThumbnailComponent, CarouselModule],
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
