import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { DividerModule } from 'primeng/divider';
import { DialogService } from 'primeng/dynamicdialog';
import { CartService } from 'src/app/cart/services/cart.service';
import { LocalStorageService } from 'src/app/common/services/local-storage.service';

@Component({
  selector: 'checkout-form-actions',
  templateUrl: './form-actions.component.html',
  styleUrls: ['./form-actions.component.scss'],
  standalone: true,
  imports: [ButtonModule, DividerModule],
  providers: [DialogService],
})
export class FormActionsComponent {
  @Input('primary-label') primaryLabel!: string;
  @Input('primary-function') primaryFunction!: any;
  @Input('primary-disabled') primaryDisabled!: boolean;
  @Input('secondary-label') secondaryLabel!: string;
  @Input('secondary-function') secondaryFunction!: any;
  @Input('secondary-icon') secondaryIcon: any;

  constructor(
    private router: Router,
    private localStorage: LocalStorageService,
    private dialogService: DialogService,
    private cartService: CartService
  ) {
    this.secondaryIcon = 'arrow-left';
  }
}
