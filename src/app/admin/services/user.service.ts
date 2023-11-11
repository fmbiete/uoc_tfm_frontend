import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PageUsers, User } from 'src/app/users/models/user.dto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  delete$(userId: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/user/${userId}`);
  }

  list$(pageSize: number, pageCount: number): Observable<PageUsers> {
    return this.http.get<PageUsers>(
      `${environment.apiUrl}/users?limit=${pageSize}&page=${pageCount}`
    );
  }

  modify$(user: User): Observable<User> {
    return this.http.patch<User>(`${environment.apiUrl}/user/${user.ID}`, user);
  }
}
