export class OrderLine {
  ID!: number;
  OrderID!: number;
  DishID!: number;
  Name!: string;
  CostUnit!: number;
  Quantity!: number;

  constructor(
    dishId: number,
    name: string,
    costUnit: number,
    quantity: number
  ) {
    this.DishID = dishId;
    this.Name = name;
    this.CostUnit = costUnit;
    this.Quantity = quantity;
  }
}
