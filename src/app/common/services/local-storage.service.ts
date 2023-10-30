import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthResponse } from '../models/auth.dto';

@Injectable({
  providedIn: 'root',
})
export class LocalStorageService {
  static readonly key_id: string = 'user_id';
  static readonly key_email: string = 'user_email';
  static readonly key_token: string = 'user_token';
  static readonly key_admin: string = 'user_admin';

  private authenticatedSubject: BehaviorSubject<AuthResponse>;

  constructor() {
    this.authenticatedSubject = new BehaviorSubject<AuthResponse>(
      new AuthResponse()
    );
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

  getUserIsAdmin(): boolean {
    const value = this.get(LocalStorageService.key_admin);
    if (value === null) {
      return false;
    } else {
      return value == 'true';
    }
  }

  getUserToken(): string {
    return `${this.get(LocalStorageService.key_token)}`;
  }

  // For components
  authenticationResponse$(): Observable<AuthResponse> {
    return this.authenticatedSubject.asObservable();
  }

  // For 1-off checks
  isLoggedIn(): boolean {
    const authResponse = this._getAuthResponseFromStorage();
    // refresh observable value
    this.authenticatedSubject.next(authResponse);
    return authResponse.id > 0;
  }

  resetLogin() {
    this.remove(LocalStorageService.key_id);
    this.remove(LocalStorageService.key_token);
    this.remove(LocalStorageService.key_email);
    this.authenticatedSubject.next(new AuthResponse());
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
      this.set(LocalStorageService.key_admin, admin.toString());

      this.authenticatedSubject.next(this._getAuthResponseFromStorage());
    }
  }

  _getAuthResponseFromStorage(): AuthResponse {
    const authResponse = new AuthResponse();
    authResponse.id = this.getUserId();
    authResponse.email = this.getUserEmail();
    authResponse.admin = this.getUserIsAdmin();
    authResponse.token = '';
    return authResponse;
  }
}
