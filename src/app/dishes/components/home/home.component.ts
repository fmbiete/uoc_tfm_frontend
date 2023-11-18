import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { environment } from 'src/environments/environment';
import { ListComponent as FavouritesComponent } from './favourites/list/list.component';
import { ListComponent as PromotionsComponent } from './promotions/list/list.component';

@Component({
  selector: 'dishes-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FavouritesComponent, PromotionsComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {
  categoryId: number;

  constructor() {
    this.categoryId = environment.categorySpecials;
  }
}
