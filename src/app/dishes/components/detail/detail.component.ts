import { Component, Input, OnInit } from '@angular/core';
import { Dish } from '../../models/dish.dto';
import { SnackbarService } from 'src/app/common/services/snackbar.service';
import { DishService } from '../../services/dish.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule, CurrencyPipe, TitleCasePipe } from '@angular/common';
import { LocalStorageService } from 'src/app/common/services/local-storage.service';
import { RatingComponent } from '../rating/rating.component';
import { RatingPipe } from '../../pipes/rating.pipe';
import { CartService } from 'src/app/cart/services/cart.service';
import { ChipsModule } from 'primeng/chips';
import { SkeletonModule } from 'primeng/skeleton';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { BadgeModule } from 'primeng/badge';

@Component({
  selector: 'dish-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  standalone: true,
  imports: [
    CurrencyPipe,
    TitleCasePipe,
    CommonModule,
    RatingComponent,
    RatingPipe,
    ChipsModule,
    ButtonModule,
    SkeletonModule,
    FormsModule,
    TooltipModule,
    BadgeModule,
  ],
})
export class DetailComponent implements OnInit {
  @Input() id?: string;

  loaded: boolean = false;
  authenticated: boolean = false;
  dish: Dish = new Dish();
  liked: boolean;
  disliked: boolean;

  constructor(
    private snackbar: SnackbarService,
    private dishService: DishService,
    private localStorage: LocalStorageService,
    private cartService: CartService
  ) {
    this.liked = false;
    this.disliked = false;
  }

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
      next: () => {
        this.liked = true;
        this.disliked = false;
      },
      error: (err: HttpErrorResponse) => {
        this.snackbar.show(err.error, $localize`Like Dish Failed`);
      },
    });
  }

  dislike(): void {
    this.dishService.dislike(this.dish.ID).subscribe({
      next: () => {
        this.liked = false;
        this.disliked = true;
      },
      error: (err: HttpErrorResponse) => {
        this.snackbar.show(err.error, $localize`Dislike Dish Failed`);
      },
    });
  }
}
