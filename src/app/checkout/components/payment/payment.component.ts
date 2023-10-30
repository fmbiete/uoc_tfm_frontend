import { Component, OnInit } from '@angular/core';
import { AsyncPipe, CommonModule, CurrencyPipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { Router } from '@angular/router';
import { Cart } from 'src/app/cart/models/cart.dto';
import { CartService } from 'src/app/cart/services/cart.service';
import { LocalStorageService } from 'src/app/common/services/local-storage.service';
import { TotalPipe } from 'src/app/cart/pipes/total.pipe';
import { FormActionsComponent } from '../form-actions/form-actions.component';
import { TabViewModule } from 'primeng/tabview';
import { MessageModule } from 'primeng/message';
import { TableModule } from 'primeng/table';
import { DividerModule } from 'primeng/divider';
import { InputMaskModule } from 'primeng/inputmask';
import { OrderService } from 'src/app/orders/services/order.service';
import { Subvention } from 'src/app/orders/models/subvention.dto';
import { Order } from 'src/app/orders/models/order.dto';
import { OrderLine } from 'src/app/orders/models/order-line.dto';
import { SnackbarService } from 'src/app/common/services/snackbar.service';

@Component({
  selector: 'app-payment',
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
    FormActionsComponent,
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

  ccName!: string;
  ccNumber!: string;
  ccExpiration!: string;
  ccCcv!: string;

  constructor(
    private router: Router,
    private snackbarService: SnackbarService,
    private cartService: CartService,
    private orderService: OrderService,
    private localStorage: LocalStorageService
  ) {
    this.subvention = 0;
    this.cart = new Cart();
  }

  goCart(): void {
    this.router.navigate(['cart']);
  }

  ngOnInit(): void {
    this.getCart();

    this.getSubvention();
  }

  private getSubvention(): void {
    this.orderService.getSubvention$().subscribe({
      next: (value: Subvention) => {
        this.subvention = value.subvention;
      },
      error: (err: any) =>
        this.snackbarService.show(
          err,
          $localize`Failed to read Subvention, it won't be applied`
        ),
    });
  }

  private getCart(): void {
    this.cartService.getCart$().subscribe({
      next: (value: Cart) => {
        this.cart = value;
      },
      error: (err: any) => {
        this.snackbarService.show(err, $localize`Failed to read Cart`);
      },
    });
  }

  purchase(): void {
    // Prepare order
    let order = new Order();
    order.OrderLines = new Array<OrderLine>();
    this.cart.Lines.forEach((line) => {
      order.OrderLines.push(
        new OrderLine(line.DishID, line.Name, line.CostUnit, line.Quantity)
      );
    });

    // Create order
    this.orderService.create$(order).subscribe({
      next: (value: Order) => {
        console.debug(value);
        // clear cart
        this.cartService.reset();
        // goto success
        this.router.navigate(['checkout', 'success']);
      },
      error: (err: any) => {
        this.snackbarService.show(err, $localize`Failed to create Order`);
        // goto failure
        this.router.navigate(['checkout', 'failure']);
      },
    });
  }
}
