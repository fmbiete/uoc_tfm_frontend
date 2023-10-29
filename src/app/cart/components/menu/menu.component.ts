import { Component, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { Cart } from '../../models/cart.dto';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AsyncPipe, NgFor, NgIf } from '@angular/common';
import { CountPipe as CountCartProductsPipe } from 'src/app/cart/pipes/count.pipe';

@Component({
  selector: 'cart-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [NgIf, NgFor, ButtonModule, AsyncPipe, CountCartProductsPipe],
})
export class MenuComponent implements OnInit {
  cart$: Observable<Cart>;

  constructor(private router: Router, private cartService: CartService) {
    this.cart$ = this.cartService.getCart$();
  }

  ngOnInit(): void {
    document.addEventListener('click', (clickEvent: MouseEvent) => {
      const btn = document.getElementById('tfm-cart-button');
      const box = document.getElementById('tfm-cart');
      if (!btn || !box) return;

      if (clickEvent?.target instanceof Node) {
        if (btn.contains(clickEvent?.target)) {
          this.togglePanel(box);
        } else if (!box.contains(clickEvent?.target)) {
          this.hidePanel(box);
        }
      }
    });
  }

  detailCart(): void {
    this.hidePanel(null);

    this.router.navigate(['cart']);
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

  hidePanel(box: HTMLElement | null) {
    if (box === null) box = document.getElementById('tfm-cart');
    if (box) box.style.display = 'none';
  }

  togglePanel(box: HTMLElement | null) {
    if (box === null) box = document.getElementById('tfm-cart');

    if (box) {
      if (box.style.display == 'none') {
        box.style.display = 'block';
      } else {
        box.style.display = 'none';
      }
    }
  }
}
