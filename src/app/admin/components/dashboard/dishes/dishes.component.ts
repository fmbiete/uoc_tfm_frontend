import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { first } from 'rxjs';
import { CountDishes } from 'src/app/shared/models/dish.dto';
import { DishService } from 'src/app/shared/services/dish.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'admin-dashboard-dishes',
  standalone: true,
  imports: [CommonModule, RouterLink, ButtonModule, TooltipModule],
  templateUrl: './dishes.component.html',
  styleUrls: ['./dishes.component.scss'],
})
export class DishesComponent implements OnInit {
  numDishes: number;

  constructor(
    private snackbar: SnackbarService,
    private dishService: DishService
  ) {
    this.numDishes = 0;
  }

  ngOnInit(): void {
    this.dishService
      .count$()
      .pipe(first())
      .subscribe({
        next: (value: CountDishes) => {
          this.numDishes = value.count;
        },
        error: (err) => {
          this.snackbar.show(
            err,
            $localize`Failed to count non-administrative users`
          );
        },
      });
  }
}
