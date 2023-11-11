import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Allergen } from '../models/allergen.dto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class AllergenService {
  constructor(private http: HttpClient) {}

  create$(allergen: Allergen): Observable<Allergen> {
    return this.http.post<Allergen>(
      `${environment.apiUrl}/allergen/`,
      allergen
    );
  }

  delete$(allergenId: number): Observable<void> {
    return this.http.delete<void>(
      `${environment.apiUrl}/allergen/${allergenId}`
    );
  }

  list$(): Observable<Allergen[]> {
    return this.http.get<Allergen[]>(`${environment.apiUrl}/allergens`);
  }

  modify$(allergen: Allergen): Observable<Allergen> {
    return this.http.patch<Allergen>(
      `${environment.apiUrl}/allergen/${allergen.ID}`,
      allergen
    );
  }
}
