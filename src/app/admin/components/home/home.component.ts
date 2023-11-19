import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { OrdersComponent } from '../dashboard/orders/orders.component';
import { PromotionsComponent } from '../dashboard/promotions/promotions.component';
import { SalesComponent } from '../dashboard/sales/sales.component';
import { UsersComponent } from '../dashboard/users/users.component';
import { DishesComponent } from '../dashboard/dishes/dishes.component';

@Component({
  selector: 'admin-home',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    DishesComponent,
    OrdersComponent,
    PromotionsComponent,
    SalesComponent,
    UsersComponent,
  ],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent {}
