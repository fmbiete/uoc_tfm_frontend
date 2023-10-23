import { Component, Input } from '@angular/core';
import { Dish } from '../../models/dish.dto';
import { RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'dish-thumbnail',
  templateUrl: './thumbnail.component.html',
  styleUrls: ['./thumbnail.component.scss'],
  standalone: true,
  imports: [RouterLink, RouterLinkActive],
})
export class ThumbnailComponent {
  @Input() dish: Dish;

  constructor() {
    this.dish = new Dish();
  }
}
