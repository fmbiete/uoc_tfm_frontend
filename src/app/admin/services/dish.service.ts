import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Dish, PageDishes } from 'src/app/dishes/models/dish.dto';
import { environment } from 'src/environments/environment';

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

  list$(pageSize: number, pageCount: number): Observable<PageDishes> {
    return this.http.get<PageDishes>(
      `${environment.apiUrl}/dishes?limit=${pageSize}&page=${pageCount}`
    );
  }

  modify$(dish: Dish): Observable<Dish> {
    return this.http.patch<Dish>(`${environment.apiUrl}/dish/${dish.ID}`, dish);
  }
}
