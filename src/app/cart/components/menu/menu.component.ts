import { Component, OnDestroy, OnInit, Renderer2 } from '@angular/core';
import { Observable } from 'rxjs';
import { Cart } from 'src/app/shared/models/cart.dto';
import { CartService } from 'src/app/shared/services/cart.service';
import { Router } from '@angular/router';
import { ButtonModule } from 'primeng/button';
import { AsyncPipe, CommonModule } from '@angular/common';
import { CountPipe as CountCartProductsPipe } from '../../pipes/count.pipe';
import { TooltipModule } from 'primeng/tooltip';

@Component({
  selector: 'cart-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  standalone: true,
  imports: [
    AsyncPipe,
    CommonModule,
    ButtonModule,
    TooltipModule,
    CountCartProductsPipe,
  ],
})
export class MenuComponent implements OnInit, OnDestroy {
  cart$: Observable<Cart>;

  private removeListener!: () => void;

  constructor(
    private renderer: Renderer2,
    private router: Router,
    private cartService: CartService
  ) {
    this.cart$ = this.cartService.getCart$();
  }

  ngOnDestroy(): void {
    this.removeListener();
  }

  ngOnInit(): void {
    this.removeListener = this.renderer.listen(
      'document',
      'click',
      (clickEvent: MouseEvent) => {
        const btn = document.getElementById('tfm-cart-button');
        const box = document.getElementById('tfm-cart');
        if (!btn || !box) {
          return;
        }

        if (clickEvent?.target instanceof Node) {
          if (btn.contains(clickEvent?.target)) {
            this._togglePanel(box);
          } else if (!box.contains(clickEvent?.target)) {
            this._hidePanel(box);
          }
        }
      }
    );
  }

  detailCart(): void {
    this._hidePanel(null);

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

  private _hidePanel(box: HTMLElement | null) {
    if (box === null) box = document.getElementById('tfm-cart');
    if (box && box.style.display != 'none') box.style.display = 'none';
  }

  private _togglePanel(box: HTMLElement | null) {
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
