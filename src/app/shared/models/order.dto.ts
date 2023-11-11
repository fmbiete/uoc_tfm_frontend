import { OrderLine } from './order-line.dto';

export class Order {
  UserID!: number;
  CostTotal!: number;
  CostToPay!: number;
  Delivery!: Date;
  OrderLines!: OrderLine[];
}
