import { CommonModule, CurrencyPipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';
import { TooltipModule } from 'primeng/tooltip';
import { first } from 'rxjs';
import { OrderLine } from 'src/app/shared/models/order-line.dto';
import { CountOrder, Order, PageOrders } from 'src/app/shared/models/order.dto';
import { User } from 'src/app/shared/models/user.dto';
import { OrderService } from 'src/app/shared/services/order.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { PDF } from 'src/app/shared/utilities/pdf.class';

@Component({
  selector: 'admin-dashboard-orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.scss'],
  standalone: true,
  imports: [CommonModule, ButtonModule, FieldsetModule, TooltipModule],
  providers: [CurrencyPipe],
})
export class OrdersComponent implements OnInit {
  numOrders: number;

  private doc!: PDF;
  private docMaxLineLength = 63;

  constructor(
    private snackbar: SnackbarService,
    private orderService: OrderService,
    private currencyPipe: CurrencyPipe
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

  generatePdf(): void {
    this.orderService
      .listToday$()
      .pipe(first())
      .subscribe({
        next: (value: PageOrders) => {
          this.doc = new PDF(this.currencyPipe);
          this._writeHeader();
          value.orders.forEach((order) => {
            this._writeOrder(order);
          });
          this.doc.save('OrderList.pdf');
        },
        error: (err) => {
          this.snackbar.show(err, $localize`Failed to list today's Orders`);
        },
      });
  }

  private _writeHeader() {
    this.doc.text(
      `Orders for ${new Date().toISOString().slice(0, 10)}`,
      18,
      'bold',
      'center',
      20
    );
  }

  private _writeOrder(order: Order): void {
    this._writeOrderHeader(order.ID, order.User);
    this._writeOrderLines(order.OrderLines);
  }

  private _writeOrderHeader(idx: number, user: User): void {
    this.doc.text(`Order #${idx}`, 16, 'normal', '', 6);
    this.doc.text(`${user.Surname}, ${user.Name}`, 14, 'bold', '', 10);
  }

  private _writeOrderLines(lines: OrderLine[]): void {
    lines.forEach((line) => {
      this.doc.textSans(this._padLine(line), 13, 'normal', '', 6);
    });
    this.doc.addSpace(10);
  }

  private _padLine(line: OrderLine): string {
    // 3 char for quantity
    const quantity = `${line.Quantity}`.padStart(3, ' ');
    const name = line.Name.substring(0, this.docMaxLineLength - 5).padEnd(
      this.docMaxLineLength - 3,
      '.'
    );
    return `${name}${quantity}`;
  }
}
