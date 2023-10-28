import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../models/cart.dto';
import { LocalStorageService } from 'src/app/common/services/local-storage.service';
import { LoginComponent } from 'src/app/common/components/login/login.component';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { DialogService } from 'primeng/dynamicdialog';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  standalone: true,
  imports: [AsyncPipe, NgIf, NgFor, ButtonModule, DialogModule],
  providers: [DialogService],
})
export class DetailComponent implements OnInit {
  cart$!: Observable<Cart>;

  constructor(
    private router: Router,
    private cartService: CartService,
    private localStorageService: LocalStorageService,
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

  checkout(): void {
    if (this.localStorageService.isLoggedIn()) {
      // if logged in
      this.router.navigateByUrl('/checkout/address');
    } else {
      // if not logged in - request login
      const dialogRef = this.dialogService.open(LoginComponent, {
        header: $localize`Login to proceed`,
      });

      dialogRef.onClose.subscribe((result) => {
        console.debug(`Dialog result: ${result}`);
      });
    }
  }

  cleanCart(): void {
    this.cartService.reset();
  }
}
