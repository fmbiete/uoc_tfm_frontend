import { Component, Input, OnInit } from '@angular/core';
import { Dish } from '../../models/dish.dto';
import { SnackbarService } from 'src/app/common/services/snackbar.service';
import { DishService } from '../../services/dish.service';
import { HttpErrorResponse } from '@angular/common/http';
import { NgFor, NgIf } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { LocalStorageService } from 'src/app/common/services/local-storage.service';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  standalone: true,
  imports: [
    NgxSkeletonLoaderModule,
    NgFor,
    NgIf,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
  ],
})
export class DetailComponent implements OnInit {
  @Input() id?: string;

  loaded: boolean;
  authenticated: boolean;
  dish: Dish;
  rating: Array<string>;

  constructor(
    private snackbar: SnackbarService,
    private dishService: DishService,
    private localStorage: LocalStorageService
  ) {
    this.authenticated = false;
    this.loaded = false;
    this.dish = new Dish();
    this.rating = new Array<string>(5);
  }

  ngOnInit(): void {
    if (this.id !== undefined) {
      this.dishService.detail(parseInt(this.id)).subscribe({
        next: (dish: Dish) => {
          this.dish = dish;
          console.debug(dish);
          const model = new Dish();
          Object.assign(model, dish);
          console.debug(model);
          this.rating = model.calculateRating();
          this.loaded = true;
          this.authenticated = this.localStorage.isLoggedIn();
        },
        error: (err: HttpErrorResponse) => {
          this.snackbar.show(err.error, $localize`Detail Dish Failed`);
        },
      });
    }
  }

  like(): void {
    this.dishService.like(this.dish.ID).subscribe({
      next: () => {},
      error: (err: HttpErrorResponse) => {
        this.snackbar.show(err.error, $localize`Like Dish Failed`);
      },
    });
  }

  dislike(): void {
    this.dishService.dislike(this.dish.ID).subscribe({
      next: () => {},
      error: (err: HttpErrorResponse) => {
        this.snackbar.show(err.error, $localize`Dislike Dish Failed`);
      },
    });
  }
}
