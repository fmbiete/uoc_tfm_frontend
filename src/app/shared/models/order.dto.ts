import { OrderLine } from './order-line.dto';

export class Order {
  UserID!: number;
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
