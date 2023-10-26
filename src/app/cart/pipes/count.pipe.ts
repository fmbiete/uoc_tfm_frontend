import { Pipe, PipeTransform } from '@angular/core';
import { Cart } from '../models/cart.dto';

@Pipe({
  name: 'countCartProducts',
  standalone: true,
  pure: false,
})
export class CountPipe implements PipeTransform {
  transform(cart: Cart): number {
    let count = 0;
    cart.Lines.forEach((line) => {
      count += line.Quantity;
    });

    return count;
  }
}
