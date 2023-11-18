import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { ButtonModule } from 'primeng/button';
import { DataViewModule } from 'primeng/dataview';
import { TagModule } from 'primeng/tag';
import { Order, PageOrders } from 'src/app/shared/models/order.dto';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { OrderService } from 'src/app/shared/services/order.service';
import { first } from 'rxjs';
import { InfiniteScrollModule } from 'ngx-infinite-scroll';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'orders-list',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    DatePipe,
    RouterModule,
    ButtonModule,
    DataViewModule,
    TagModule,
    InfiniteScrollModule,
  ],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit {
  private pageSize: number;
  private pageCount: number;

  loading: boolean;
  orders: Array<Order>;

  constructor(
    private snackbar: SnackbarService,
    private orderService: OrderService
  ) {
    this.pageCount = 1;
    this.pageSize = 10;
    this.loading = true;
    this.orders = new Array<Order>();
  }

  ngOnInit(): void {
    this.loading = true;
    this._loadOrders();
  }

  onScroll(): void {
    this.pageCount++;
    this._loadOrders();
  }

  private _loadOrders(): void {
    this.orderService
      .search$('', this.pageSize, this.pageCount)
      .pipe(first())
      .subscribe({
        next: (value: PageOrders) => {
          this.loading = false;
          this.orders = this.orders.concat(value.orders);
        },
        error: (err) => {
          this.snackbar.show(err, $localize`Failed to list Orders`);
        },
      });
  }
}
