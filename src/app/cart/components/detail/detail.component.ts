import { AsyncPipe, CommonModule, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { Observable } from 'rxjs';
import { CartService } from 'src/app/shared/services/cart.service';
import { Cart } from 'src/app/shared/models/cart.dto';
import { LocalStorageService } from 'src/app/shared/services/local-storage.service';
import { LoginComponent } from 'src/app/users/components/login/login.component';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DialogService } from 'primeng/dynamicdialog';
import { DividerModule } from 'primeng/divider';
import { MessageModule } from 'primeng/message';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  standalone: true,
  imports: [
    AsyncPipe,
    CommonModule,
    RouterLink,
    ButtonModule,
    DialogModule,
    DividerModule,
    MessageModule,
    TooltipModule,
  ],
  providers: [DialogService],
})
export class DetailComponent implements OnInit {
  cart$!: Observable<Cart>;

  constructor(
    private router: Router,
    private cartService: CartService,
    private localStorage: LocalStorageService,
    private dialogService: DialogService
  ) {
    this.cart$ = this.cartService.getCart$();
  }

  ngOnInit(): void {
    return;
  }

  removeCartLine(idx: number): void {
    this.cartService.removeLine(idx);
  }

  increaseCartLine(idx: number): void {
    this.cartService.increaseQuantityLine(idx);
  }

  reduceCartLine(idx: number): void {
    this.cartService.reduceQuantityLine(idx);
  }

  goCheckout(): void {
    if (this.localStorage.isUserLogged()) {
      // if logged in
      this.router.navigate(['checkout', 'address']);
    } else {
      // if not logged in - request login
      const dialogRef = this.dialogService.open(LoginComponent, {
        header: $localize`Login to proceed`,
        // styleClass: 'tfm-dynamic-dialog-responsive-sm',
        contentStyle: { overflow: 'auto' },
        baseZIndex: 10000,
      });

      dialogRef.onClose.subscribe((result) => {
        console.debug(`Dialog result: ${result}`);
        if (this.localStorage.isUserLogged()) {
          // if logged in
          this.router.navigate(['checkout', 'address']);
        }
      });
    }
  }

  cleanCart(): void {
    this.cartService.reset();
    this.router.navigate(['']);
  }
}
