import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CarouselComponent } from '../carousel/carousel.component';

@Component({
  selector: 'dishes-home',
  standalone: true,
  imports: [CommonModule, CarouselComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {}
