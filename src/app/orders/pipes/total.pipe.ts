import { Pipe, PipeTransform } from '@angular/core';
import { Order } from 'src/app/shared/models/order.dto';

@Pipe({
  name: 'total',
  standalone: true,
})
export class TotalPipe implements PipeTransform {
  transform(order: Order, subvention: number): number {
    let total = 0;
    order.OrderLines.forEach((line) => {
      total += line.Quantity * line.CostUnit;
    });
    total -= subvention;
    if (total < 0) total = 0;

    return total;
  }
}
