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

  create$(dish: Dish): Observable<Dish> {
    return this.http.post<Dish>(`${environment.apiUrl}/dish/`, dish);
  }

  delete$(dishId: number): Observable<void> {
    return this.http.delete<void>(`${environment.apiUrl}/dish/${dishId}`);
  }

  dislike$(dishId: number): Observable<boolean> {
    return this.http.post<boolean>(
      `${environment.apiUrl}/dish/${dishId}/dislike`,
      null
    );
  }

  favourites$(): Observable<PageDishes> {
    return this.http.get<PageDishes>(`${environment.apiUrl}/dish/favourites`);
  }

  get$(dishId: number): Observable<Dish> {
    return this.http.get<Dish>(`${environment.apiUrl}/dish/${dishId}`);
  }

  like$(dishId: number): Observable<boolean> {
    return this.http.post<boolean>(
      `${environment.apiUrl}/dish/${dishId}/like`,
      null
    );
  }

  list$(pageSize: number, pageCount: number): Observable<PageDishes> {
    return this.http.get<PageDishes>(
      `${environment.apiUrl}/dishes?limit=${pageSize}&page=${pageCount}`
    );
  }

  modify$(dish: Dish): Observable<Dish> {
    return this.http.patch<Dish>(`${environment.apiUrl}/dish/${dish.ID}`, dish);
  }

  promotions$(): Observable<PageDishes> {
    return this.http.get<PageDishes>(`${environment.apiUrl}/promotions`);
  }

  search$(
    filter: string,
    pageSize: number,
    pageCount: number
  ): Observable<PageDishes> {
    return this.http.get<PageDishes>(
      `${environment.apiUrl}/dishes?limit=${pageSize}&page=${pageCount}&searchTerm=${filter}`
    );
  }
}
