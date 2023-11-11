export class User {
  ID!: number;
  Email!: string;
  Password!: string;
  Name!: string;
  Surname!: string;
  Address1!: string;
  Address2!: string;
  Address3!: string;
  City!: string;
  PostalCode!: string;
  Phone!: string;
  IsAdmin!: boolean;
}

export class PageUsers {
  users!: User[];
  page!: number;
  limit!: number;
}
