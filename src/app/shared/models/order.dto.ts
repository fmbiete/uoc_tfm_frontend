import { OrderLine } from './order-line.dto';
import { User } from './user.dto';

export class Order {
  UserID!: number;
  User!: User;
  CostTotal!: number;
  CostToPay!: number;
  Subvention!: number;
  Delivery!: Date;
  OrderLines!: OrderLine[];
  CreatedAt!: Date;
  ID!: number;
  Address1!: string;
  Address2!: string;
  Address3!: string;
  City!: string;
  PostalCode!: string;
  Phone!: string;
  PaymentMethod!: string;
  PaymentSecret!: string;
}

export class CountOrder {
  day!: string;
  count!: number;
}

export interface ModifiableOrder {
  modifiable: boolean;
}

export class PageOrders {
  orders!: Order[];
  page!: number;
  limit!: number;
}

export interface ISearchOrder {
  filter: string;
  pageCount: number;
  pageSize: number;
}
