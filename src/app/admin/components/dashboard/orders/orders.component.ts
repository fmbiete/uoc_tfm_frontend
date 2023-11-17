import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { jsPDF } from 'jspdf';
import { ButtonModule } from 'primeng/button';
import { FieldsetModule } from 'primeng/fieldset';
import { TooltipModule } from 'primeng/tooltip';
import { first } from 'rxjs';
import { OrderLine } from 'src/app/shared/models/order-line.dto';
import { CountOrder, Order, PageOrders } from 'src/app/shared/models/order.dto';
import { User } from 'src/app/shared/models/user.dto';
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

  private doc: jsPDF;
  private docY: number;
  private docMaxY = 280;
  private docFontMain: string;
  private docFontSans = 'courier';
  private docFontTitleSize = 20;
  private docFontMainSize = 12;
  private docMarginLeft = 20;
  private docMarginCenter = 105;
  private docMaxLineLength = 63;

  constructor(
    private snackbar: SnackbarService,
    private orderService: OrderService
  ) {
    this.numOrders = 0;
    this.doc = new jsPDF();
    this.docFontMain = this.doc.getFont().fontName;
    this.docY = 20;
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
          this.doc = new jsPDF();
          this._writeHeader();
          value.orders.forEach((order, idx) => {
            this._writeOrder(idx + 1, order);
          });
          this.doc.save('OrderList.pdf');
        },
        error: (err) => {
          this.snackbar.show(err, $localize`Failed to list today's Orders`);
        },
      });
  }

  private _writeHeader() {
    this.doc
      .setFontSize(this.docFontTitleSize)
      .setFont(this.docFontMain, 'bold')
      .text(
        `Orders for ${new Date().toISOString().slice(0, 10)}`,
        this.docMarginCenter,
        this._currentAndMoveY(20),
        {
          align: 'center',
        }
      );
  }

  private _writeOrder(idx: number, order: Order): void {
    console.debug(`Order ${idx}`);
    console.debug(order);
    this._writeOrderHeader(idx, order.User);
    this._writeOrderLines(order.OrderLines);
    this._currentAndMoveY(10);
  }

  private _writeOrderHeader(idx: number, user: User): void {
    this.doc
      .setFontSize(this.docFontMainSize)
      .setFont(this.docFontMain, 'normal')
      .text(`Order #${idx}`, this.docMarginLeft, this._currentAndMoveY(6));
    this.doc
      .setFontSize(this.docFontMainSize)
      .setFont(this.docFontMain, 'bold')
      .text(
        `${user.Surname}, ${user.Name}`,
        this.docMarginLeft,
        this._currentAndMoveY(10)
      );
  }

  private _writeOrderLines(lines: OrderLine[]): void {
    lines.forEach((line) => {
      this.doc
        .setFontSize(this.docFontMainSize)
        .setFont(this.docFontSans, 'normal')
        .text(
          this._padLine(line),
          this.docMarginLeft,
          this._currentAndMoveY(6)
        );
    });
  }

  private _currentAndMoveY(inc: number): number {
    const currentY = this.docY;
    if (this.docY + inc > this.docMaxY) {
      this.doc.addPage();
      this.docY = 20;
    } else {
      this.docY += inc;
    }

    return currentY;
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
