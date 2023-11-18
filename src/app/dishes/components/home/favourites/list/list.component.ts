import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ItemComponent } from '../../item/item.component';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { DishService } from 'src/app/shared/services/dish.service';
import { first } from 'rxjs';
import { Dish, PageDishes } from 'src/app/shared/models/dish.dto';

@Component({
  selector: 'dishes-home-favourites-list',
  standalone: true,
  imports: [CommonModule, ItemComponent],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  loading: boolean;
  dishes: Array<Dish>;

  constructor(
    private snackbar: SnackbarService,
    private dishService: DishService
  ) {
    this.loading = true;
    this.dishes = new Array<Dish>();
  }

  ngOnInit(): void {
    this.dishService
      .favourites$()
      .pipe(first())
      .subscribe({
        next: (value: PageDishes) => {
          this.dishes = value.dishes;
          this.loading = false;
        },
        error: (err) => {
          this.snackbar.show(err, $localize`Failed to list favourites`);
        },
      });
  }
}
