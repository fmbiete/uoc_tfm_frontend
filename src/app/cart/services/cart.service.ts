import { Injectable } from '@angular/core';
import { Cart, CartLine } from '../models/cart.dto';
import { Dish } from 'src/app/dishes/models/dish.dto';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private cart: Cart = new Cart();
  private cartCountSubject: ReplaySubject<number> = new ReplaySubject<number>(
    1
  );
  cartCount$ = this.cartCountSubject.asObservable();

  constructor() {
    this.publishCartCount();
  }

  addLine(dish: Dish): void {
    const line = this.findLine(dish.ID);
    if (line === undefined) {
      this.cart.Lines.push(new CartLine(dish));
    } else {
      line.Quantity += 1;
    }
    this.cart.Count += 1;
    this.publishCartCount();
  }

  increaseQuantityLine(line: CartLine) {
    line.Quantity += 1;
    this.cart.Count += 1;
    this.publishCartCount();
  }

  findLine(dishId: number): CartLine | undefined {
    return this.cart.Lines.find((v) => v.DishID == dishId);
  }

  removeLine(line: CartLine) {
    this.cart.Count -= line.Quantity;
    this.cart.Lines = this.cart.Lines.filter((v) => v.DishID != line.DishID);
    this.publishCartCount();
  }

  decreaseQuatityLine(line: CartLine) {
    if (line.Quantity == 1) {
      this.removeLine(line);
    } else {
      line.Quantity -= 1;
    }
    this.cart.Count -= 1;
    this.publishCartCount();
  }

  getCart(): Cart {
    return this.cart;
  }

  publishCartCount() {
    this.cartCountSubject.next(this.cart.Count);
  }
}
