import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  static readonly key_id: string = 'user_id';
  static readonly key_email: string = 'user_email';
  static readonly key_token: string = 'user_token';

  private authenticatedSubject: BehaviorSubject<boolean>;

  constructor() {
    this.authenticatedSubject = new BehaviorSubject<boolean>(false);
  }

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

  // For components
  isLoggedIn$(): Observable<boolean> {
    return this.authenticatedSubject.asObservable();
  }

  // For 1-off checks
  isLoggedIn(): boolean {
    const loggedIn = this.get(LocalStorageService.key_token) !== null;
    // refresh observable value
    this.authenticatedSubject.next(loggedIn);
    return loggedIn;
  }

  resetLogin() {
    this.remove(LocalStorageService.key_id);
    this.remove(LocalStorageService.key_token);
    this.remove(LocalStorageService.key_email);
    this.authenticatedSubject.next(false);
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
      this.authenticatedSubject.next(true);
    }
  }
}
