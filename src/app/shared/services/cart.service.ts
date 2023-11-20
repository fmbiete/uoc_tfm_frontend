import { Injectable } from '@angular/core';
import { Cart, CartLine } from '../models/cart.dto';
import { Dish } from '../models/dish.dto';
import { BehaviorSubject, Observable } from 'rxjs';
import { Price } from '../utilities/price.class';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  static readonly key_cart = 'cart';

  private cartSubject: BehaviorSubject<Cart>;

  constructor() {
    let cart = new Cart();
    const value = localStorage.getItem(CartService.key_cart);
    if (value != null) {
      try {
        cart = JSON.parse(value);
      } catch (error) {
        console.error(error);
        console.error(
          `Failed to deserialize cart from localStorage, discarding content`
        );
      }
    }
    this.cartSubject = new BehaviorSubject<Cart>(cart);
  }

  getCart$(): Observable<Cart> {
    return this.cartSubject.asObservable();
  }

  addLine(dish: Dish): void {
    const cart = { ...this.cartSubject.value };

    const line = cart.Lines.find((v) => v.DishID == dish.ID);
    if (line === undefined) {
      dish.Cost = Price.ActivePrice(dish);
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
    // Save cart to localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
    this.cartSubject.next(cart);
  }
}
