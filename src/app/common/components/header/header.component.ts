import { Component, OnDestroy, OnInit } from '@angular/core';
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
import { LoginComponent } from '../login/login.component';
import { environment } from 'src/environments/environment';
import { SnackbarService } from '../../services/snackbar.service';
import { CartService } from 'src/app/cart/services/cart.service';
import { Observable } from 'rxjs';
import { Cart } from 'src/app/cart/models/cart.dto';
import { CountPipe as CountCartProductsPipe } from 'src/app/cart/pipes/count.pipe';
import { ToolbarModule } from 'primeng/toolbar';
import { ButtonModule } from 'primeng/button';
import { DialogModule } from 'primeng/dialog';
import { MenuModule } from 'primeng/menu';
import { DialogService, DynamicDialogRef } from 'primeng/dynamicdialog';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
  standalone: true,
  imports: [
    ToolbarModule,
    ButtonModule,
    DialogModule,
    MenuModule,
    NgIf,
    NgFor,
    RouterModule,
    RouterLink,
    RouterLinkActive,
    AsyncPipe,
    CountCartProductsPipe,
  ],
  providers: [DialogService],
})
export class HeaderComponent implements OnInit, OnDestroy {
  applicationTitle: string = environment.title;

  // Flags controlling menu visibility
  showAdminSection: boolean;
  showAuthSection: boolean;
  showNoAuthSection: boolean;

  // User menu
  userMenuItems: MenuItem[] | undefined;

  cart$: Observable<Cart>;
  dialogLoginRef: DynamicDialogRef | undefined;

  constructor(
    private snackbar: SnackbarService,
    private router: Router,
    private headerService: HeaderService,
    private localStorageService: LocalStorageService,
    private dialogService: DialogService,
    private cartService: CartService
  ) {
    this.showAdminSection = false;
    this.showAuthSection = false;
    this.showNoAuthSection = true;
    this.cart$ = this.cartService.getCart$();
  }

  ngOnInit(): void {
    this.defineUserMenu();

    this.headerService.headerManagement.subscribe((status: Header) => {
      if (status) {
        this.showAuthSection = status.showAuthSection;
        this.showNoAuthSection = status.showNoAuthSection;
        this.showAdminSection = status.showAdminSection;
      }
    });

    document.addEventListener('click', (clickEvent: MouseEvent) => {
      const btn = document.getElementById('tfm-cart-button');
      const box = document.getElementById('tfm-cart');
      if (!btn || !box) return;

      if (clickEvent?.target instanceof Node) {
        if (btn.contains(clickEvent?.target)) {
          if (box.style.display == 'none') {
            box.style.display = 'block';
          } else {
            box.style.display = 'none';
          }
        } else if (!box.contains(clickEvent?.target)) {
          box.style.display = 'none';
        }
      }
    });
  }

  ngOnDestroy(): void {
    if (this.dialogLoginRef) {
      this.dialogLoginRef.close();
    }
  }

  editCredentials(): void {
    this.router.navigateByUrl('/users/credentials');
  }

  defineUserMenu(): void {
    this.userMenuItems = [
      {
        label: $localize`Orders`,
        icon: 'pi pi-cog',
        command: () => this.showOrders(),
      },
      {
        label: $localize`Personal Information`,
        icon: 'pi pi-user-edit',
        command: () => this.editProfile(),
      },
      {
        label: $localize`Email and Password`,
        icon: 'pi pi-lock',
        command: () => this.editCredentials(),
      },
      {
        label: $localize`Logout`,
        icon: 'pi pi-sign-out',
        command: () => this.logout(),
      },
    ];
  }

  showOrders(): void {
    this.router.navigateByUrl('/orders');
  }

  editProfile(): void {
    this.router.navigateByUrl('/users/profile');
  }

  login(): void {
    this.dialogLoginRef = this.dialogService.open(LoginComponent, {
      header: $localize`User Access`,
      width: '70%',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
    });

    this.dialogLoginRef.onClose.subscribe((result: boolean | undefined) => {
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
