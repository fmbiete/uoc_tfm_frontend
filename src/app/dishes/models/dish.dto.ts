import { Allergen } from './allergen.dto';
import { Ingredient } from './ingredient.dto';
import { Promotion } from './promotion.dto';

export class Dish {
  ID!: number;
  Name!: string;
  Description!: string;
  Ingredients!: Ingredient[];
  Allergens!: Allergen[];
  Cost!: number;
  Promotions!: Promotion[];
}

export class PageDishes {
  dishes!: Dish[];
  page!: number;
  limit!: number;
}
