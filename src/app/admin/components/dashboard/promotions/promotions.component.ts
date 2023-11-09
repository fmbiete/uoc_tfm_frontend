import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';

@Component({
  selector: 'admin-dashboard-promotions',
  standalone: true,
  imports: [CommonModule, ButtonModule, FieldsetModule],
  templateUrl: './promotions.component.html',
  styleUrls: ['./promotions.component.scss'],
})
export class PromotionsComponent {
  numPromotions: number;

  constructor() {
    this.numPromotions = 0;
  }
}
