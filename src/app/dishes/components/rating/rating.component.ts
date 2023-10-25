import { NgFor } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'dish-rating',
  templateUrl: './rating.component.html',
  styleUrls: ['./rating.component.scss'],
  standalone: true,
  imports: [MatIconModule, NgFor],
})
export class RatingComponent implements OnInit {
  @Input() rating: number = 0;
  stars: Array<string> = new Array<string>(5).fill('');

  ngOnInit(): void {
    console.debug(this.rating);
    this.stars = this.stars.map<string>((v: string, i: number) =>
      i < this.rating ? 'accent' : ''
    );
  }
}
