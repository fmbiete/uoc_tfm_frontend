import { Component, Input, OnInit } from '@angular/core';
import { Dish } from '../../models/dish.dto';
import { SnackbarService } from 'src/app/common/services/snackbar.service';
import { DishService } from '../../services/dish.service';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  standalone: true,
})
export class DetailComponent implements OnInit {
  @Input() id?: string;
  dish: Dish;

  constructor(
    private snackbar: SnackbarService,
    private dishService: DishService
  ) {
    this.dish = new Dish();
  }

  ngOnInit(): void {
    if (this.id !== undefined) {
      this.dishService.detail(parseInt(this.id)).subscribe({
        next: (dish: Dish) => {
          console.debug(dish);
          this.dish = dish;
        },
        error: (err: HttpErrorResponse) => {
          this.snackbar.show(err.error, $localize`Detail Dish Failed`);
        },
      });
    }
  }
}
