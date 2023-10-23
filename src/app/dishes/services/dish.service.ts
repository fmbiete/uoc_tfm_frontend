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

  favourites(): Observable<PageDishes> {
    return this.http.get<PageDishes>(`${environment.apiUrl}/dishes`);
  }

  promotions(): Observable<PageDishes> {
    return this.http.get<PageDishes>(`${environment.apiUrl}/promotions`);
  }
}
