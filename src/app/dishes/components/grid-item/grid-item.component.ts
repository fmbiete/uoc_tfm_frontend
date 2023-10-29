import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { Dish } from '../../models/dish.dto';
import { RatingPipe } from '../../pipes/rating.pipe';
import { RatingComponent } from '../rating/rating.component';
import { MessageModule } from 'primeng/message';

@Component({
  selector: 'dishes-grid-item',
  standalone: true,
  imports: [
    RatingPipe,
    CommonModule,
    ButtonModule,
    MessageModule,
    TagModule,
    RatingComponent,
  ],
  templateUrl: './grid-item.component.html',
  styleUrls: ['./grid-item.component.scss'],
})
export class GridItemComponent {
  @Input('dish') dish!: Dish;
}
