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
  Likes!: number;
  Dislikes!: number;

  public calculateRating(): Array<string> {
    let rating = new Array<string>(5).fill('');

    const totalReviews = this.Likes + this.Dislikes;
    // pct over 1.0
    const pctLiked = this.Likes / totalReviews;
    const valueRating = Math.ceil(pctLiked * 5.0);

    for (let i = 0; i < valueRating; i++) {
      rating[i] = 'accent';
    }

    return rating;
  }
}

export class PageDishes {
  dishes!: Dish[];
  page!: number;
  limit!: number;
}
