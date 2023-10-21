import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  static readonly key_id: string = 'user_id';
  static readonly key_email: string = 'user_email';
  static readonly key_token: string = 'user_token';

  set(key: string, value: string) {
    localStorage.setItem(key, value);
  }

  get(key: string): string | null {
    return localStorage.getItem(key);
  }

  remove(key: string) {
    localStorage.removeItem(key);
  }

  getUserId(): number {
    const value = this.get(LocalStorageService.key_id);
    if (value === null) {
      return -1;
    } else {
      return parseInt(value);
    }
  }

  getUserEmail(): string {
    return `${this.get(LocalStorageService.key_email)}`;
  }

  getUserToken(): string {
    return `${this.get(LocalStorageService.key_token)}`;
  }

  isLoggedIn(): boolean {
    return this.get(LocalStorageService.key_token) !== null;
  }

  resetLogin() {
    this.remove(LocalStorageService.key_id);
    this.remove(LocalStorageService.key_token);
    this.remove(LocalStorageService.key_email);
  }

  saveLogin(
    id: number | undefined,
    email: string | undefined,
    token: string | undefined,
    admin: boolean | undefined
  ) {
    if (
      id === undefined ||
      email === undefined ||
      token === undefined ||
      admin === undefined
    ) {
      this.resetLogin();
    } else {
      this.set(LocalStorageService.key_id, id.toString());
      this.set(LocalStorageService.key_email, email);
      this.set(LocalStorageService.key_token, token);
      this.set('user_admin', admin.toString());
    }
  }
}
