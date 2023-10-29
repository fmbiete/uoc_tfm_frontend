import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { MenuModule } from 'primeng/menu';
import { MenuItem } from 'primeng/api';
import { Router } from '@angular/router';

@Component({
  selector: 'dishes-menu',
  standalone: true,
  imports: [CommonModule, ButtonModule, MenuModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  categories: MenuItem[];

  constructor(private router: Router) {
    // TODO: get categories
    this.categories = [
      {
        label: 'Curries',
        command: () => {
          this.browseDishes('curries');
        },
      },
      {
        label: 'Desserts',
        command: () => {
          this.browseDishes('');
        },
      },
      {
        label: 'Pasta',
        command: () => {
          this.browseDishes('');
        },
      },
      {
        label: 'Pizza',
        command: () => {
          this.browseDishes('');
        },
      },
      {
        label: 'Salads',
        command: () => {
          this.browseDishes('');
        },
      },
      {
        label: 'Sandwiches',
        command: () => {
          this.browseDishes('');
        },
      },
      {
        label: 'Pies, Pastries',
        command: () => {
          this.browseDishes('');
        },
      },
      {
        label: 'Soups',
        command: () => {
          this.browseDishes('');
        },
      },
      {
        label: 'Rice',
        command: () => {
          this.browseDishes('');
        },
      },
    ];
  }

  browseDishes(category: string) {
    this.router.navigate(['dishes', 'browse'], {
      queryParams: { category: category },
    });
  }
}
