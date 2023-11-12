import { Injectable } from '@angular/core';
import { AuthChallenge, AuthResponse } from '../models/auth.dto';
import { environment } from 'src/environments/environment';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  constructor(private http: HttpClient) {}

  login$(auth: AuthChallenge): Observable<AuthResponse> {
    const body = new URLSearchParams();
    body.set('username', auth.username);
    body.set('password', auth.password);

    return this.http.post<AuthResponse>(
      `${environment.apiUrl}/user/login`,
      body,
      {
        headers: new HttpHeaders().set(
          'Content-Type',
          'application/x-www-form-urlencoded'
        ),
      }
    );
  }
}
