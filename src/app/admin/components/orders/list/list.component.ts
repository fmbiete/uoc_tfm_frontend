import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { CommonModule, TitleCasePipe } from '@angular/common';
import { OrderService } from 'src/app/shared/services/order.service';
import {
  ISearchOrder,
  Order,
  PageOrders,
} from 'src/app/shared/models/order.dto';
import { Table, TableLazyLoadEvent, TableModule } from 'primeng/table';
import {
  Subscription,
  Subject,
  debounceTime,
  distinctUntilChanged,
  switchMap,
} from 'rxjs';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { ButtonModule } from 'primeng/button';
import { FormsModule } from '@angular/forms';
import { TooltipModule } from 'primeng/tooltip';
import { InputTextModule } from 'primeng/inputtext';
import { UserFullnamePipe } from 'src/app/shared/pipes/user-fullname.pipe';
import { CalendarModule } from 'primeng/calendar';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'admin-orders-list',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    TitleCasePipe,
    ButtonModule,
    CalendarModule,
    InputTextModule,
    TableModule,
    TooltipModule,
    UserFullnamePipe,
  ],
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss'],
})
export class ListComponent implements OnInit, OnDestroy {
  @ViewChild('table') table!: Table;
  @ViewChild('filterBox') filterBox!: HTMLInputElement;

  private subscription!: Subscription;
  searchDate: string;
  private searchDate$: Subject<ISearchOrder>;
  private pageSize: number;
  private pageCount: number;

  orders: Order[];
  loading: boolean;
  fakeTotalOrders: number;

  private routeSubscription!: Subscription;
  pageTitle: string;
  visibleFilter: boolean;

  constructor(
    private route: ActivatedRoute,
    private snackbar: SnackbarService,
    private orderService: OrderService
  ) {
    this.visibleFilter = true;
    this.pageTitle = '';
    this.pageSize = 10;
    this.pageCount = 1;
    this.searchDate$ = new Subject<ISearchOrder>();
    this.searchDate = '';
    this.orders = new Array<Order>();
    this.loading = true;
    // mark the total as 1+row size to have pagination
    this.fakeTotalOrders = this.pageSize + 1;
  }

  ngOnInit(): void {
    this.loading = true;
    // lazy load
    this._subscribeSearch();

    this._subscribeRoute();
  }

  private _subscribeSearch() {
    this.subscription = this.searchDate$
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((value: ISearchOrder) => {
          return this.orderService.search$(
            value.filter.length == 0
              ? ''
              : new Date(value.filter).toISOString().slice(0, 10),
            value.pageSize,
            value.pageCount
          );
        })
      )
      .subscribe({
        next: (value: PageOrders) => {
          // we only show the current page
          this.orders = value.orders;
          if (value.orders.length == this.pageSize) {
            // If this page is full of elements (we exactly have pageSize),
            // we add 1 to our fake total to enable "next page"
            this.fakeTotalOrders = this.pageSize * this.pageCount + 1;
          } else {
            // If this page is not full
            // we add only what we have; this will disable "next page"
            this.fakeTotalOrders =
              this.pageSize * (this.pageCount - 1) + value.orders.length;
          }
          this.loading = false;
        },
        error: (err) => {
          this.snackbar.show(err, $localize`Failed to search orders`);
        },
      });
  }

  private _subscribeRoute() {
    this.routeSubscription = this.route.paramMap.subscribe((params) => {
      if (params.get('todayOnly') === 'true') {
        this.pageTitle = $localize`Today's Orders`;
        this.searchDate = new Date().toISOString().slice(0, 10);
        this.visibleFilter = false;
      } else {
        this.pageTitle = $localize`Orders`;
        this.searchDate = '';
        this.visibleFilter = true;
      }
      const event: TableLazyLoadEvent = {};
      this.loadOrders(event);
    });
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.routeSubscription.unsubscribe();
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onSelectDate(value: Date): void {
    // clear resets pagination
    this.table.clear();
    this.loading = true;

    // key pressed - new search always?
    this.pageCount = 1;

    const data: ISearchOrder = {
      filter: this.searchDate,
      pageCount: this.pageCount,
      pageSize: this.pageSize,
    };

    this.searchDate$.next(data);
  }

  loadOrders(event: TableLazyLoadEvent): void {
    this.loading = true;
    // pageSize is the value selected or our default
    this.pageSize = event.rows ?? this.pageSize;
    // pageCount is 0 based in the table, but 1 based in the API
    // first contains the number of elements
    this.pageCount =
      event.first == undefined ? 1 : event.first / this.pageSize + 1;

    const data: ISearchOrder = {
      filter: this.searchDate,
      pageCount: this.pageCount,
      pageSize: this.pageSize,
    };

    this.searchDate$.next(data);
  }

  resetFilter(table: Table) {
    this.searchDate = '';
    this.pageCount = 1;

    const data: ISearchOrder = {
      filter: this.searchDate,
      pageCount: this.pageCount,
      pageSize: this.pageSize,
    };

    this.searchDate$.next(data);

    // clear resets pagination
    table.clear();
  }
}
