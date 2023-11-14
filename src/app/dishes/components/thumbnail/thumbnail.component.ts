import { Component, Input } from '@angular/core';
import { Dish } from 'src/app/shared/models/dish.dto';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { CartService } from 'src/app/shared/services/cart.service';
import { TagModule } from 'primeng/tag';

@Component({
  selector: 'dishes-thumbnail',
  templateUrl: './thumbnail.component.html',
  styleUrls: ['./thumbnail.component.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterLink,
    RouterLinkActive,
    CurrencyPipe,
    ButtonModule,
    TagModule,
  ],
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
