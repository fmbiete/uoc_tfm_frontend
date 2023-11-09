import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FieldsetModule } from 'primeng/fieldset';
import { ButtonModule } from 'primeng/button';
import { OrdersComponent as AdminDashboardOrdersComponent } from 'src/app/admin/components/dashboard/orders/orders.component';
import { PromotionsComponent as AdminDashboardPromotionsComponent } from 'src/app/admin/components/dashboard/promotions/promotions.component';
import { SalesComponent as AdminDashboardSalesComponent } from 'src/app/admin/components/dashboard/sales/sales.component';

@Component({
  selector: 'common-home-admin',
  standalone: true,
  imports: [
    CommonModule,
    ButtonModule,
    FieldsetModule,
    AdminDashboardOrdersComponent,
    AdminDashboardPromotionsComponent,
    AdminDashboardSalesComponent,
  ],
  templateUrl: './home-admin.component.html',
  styleUrls: ['./home-admin.component.scss'],
})
export class HomeAdminComponent {}
