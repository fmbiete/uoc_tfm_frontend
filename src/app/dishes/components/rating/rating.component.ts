import { Component, Input, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RatingModule } from 'primeng/rating';

@Component({
  selector: 'dish-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
  standalone: true,
  imports: [RatingModule, FormsModule],
})
export class RatingComponent implements OnInit {
  @Input() rating: number = 0;

  ngOnInit(): void {}
}
