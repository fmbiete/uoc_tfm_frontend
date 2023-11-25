import { Component, Input, OnInit } from '@angular/core';
import { Dish } from 'src/app/shared/models/dish.dto';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { DishService } from 'src/app/shared/services/dish.service';
import { HttpErrorResponse } from '@angular/common/http';
import { CommonModule, CurrencyPipe, TitleCasePipe } from '@angular/common';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { RatingComponent } from '../rating/rating.component';
import { RatingPipe } from '../../pipes/rating.pipe';
import { CartService } from 'src/app/shared/services/cart.service';
import { ChipsModule } from 'primeng/chips';
import { SkeletonModule } from 'primeng/skeleton';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { BadgeModule } from 'primeng/badge';
import { PanelModule } from 'primeng/panel';
import { DividerModule } from 'primeng/divider';
import { CurrentPricePipe } from '../../pipes/current-price.pipe';
import { first } from 'rxjs';

@Component({
  selector: 'dishes-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    FormsModule,
    TitleCasePipe,
    CurrentPricePipe,
    RatingComponent,
    RatingPipe,
    BadgeModule,
    ButtonModule,
    ChipsModule,
    DividerModule,
    PanelModule,
    SkeletonModule,
    TooltipModule,
  ],
})
export class DetailComponent implements OnInit {
  @Input() id?: string;

  loaded: boolean;
  authenticated: boolean;
  dish: Dish;
  liked: boolean;
  disliked: boolean;

  constructor(
    private snackbar: SnackbarService,
    private dishService: DishService,
    private localStorage: LocalStorageService,
    private cartService: CartService
  ) {
    this.dish = new Dish();
    this.loaded = false;
    this.authenticated = false;
    this.liked = false;
    this.disliked = false;
  }

  ngOnInit(): void {
    this.authenticated = this.localStorage.isUserLogged();
    if (this.id !== undefined) {
      this.dishService
        .get$(parseInt(this.id))
        .pipe(first())
        .subscribe({
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
    this.dishService
      .like$(this.dish.ID)
      .pipe(first())
      .subscribe({
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
    this.dishService
      .dislike$(this.dish.ID)
      .pipe(first())
      .subscribe({
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
