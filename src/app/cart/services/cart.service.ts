import { Injectable } from '@angular/core';
import { Cart, CartLine } from '../models/cart.dto';
import { Dish } from 'src/app/dishes/models/dish.dto';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: Cart;
  private cartSubject: Subject<Cart>;

  constructor() {
    this.cart = new Cart();
    this.cartSubject = new Subject<Cart>();
    this.publishCart();
  }

  getCart$(): Observable<Cart> {
    return this.cartSubject.asObservable();
  }

  addLine(dish: Dish): void {
    const line = this.findLine(dish.ID);
    if (line === undefined) {
      this.cart.Lines.push(new CartLine(dish));
    } else {
      line.Quantity += 1;
    }
    this.publishCart();
  }

  increaseQuantityLine(idx: number) {
    this.cart.Lines[idx].Quantity += 1;
    this.publishCart();
  }

  findLine(dishId: number): CartLine | undefined {
    return this.cart.Lines.find((v) => v.DishID == dishId);
  }

  reduceQuantityLine(idx: number) {
    if (this.cart.Lines[idx].Quantity == 1) {
      this.removeLine(idx);
    } else {
      this.cart.Lines[idx].Quantity -= 1;
      this.publishCart();
    }
  }

  removeLine(idx: number) {
    this.cart.Lines = this.cart.Lines.filter((_, i) => i != idx);
    this.publishCart();
  }

  // decreaseQuatityLine(line: CartLine) {
  //   if (line.Quantity == 1) {
  //     this.removeLine(line);
  //   } else {
  //     line.Quantity -= 1;
  //   }
  //   this.cart.Count -= 1;
  // }

  publishCart() {
    console.debug(this.cart);
    this.cartSubject.next(this.cart);
  }
}
