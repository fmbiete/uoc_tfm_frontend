export class Category {
  ID!: number;
  Name!: string;

  toString(): string {
    return this.Name;
  }
}
