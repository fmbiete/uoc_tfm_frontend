import { Injectable } from '@angular/core';
import { User } from '../models/user.dto';
import { firstValueFrom } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpClient) {}

  create(user: User): Promise<User | undefined> {
    return firstValueFrom(
      this.http.post<User>(`${environment.apiUrl}/user/`, user)
    );
  }

  get(userId: number): Promise<User | undefined> {
    return firstValueFrom(
      this.http.get<User>(`${environment.apiUrl}/user/${userId}`)
    );
  }

  update(user: User): Promise<User | undefined> {
    return firstValueFrom(
      this.http.patch<User>(`${environment.apiUrl}/user/${user.ID}`, user)
    );
  }
}
