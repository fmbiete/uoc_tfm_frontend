import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { PageDishes } from '../models/dish.dto';
import { Category } from '../models/category.dto';

@Injectable({
  providedIn: 'root',
})
export class CategoryService {
  constructor(private http: HttpClient) {}

  create$(category: Category): Observable<Category> {
    return this.http.post<Category>(
      `${environment.apiUrl}/category/`,
      category
    );
  }

  delete$(categoryId: number): Observable<void> {
    return this.http.delete<void>(
      `${environment.apiUrl}/category/${categoryId}`
    );
  }

  list$(): Observable<Category[]> {
    return this.http.get<Category[]>(`${environment.apiUrl}/categories`);
  }

  listDishes$(
    categoryId: number,
    pageSize: number,
    pageCount: number
  ): Observable<PageDishes> {
    return this.http.get<PageDishes>(
      `${environment.apiUrl}/category/${categoryId}/dishes?limit=${pageSize}&page=${pageCount}`
    );
  }

  modify$(category: Category): Observable<Category> {
    return this.http.patch<Category>(
      `${environment.apiUrl}/category/${category.ID}`,
      category
    );
  }
}
