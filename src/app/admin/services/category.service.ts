import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Category } from 'src/app/dishes/models/category.dto';
import { environment } from 'src/environments/environment';

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

  modify$(category: Category): Observable<Category> {
    return this.http.patch<Category>(
      `${environment.apiUrl}/category/${category.ID}`,
      category
    );
  }
}
