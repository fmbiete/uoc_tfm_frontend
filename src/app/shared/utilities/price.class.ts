import { Dish } from '../models/dish.dto';

export class Price {
  static ActivePrice(dish: Dish): number {
    if (!dish.Promotions) return dish.Cost;
    const now = new Date().getTime();
    const activePromotion = dish.Promotions.filter(
      (p) =>
        now >= new Date(p.StartTime).getTime() &&
        now <= new Date(p.EndTime).getTime()
    );
    if (activePromotion.length == 0) return dish.Cost;
    return activePromotion[0].Cost;
  }
}
