import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe, DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { ModifiableOrder, Order } from 'src/app/shared/models/order.dto';
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
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { ConfirmationService } from 'primeng/api';

@Component({
  selector: 'orders-detail',
  standalone: true,
  imports: [
    CommonModule,
    CurrencyPipe,
    DatePipe,
    FormsModule,
    ButtonModule,
    ConfirmDialogModule,
    DividerModule,
    InputNumberModule,
    TooltipModule,
    TotalPipe,
  ],
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  providers: [CurrencyPipe, ConfirmationService],
})
export class DetailComponent implements OnInit {
  order: Order;
  isDelivered: boolean;
  isModifiable: boolean;

  constructor(
    private router: Router,
    private snackbar: SnackbarService,
    private orderService: OrderService,
    private currencyPipe: CurrencyPipe,
    private confirmationService: ConfirmationService
  ) {
    this.isDelivered = false;
    this.isModifiable = false;
    this.order = this.router.getCurrentNavigation()?.extras.state?.['order'];
  }

  ngOnInit(): void {
    this.orderService
      .getModifiable$(this.order.ID)
      .pipe(first())
      .subscribe({
        next: (value: ModifiableOrder) => {
          this.isModifiable = value.modifiable;
        },
        error: (err) => {
          if (err.error.message == `this order has been already delivered`) {
            this.isDelivered = true;
          } else {
            this.snackbar.show(
              err,
              $localize`Failed to check if the Order is modifiable`
            );
          }
        },
      });
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onLineQuantityChange(event: InputNumberInputEvent): void {
    // Create a copy of the object to trigger summary update
    this.order = { ...this.order };
  }

  deleteLine(lineId: number): void {
    this.confirmationService.confirm({
      message: $localize`Do you want to cancel this line?`,
      header: $localize`Confirmation Removal of Line`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
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
      },
    });
  }

  deleteOrder(): void {
    this.confirmationService.confirm({
      message: $localize`Do you want to cancel this Order?`,
      header: $localize`Confirmation Cancelation of Order`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
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
      },
    });
  }

  modifyOrder(): void {
    this.confirmationService.confirm({
      message: $localize`Do you want to modify this Order?`,
      header: $localize`Confirmation Modification of Order`,
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        // create a copy of the current view, because we modify 1 line at a time, and each intermediate step changes the class variable
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
      },
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
