import { Cart, CartLine } from 'src/app/shared/models/cart.dto';
import { CountPipe } from './count.pipe';
import { Dish } from 'src/app/shared/models/dish.dto';

describe('CountPipe', () => {
  let pipe: CountPipe;
  let cart: Cart;
  let line1: CartLine;
  let line2: CartLine;

  beforeAll(() => {
    cart = new Cart();
    line1 = new CartLine(new Dish());
    line1.Quantity = 1;
    line2 = new CartLine(new Dish());
    line2.Quantity = 3;
    cart.Lines = [line1, line2];
  });

  beforeEach(() => {
    pipe = new CountPipe();
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('count number of items', () => {
    const expected = line1.Quantity + line2.Quantity;
    const actual = pipe.transform(cart);

    expect(actual).toEqual(expected);
  });
});
