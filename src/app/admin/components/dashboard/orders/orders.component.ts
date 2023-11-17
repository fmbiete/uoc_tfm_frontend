import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';
import { TooltipModule } from 'primeng/tooltip';
import { first } from 'rxjs';
import { CountOrder } from 'src/app/shared/models/order.dto';
import { OrderService } from 'src/app/shared/services/order.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';

@Component({
  selector: 'admin-dashboard-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  standalone: true,
  imports: [CommonModule, ButtonModule, FieldsetModule, TooltipModule],
})
export class OrdersComponent implements OnInit {
  numOrders: number;

  constructor(
    private snackbar: SnackbarService,
    private orderService: OrderService
  ) {
    this.numOrders = 0;
  }

  ngOnInit(): void {
    this.orderService
      .countToday$()
      .pipe(first())
      .subscribe({
        next: (value: CountOrder[]) => {
          this.numOrders = value.length == 0 ? 0 : value[0].count;
        },
        error: (err) => {
          this.snackbar.show(err, $localize`Failed to count today's Orders`);
        },
      });
  }
}
