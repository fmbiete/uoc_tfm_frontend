import { Component, Input, OnInit } from '@angular/core';
import { Dish, PageDishes } from 'src/app/dishes/models/dish.dto';
import { DishService } from 'src/app/dishes/services/dish.service';
import { SnackbarService } from '../../services/snackbar.service';
import { NgFor, NgForOf } from '@angular/common';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  standalone: true,
  imports: [NgFor, NgForOf],
})
export class CarouselComponent implements OnInit {
  @Input() filter: string = 'favourites';

  dishes: Dish[];

  constructor(
    private snackbar: SnackbarService,
    private dishService: DishService
  ) {
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
      },
      error: (err: HttpErrorResponse) => {
        this.snackbar.show(err.error, $localize`List Promotion Dishes Failed`);
      },
    });
  }
}
