import { Cart, CartLine } from 'src/app/shared/models/cart.dto';
import { Dish } from 'src/app/shared/models/dish.dto';
import { TotalPipe } from './total.pipe';

describe('TotalPipe', () => {
  let pipe: TotalPipe;
  let cart: Cart;
  let dish1: Dish;
  let dish2: Dish;
  let line1: CartLine;
  let line2: CartLine;

  beforeAll(() => {
    cart = new Cart();
    dish1 = new Dish();
    dish1.Cost = 3.5;
    dish2 = new Dish();
    dish2.Cost = 12.5;
    line1 = new CartLine(dish1);
    line1.Quantity = 1;
    line2 = new CartLine(dish2);
    line2.Quantity = 3;
    cart.Lines = [line1, line2];
  });

  beforeEach(() => {
    pipe = new TotalPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('expect total to be 0 if subvention is greater', () => {
    const subvention = 100;
    const actual = pipe.transform(cart, subvention);
    expect(actual).toEqual(0);
  });

  it('expect total to be calculated', () => {
    const subvention = 7.5;
    const expected =
      line1.CostUnit * line1.Quantity +
      line2.CostUnit * line2.Quantity -
      subvention;
    const actual = pipe.transform(cart, subvention);

    expect(actual).toEqual(expected);
  });
});
