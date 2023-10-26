import { Component, Input, OnInit } from '@angular/core';
import { Dish } from '../../models/dish.dto';
import { SnackbarService } from 'src/app/common/services/snackbar.service';
import { DishService } from '../../services/dish.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CurrencyPipe, NgFor, NgIf } from '@angular/common';
import { MatChipsModule } from '@angular/material/chips';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { NgxSkeletonLoaderModule } from 'ngx-skeleton-loader';
import { LocalStorageService } from 'src/app/common/services/local-storage.service';
import { RatingComponent } from '../rating/rating.component';
import { RatingPipe } from '../../pipes/rating.pipe';
import { CartService } from 'src/app/cart/services/cart.service';

@Component({
  selector: 'dish-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  standalone: true,
  imports: [
    CurrencyPipe,
    NgxSkeletonLoaderModule,
    NgFor,
    NgIf,
    MatChipsModule,
    MatIconModule,
    MatButtonModule,
    RatingComponent,
    RatingPipe,
  ],
})
export class DetailComponent implements OnInit {
  @Input() id?: string;

  loaded: boolean = false;
  authenticated: boolean = false;
  dish: Dish = new Dish();

  constructor(
    private snackbar: SnackbarService,
    private dishService: DishService,
    private localStorage: LocalStorageService,
    private cartService: CartService
  ) {}

  ngOnInit(): void {
    this.authenticated = this.localStorage.isLoggedIn();
    if (this.id !== undefined) {
      this.dishService.detail(parseInt(this.id)).subscribe({
        next: (dish: Dish) => {
          this.dish = dish;
          this.loaded = true;
        },
        error: (err: HttpErrorResponse) => {
          this.snackbar.show(err.error, $localize`Detail Dish Failed`);
        },
      });
    }
  }

  addCart(): void {
    this.cartService.addLine(this.dish);
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
