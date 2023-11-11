export class Ingredient {
  ID!: number;
  Name!: string;

  toString(): string {
    return this.Name;
  }
}
