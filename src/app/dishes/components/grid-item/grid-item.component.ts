import { Component, Input } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { Dish } from 'src/app/shared/models/dish.dto';
import { RatingPipe } from '../../pipes/rating.pipe';
import { RatingComponent } from '../rating/rating.component';
import { MessageModule } from 'primeng/message';
import { CartService } from 'src/app/shared/services/cart.service';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'dishes-grid-item',
  standalone: true,
  imports: [
    TitleCasePipe,
    RatingPipe,
    CommonModule,
    ButtonModule,
    MessageModule,
    TagModule,
    RatingComponent,
    RouterLink,
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
