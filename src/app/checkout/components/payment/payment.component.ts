import { Component, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';
import { Cart } from 'src/app/shared/models/cart.dto';
import { CartService } from 'src/app/shared/services/cart.service';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { TotalPipe } from 'src/app/cart/pipes/total.pipe';
import { TabViewModule } from 'primeng/tabview';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { DividerModule } from 'primeng/divider';
import { InputMaskModule } from 'primeng/inputmask';
import { OrderService } from 'src/app/shared/services/order.service';
import { Subvention } from 'src/app/shared/models/subvention.dto';
import { Order } from 'src/app/shared/models/order.dto';
import { OrderLine } from 'src/app/shared/models/order-line.dto';
import { SnackbarService } from 'src/app/shared/services/snackbar.service';
import { first } from 'rxjs';

@Component({
  selector: 'checkout-payment',
  standalone: true,
  templateUrl: './payment.component.html',
  styleUrls: ['./payment.component.scss'],
  imports: [
    CommonModule,
    AsyncPipe,
    CurrencyPipe,
    TotalPipe,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    TabViewModule,
    MessageModule,
    TableModule,
    DividerModule,
    InputMaskModule,
  ],
})
export class PaymentComponent implements OnInit {
  cart: Cart;
  subvention: number;

  ccName: string;
  ccNumber: string;
  ccExpiration: string;
  ccCcv: string;

  private order: Order;

  constructor(
    private router: Router,
    private snackbarService: SnackbarService,
    private cartService: CartService,
    private orderService: OrderService,
    private localStorage: LocalStorageService
  ) {
    this.ccCcv = '';
    this.ccExpiration = '';
    this.ccName = '';
    this.ccNumber = '';
    this.subvention = 0;
    this.cart = new Cart();
    this.order = this.router.getCurrentNavigation()?.extras.state?.['order'];
  }

  goCart(): void {
    this.router.navigate(['cart']);
  }

  ngOnInit(): void {
    this._getCart();

    this._getSubvention();
  }

  private _getSubvention(): void {
    this.orderService
      .getSubvention$()
      .pipe(first())
      .subscribe({
        next: (value: Subvention) => {
          this.subvention = value.subvention;
        },
        error: (err) =>
          this.snackbarService.show(
            err,
            $localize`Failed to read Subvention, it won't be applied`
          ),
      });
  }

  private _getCart(): void {
    this.cartService
      .getCart$()
      .pipe(first())
      .subscribe({
        next: (value: Cart) => {
          this.cart = value;
        },
        error: (err) => {
          this.snackbarService.show(err, $localize`Failed to read Cart`);
        },
      });
  }

  purchase(method: string): void {
    // Prepare order
    this.order.PaymentMethod = method;
    if (method == 'card')
      this.order.PaymentSecret = `**** **** **** ${this.ccNumber.slice(-4)}`;
    this.order.OrderLines = new Array<OrderLine>();
    this.cart.Lines.forEach((line) => {
      this.order.OrderLines.push(
        new OrderLine(line.DishID, line.Name, line.CostUnit, line.Quantity)
      );
    });

    // Create order
    this.orderService
      .create$(this.order)
      .pipe(first())
      .subscribe({
        next: () => {
          // clear cart
          this.cartService.reset();
          // goto success
          this.router.navigate(['checkout', 'steps', 'success']);
        },
        error: (err) => {
          this.snackbarService.show(err, $localize`Failed to create Order`);
          // goto failure
          this.router.navigate(['checkout', 'steps', 'failure']);
        },
      });
  }
}
