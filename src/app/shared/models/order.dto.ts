import { OrderLine } from './order-line.dto';
import { User } from './user.dto';

export class Order {
  UserID!: number;
  User!: User;
  CostTotal!: number;
  CostToPay!: number;
  Delivery!: Date;
  OrderLines!: OrderLine[];
}

export class CountOrder {
  day!: string;
  count!: number;
}

export class PageOrders {
  orders!: Order[];
  page!: number;
  limit!: number;
}
