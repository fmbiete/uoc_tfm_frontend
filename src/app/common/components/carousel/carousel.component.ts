import { Component, Input, OnInit } from '@angular/core';
import { Dish } from 'src/app/dishes/models/dish.dto';
import { DishService } from 'src/app/dishes/services/dish.service';
import { SnackbarService } from '../../services/snackbar.service';

@Component({
  selector: 'app-carousel',
  templateUrl: './carousel.component.html',
  styleUrls: ['./carousel.component.scss'],
  standalone: true,
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

  async favourites(): Promise<void> {
    try {
      const ret = await this.dishService.favourites();
      if (ret === undefined) {
        this.snackbar.show(
          null,
          $localize`List Favourites Dishes Failed\nUnkown Error`
        );
      } else {
        this.dishes = ret;
      }
    } catch (error: any) {
      this.snackbar.show(error, $localize`List Favourites Dishes Failed`);
    }
  }

  async promotions(): Promise<void> {
    try {
      const ret = await this.dishService.promotions();
      if (ret === undefined) {
        this.snackbar.show(
          null,
          $localize`List Promoted Dishes Failed\nUnkown Error`
        );
      } else {
        this.dishes = ret;
      }
    } catch (error: any) {
      this.snackbar.show(error, $localize`List Promoted Dishes Failed`);
    }
  }
}
