import { Pipe, PipeTransform } from '@angular/core';
import { Dish } from 'src/app/shared/models/dish.dto';
import { Price } from 'src/app/shared/utilities/price.class';

@Pipe({
  name: 'currentPrice',
  standalone: true,
})
export class CurrentPricePipe implements PipeTransform {
  transform(dish: Dish): number {
    return Price.ActivePrice(dish);
  }
}
