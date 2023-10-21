import { Injectable } from '@angular/core';
import { Dish } from '../models/dish.dto';
import { HttpClient } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { lastValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class DishService {
  constructor(private http: HttpClient) {}

  favourites(): Promise<Dish[] | undefined> {
    return lastValueFrom(this.http.get<Dish[]>(`${environment.apiUrl}/dishes`));
  }

  promotions(): Promise<Dish[] | undefined> {
    return lastValueFrom(
      this.http.get<Dish[]>(`${environment.apiUrl}/promotions`)
    );
  }
}
