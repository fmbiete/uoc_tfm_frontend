import { Component, Input } from '@angular/core';
import { CommonModule, CurrencyPipe, TitleCasePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { Dish } from 'src/app/shared/models/dish.dto';
import { RouterLink } from '@angular/router';
import { CartService } from 'src/app/shared/services/cart.service';
import { CurrentPricePipe } from 'src/app/dishes/pipes/current-price.pipe';

@Component({
  selector: 'dishes-home-item',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    TitleCasePipe,
    RouterLink,
    ButtonModule,
    CurrentPricePipe,
  ],
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.scss'],
})
export class ItemComponent {
  @Input() dish: Dish;

  constructor(private cartService: CartService) {
    this.dish = new Dish();
  }

  addCart(): void {
    this.cartService.addLine(this.dish);
  }
}
