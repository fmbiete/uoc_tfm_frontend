export interface AuthChallenge {
  username: string;
  password: string;
}

export class AuthResponse {
  id: number;
  email: string;
  token: string;
  admin: boolean;

  constructor() {
    this.id = -1;
    this.admin = false;
    this.email = '';
    this.token = '';
  }
}
