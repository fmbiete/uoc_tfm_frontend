export interface AuthChallenge {
  username: string;
  password: string;
}

export interface AuthResponse {
  id: number;
  email: string;
  token: string;
  admin: boolean;
}
