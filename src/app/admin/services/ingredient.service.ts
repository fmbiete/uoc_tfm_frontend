import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Ingredient } from 'src/app/dishes/models/ingredient.dto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class IngredientService {
  constructor(private http: HttpClient) {}

  create$(ingredient: Ingredient): Observable<Ingredient> {
    return this.http.post<Ingredient>(
      `${environment.apiUrl}/ingredient/`,
      ingredient
    );
  }

  delete$(ingredientId: number): Observable<void> {
    return this.http.delete<void>(
      `${environment.apiUrl}/ingredient/${ingredientId}`
    );
  }

  list$(): Observable<Ingredient[]> {
    return this.http.get<Ingredient[]>(`${environment.apiUrl}/ingredients`);
  }

  modify$(ingredient: Ingredient): Observable<Ingredient> {
    return this.http.patch<Ingredient>(
      `${environment.apiUrl}/ingredient/${ingredient.ID}`,
      ingredient
    );
  }
}
