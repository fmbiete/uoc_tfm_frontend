import { Component, Input } from '@angular/core';
import { CommonModule, CurrencyPipe, TitleCasePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { Dish } from 'src/app/shared/models/dish.dto';
import { RatingPipe } from '../../pipes/rating.pipe';
import { RatingComponent } from '../rating/rating.component';
import { MessageModule } from 'primeng/message';
import { CartService } from 'src/app/shared/services/cart.service';
import { RouterLink } from '@angular/router';
import { CurrentPricePipe } from '../../pipes/current-price.pipe';

@Component({
  selector: 'dishes-grid-item',
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    CurrencyPipe,
    TitleCasePipe,
    CurrentPricePipe,
    RatingComponent,
    RatingPipe,
    ButtonModule,
    MessageModule,
    TagModule,
  ],
  templateUrl: './grid-item.component.html',
  styleUrls: ['./grid-item.component.scss'],
})
export class GridItemComponent {
  @Input() dish!: Dish;

  constructor(private cartService: CartService) {}

  addCart(): void {
    this.cartService.addLine(this.dish);
  }
}
