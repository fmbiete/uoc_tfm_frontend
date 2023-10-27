import { Injectable } from '@angular/core';
import { Cart, CartLine } from '../models/cart.dto';
import { Dish } from 'src/app/dishes/models/dish.dto';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cartSubject: BehaviorSubject<Cart>;

  constructor() {
    this.cartSubject = new BehaviorSubject<Cart>(new Cart());
  }

  getCart$(): Observable<Cart> {
    return this.cartSubject.asObservable();
  }

  addLine(dish: Dish): void {
    const cart = { ...this.cartSubject.value };

    const line = cart.Lines.find((v) => v.DishID == dish.ID);
    if (line === undefined) {
      cart.Lines.push(new CartLine(dish));
    } else {
      line.Quantity += 1;
    }

    this.publishCart(cart);
  }

  increaseQuantityLine(idx: number) {
    const cart = { ...this.cartSubject.value };
    cart.Lines[idx].Quantity += 1;
    this.publishCart(cart);
  }

  reduceQuantityLine(idx: number) {
    const cart = { ...this.cartSubject.value };
    if (cart.Lines[idx].Quantity == 1) {
      cart.Lines = cart.Lines.filter((_, i) => i != idx);
    } else {
      cart.Lines[idx].Quantity -= 1;
    }
    this.publishCart(cart);
  }

  removeLine(idx: number) {
    const cart = { ...this.cartSubject.value };
    cart.Lines = cart.Lines.filter((_, i) => i != idx);
    this.publishCart(cart);
  }

  reset() {
    const cart = { ...this.cartSubject.value };
    cart.Lines.length = 0;
    this.publishCart(cart);
  }

  publishCart(cart: Cart) {
    console.debug(cart);
    this.cartSubject.next(cart);
  }
}
