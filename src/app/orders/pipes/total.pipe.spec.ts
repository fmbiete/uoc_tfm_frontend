import { OrderLine } from 'src/app/shared/models/order-line.dto';
import { TotalPipe } from './total.pipe';
import { Order } from 'src/app/shared/models/order.dto';

describe('TotalPipe', () => {
  let pipe: TotalPipe;

  beforeEach(() => {
    pipe = new TotalPipe();
  });

  it('creates an instance', () => {
    expect(pipe).toBeTruthy();
  });

  it('calculates total', () => {
    const subvention = 3;
    const order = new Order();
    order.OrderLines = [
      new OrderLine(1, '', 2.3, 2),
      new OrderLine(2, '', 4.5, 1),
    ];

    const expected = 2.3 * 2 + 4.5 * 1 - subvention;
    const actual = pipe.transform(order, subvention);

    expect(actual).toEqual(expected);
  });
});
