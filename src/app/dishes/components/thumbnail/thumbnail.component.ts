import { Component, Input } from '@angular/core';
import { Dish } from '../../models/dish.dto';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CartService } from 'src/app/cart/services/cart.service';

@Component({
  selector: 'dish-thumbnail',
  templateUrl: './thumbnail.component.html',
  styleUrls: ['./thumbnail.component.scss'],
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CurrencyPipe, ButtonModule],
})
export class ThumbnailComponent {
  @Input() dish: Dish;

  constructor(private cartService: CartService) {
    this.dish = new Dish();
  }

  addCart(): void {
    this.cartService.addLine(this.dish);
  }
}
