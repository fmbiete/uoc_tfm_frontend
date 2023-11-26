import { Dish } from 'src/app/shared/models/dish.dto';
import { Promotion } from 'src/app/shared/models/promotion.dto';
import { CurrentPricePipe } from './current-price.pipe';

describe('CurrentPricePipe', () => {
  let pipe: CurrentPricePipe;
  let dish: Dish;
  let promotion: Promotion;

  beforeAll(() => {
    pipe = new CurrentPricePipe();
    dish = new Dish();
    dish.Cost = 12.5;
  });

  beforeEach(() => {
    promotion = new Promotion();
    promotion.Cost = 7.5;
    promotion.StartTime = new Date();
    promotion.StartTime.setTime(new Date().getTime() - 5 * 24 * 60 * 60 * 1000);
    promotion.EndTime = new Date();
    promotion.EndTime.setTime(new Date().getTime() + 5 * 24 * 60 * 60 * 1000);
    dish.Promotions = [promotion];
  });

  it('create an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('return promotion when valid', () => {
    const expected = promotion.Cost;
    const actual = pipe.transform(dish);

    expect(actual).toEqual(expected);
  });

  it('return dish cost when promotion invalid', () => {
    promotion.EndTime.setTime(new Date().getTime() - 2 * 24 * 60 * 60 * 1000);
    dish.Promotions = [promotion];
    const expected = dish.Cost;
    const actual = pipe.transform(dish);

    expect(actual).toEqual(expected);
  });

  it('return dish cost when no promotion - empty', () => {
    dish.Promotions = new Array<Promotion>();
    const expected = dish.Cost;
    const actual = pipe.transform(dish);

    expect(actual).toEqual(expected);
  });
});
