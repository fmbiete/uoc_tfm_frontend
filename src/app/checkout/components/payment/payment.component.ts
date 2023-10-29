import { Component } from '@angular/core';
import { AsyncPipe, CommonModule, CurrencyPipe } from '@angular/common';
import { Observable } from 'rxjs';
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
export class PaymentComponent {
  cart$: Observable<Cart>;
  subvention: number;

  ccName!: string;
  ccNumber!: string;
  ccExpiration!: string;
  ccCcv!: string;

  constructor(
    private router: Router,
    private cartService: CartService,
    private localStorage: LocalStorageService
  ) {
    this.cart$ = this.cartService.getCart$();
    // TODO: get subvention
    this.subvention = 0;
  }

  goCart(): void {
    this.router.navigate(['cart']);
  }

  async purchase(): Promise<void> {
    // TODO: create order
    // TODO: clear cart
    // TODO: goto error
    this.router.navigate(['checkout', 'success']);
  }
}
