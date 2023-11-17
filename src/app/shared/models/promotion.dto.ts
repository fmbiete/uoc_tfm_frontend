import { Dish } from './dish.dto';

export class Promotion {
  ID!: number;
  DishID!: number;
  StartTime!: Date;
  EndTime!: Date;
  Cost!: number;
  Dish!: Dish;
}

export class CountPromotions {
  count!: number;
}

export class PagePromotions {
  promotions!: Promotion[];
  page!: number;
  limit!: number;
}
