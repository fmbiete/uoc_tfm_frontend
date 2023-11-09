import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'admin-dashboard-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  standalone: true,
  imports: [CommonModule, ButtonModule, FieldsetModule, TooltipModule],
})
export class OrdersComponent {
  numOrders: number;

  constructor() {
    this.numOrders = 0;
  }
}
