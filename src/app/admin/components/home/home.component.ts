import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldsetModule } from 'primeng/fieldset';
import { ButtonModule } from 'primeng/button';
import { OrdersComponent } from '../dashboard/orders/orders.component';
import { PromotionsComponent } from '../dashboard/promotions/promotions.component';
import { SalesComponent } from '../dashboard/sales/sales.component';

@Component({
  selector: 'admin-home',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    FieldsetModule,
    OrdersComponent,
    PromotionsComponent,
    SalesComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {}
