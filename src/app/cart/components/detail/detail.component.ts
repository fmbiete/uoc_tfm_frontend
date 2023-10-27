import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, share } from 'rxjs';
import { CartService } from '../../services/cart.service';
import { Cart } from '../../models/cart.dto';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { SnackbarService } from 'src/app/common/services/snackbar.service';
import { LocalStorageService } from 'src/app/common/services/local-storage.service';
import { MatDialog } from '@angular/material/dialog';
import { LoginComponent } from 'src/app/common/components/login/login.component';

@Component({
  selector: 'app-detail',
  templateUrl: './detail.component.html',
  styleUrls: ['./detail.component.scss'],
  standalone: true,
  imports: [AsyncPipe, NgIf, NgFor, MatButtonModule, MatIconModule],
})
export class DetailComponent implements OnInit {
  cart$!: Observable<Cart>;

  constructor(
    private router: Router,
    private cartService: CartService,
    private snackbar: SnackbarService,
    private localStorageService: LocalStorageService,
    private dialog: MatDialog
  ) {
    this.cart$ = this.cartService.getCart$();
  }

  ngOnInit(): void {}

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
      const dialogRef = this.dialog.open(LoginComponent, {
        hasBackdrop: true,
      });

      dialogRef.afterClosed().subscribe((result) => {
        console.debug(`Dialog result: ${result}`);
      });
    }
  }

  cleanCart(): void {
    this.cartService.reset();
  }
}
