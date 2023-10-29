import { Pipe, PipeTransform } from '@angular/core';
import { Cart } from '../models/cart.dto';

@Pipe({
  name: 'total',
  standalone: true,
})
export class TotalPipe implements PipeTransform {
  transform(cart: Cart, subvention: number): number {
    let total = 0;
    cart.Lines.forEach((line) => {
      total += line.Quantity * line.CostUnit;
    });
    total -= subvention;
    if (total < 0) total = 0;

    return total;
  }
}
