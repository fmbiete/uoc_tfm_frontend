import { Component } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { Order } from 'src/app/shared/models/order.dto';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { InputNumberInputEvent, InputNumberModule } from 'primeng/inputnumber';
import { FormsModule } from '@angular/forms';
import { TotalPipe } from '../../pipes/total.pipe';
import { TooltipModule } from 'primeng/tooltip';
import { OrderService } from 'src/app/shared/services/order.service';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { first } from 'rxjs';
import { PDF } from 'src/app/shared/utilities/pdf.class';

@Component({
  selector: 'orders-detail',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    DatePipe,
    FormsModule,
    ButtonModule,
    DividerModule,
    InputNumberModule,
    TooltipModule,
    TotalPipe,
  ],
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  providers: [CurrencyPipe],
})
export class DetailComponent {
  order: Order;

  constructor(
    private router: Router,
    private snackbar: SnackbarService,
    private orderService: OrderService,
    private currencyPipe: CurrencyPipe
  ) {
    this.order = this.router.getCurrentNavigation()?.extras.state?.['order'];
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onLineQuantityChange(event: InputNumberInputEvent): void {
    // Create a copy of the object to trigger summary update
    this.order = { ...this.order };
  }

  deleteLine(lineId: number): void {
    console.debug(`Delete line ${lineId}`);
    this.orderService
      .lineDelete$(this.order.ID, lineId)
      .pipe(first())
      .subscribe({
        next: (value: Order) => {
          this.order = value;
          this.snackbar.show(null, $localize`Order modified successfully`);
        },
        error: (err) => {
          this.snackbar.show(err, $localize`Failed to delete Order Line`);
        },
      });
  }

  deleteOrder(): void {
    this.orderService
      .delete$(this.order.ID)
      .pipe(first())
      .subscribe({
        next: () => {
          this.router.navigate(['orders']);
          this.snackbar.show(null, $localize`Order has been canceled`);
        },
        error: (err) => {
          this.snackbar.show(err, $localize`Failed to delete the Order`);
        },
      });
  }

  modifyOrder(): void {
    const order = { ...this.order };
    order.OrderLines.forEach((line) => {
      this.orderService
        .lineModify$(line)
        .pipe(first())
        .subscribe({
          next: (value: Order) => {
            this.order = value;
          },
          error: (err) => {
            this.snackbar.show(err, $localize`Failed to modify Order`);
          },
        });
    });
  }

  printReceipt(): void {
    const doc = new PDF(this.currencyPipe);
    doc.text(
      $localize`Order Number ${this.order.ID}`,
      20,
      'bold',
      'center',
      20
    );
    doc.text(
      $localize`Purchase Date: ${new Date(
        this.order.CreatedAt
      ).toLocaleDateString(undefined, {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })}`,
      16,
      'normal',
      '',
      15
    );
    doc.orderLines(this.order.OrderLines);

    doc.addSpace(10);
    const afterOrder = doc.getY();
    doc.orderAddress(this.order);
    doc.setY(afterOrder);
    doc.orderCostSummary(this.order);

    doc.save(`OrderReceipt.pdf`);
  }
}
