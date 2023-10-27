import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatBadgeModule } from '@angular/material/badge';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterModule,
} from '@angular/router';
import { HeaderService } from '../../services/header.service';
import { LocalStorageService } from '../../services/local-storage.service';
import { Header } from '../../models/header.dto';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { LoginComponent } from '../login/login.component';
import { environment } from 'src/environments/environment';
import { SnackbarService } from '../../services/snackbar.service';
import { CartService } from 'src/app/cart/services/cart.service';
import { Observable } from 'rxjs';
import { Cart } from 'src/app/cart/models/cart.dto';
import { CountPipe as CountCartProductsPipe } from 'src/app/cart/pipes/count.pipe';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    MatToolbarModule,
    MatTooltipModule,
    MatButtonModule,
    MatDialogModule,
    MatIconModule,
    MatMenuModule,
    MatBadgeModule,
    NgIf,
    NgFor,
    RouterModule,
    RouterLink,
    RouterLinkActive,
    AsyncPipe,
    CountCartProductsPipe,
  ],
})
export class HeaderComponent implements OnInit {
  applicationTitle: string = environment.title;
  showAdminSection: boolean;
  showAuthSection: boolean;
  showNoAuthSection: boolean;

  cart$: Observable<Cart>;

  constructor(
    private snackbar: SnackbarService,
    private router: Router,
    private headerService: HeaderService,
    private localStorageService: LocalStorageService,
    private dialog: MatDialog,
    private cartService: CartService
  ) {
    this.showAdminSection = false;
    this.showAuthSection = false;
    this.showNoAuthSection = true;
    this.cart$ = this.cartService.getCart$();
  }

  ngOnInit(): void {
    this.headerService.headerManagement.subscribe((status: Header) => {
      if (status) {
        this.showAuthSection = status.showAuthSection;
        this.showNoAuthSection = status.showNoAuthSection;
        this.showAdminSection = status.showAdminSection;
      }
    });
  }

  changePassword(): void {
    this.router.navigateByUrl('/users/credentials');
  }

  orders(): void {
    this.router.navigateByUrl('/orders');
  }

  profile(): void {
    this.router.navigateByUrl('/users/profile');
  }

  login(): void {
    const dialogRef = this.dialog.open(LoginComponent, {
      hasBackdrop: true,
    });

    dialogRef.afterClosed().subscribe((result) => {
      console.debug(`Dialog result: ${result}`);
    });
  }

  logout(): void {
    this.localStorageService.resetLogin();
    this.headerService.showUnauthenticated();
    this.router.navigateByUrl('/');
    this.snackbar.show(null, $localize`See you soon!`);
  }

  detailCart(): void {
    this.router.navigateByUrl('/cart');
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
}
