import { Injectable } from '@angular/core';
import { CountUsers, PageUsers, User } from '../models/user.dto';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  count$(includeAdmin: boolean): Observable<CountUsers> {
    return this.http.get<CountUsers>(
      `${environment.apiUrl}/users/count?includeAdmin=${includeAdmin}`
    );
  }

  create$(user: User): Observable<User> {
    return this.http.post<User>(`${environment.apiUrl}/user/`, user);
  }

  get$(userId: number): Observable<User> {
    return this.http.get<User>(`${environment.apiUrl}/user/${userId}`);
  }

  delete$(userId: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/user/${userId}`);
  }

  search$(
    searchTerm: string,
    pageSize: number,
    pageCount: number
  ): Observable<PageUsers> {
    return this.http.get<PageUsers>(
      `${environment.apiUrl}/users?limit=${pageSize}&page=${pageCount}&searchTerm=${searchTerm}`
    );
  }

  modify$(user: User): Observable<User> {
    return this.http.patch<User>(`${environment.apiUrl}/user/${user.ID}`, user);
  }
}
