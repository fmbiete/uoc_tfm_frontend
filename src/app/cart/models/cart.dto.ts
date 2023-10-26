import { Dish } from 'src/app/dishes/models/dish.dto';

export class Cart {
  Lines: Array<CartLine>;
  Count: 0;

  constructor() {
    this.Lines = new Array<CartLine>();
    this.Count = 0;
  }
}

export class CartLine {
  DishID: number;
  Name: string;
  CostUnit: number;
  Quantity: number;

  constructor(dish: Dish) {
    this.DishID = dish.ID;
    this.Name = dish.Name;
    this.CostUnit = dish.Cost;
    this.Quantity = 1;
  }
}
