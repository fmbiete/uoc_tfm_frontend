import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RatingModule } from 'primeng/rating';

@Component({
  selector: 'dishes-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
  standalone: true,
  imports: [RatingModule, FormsModule],
})
export class RatingComponent {
  @Input() rating: number;

  constructor() {
    this.rating = 0;
  }
}
