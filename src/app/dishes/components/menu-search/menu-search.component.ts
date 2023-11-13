import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'dishes-menu-search',
  standalone: true,
  imports: [CommonModule, ButtonModule],
  templateUrl: './menu-search.component.html',
  styleUrls: ['./menu-search.component.scss'],
})
export class MenuSearchComponent {
  constructor(private router: Router) {}

  onClick(): void {
    this.router.navigate(['dishes', 'search']);
  }
}
