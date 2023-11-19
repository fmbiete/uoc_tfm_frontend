import { Allergen } from './allergen.dto';
import { Category } from './category.dto';
import { Ingredient } from './ingredient.dto';
import { Promotion } from './promotion.dto';

export class Dish {
  ID!: number;
  Name!: string;
  Description!: string;
  Categories!: Category[];
  Ingredients!: Ingredient[];
  Allergens!: Allergen[];
  Cost!: number;
  Promotions!: Promotion[];
  Likes!: number;
  Dislikes!: number;
}

export class CountDishes {
  count!: number;
}

export class PageDishes {
  dishes!: Dish[];
  page!: number;
  limit!: number;
}

export interface ISearchDish {
  filter: string;
  pageSize: number;
  pageCount: number;
}
