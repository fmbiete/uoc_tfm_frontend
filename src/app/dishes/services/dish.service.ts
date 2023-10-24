import { Injectable } from '@angular/core';
import { Dish, PageDishes } from '../models/dish.dto';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DishService {
  constructor(private http: HttpClient) {}

  detail(dishId: number): Observable<Dish> {
    return this.http.get<Dish>(`${environment.apiUrl}/dish/${dishId}`);
  }

  dislike(dishId: number): Observable<boolean> {
    return this.http.post<boolean>(
      `${environment.apiUrl}/dish/${dishId}/dislike`,
      null
    );
  }

  favourites(): Observable<PageDishes> {
    return this.http.get<PageDishes>(`${environment.apiUrl}/dishes`);
  }

  like(dishId: number): Observable<boolean> {
    return this.http.post<boolean>(
      `${environment.apiUrl}/dish/${dishId}/like`,
      null
    );
  }

  promotions(): Observable<PageDishes> {
    return this.http.get<PageDishes>(`${environment.apiUrl}/promotions`);
  }
}
