export class Allergen {
  ID!: number;
  Name!: string;

  toString(): string {
    return this.Name;
  }
}
