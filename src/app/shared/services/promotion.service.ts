import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PagePromotions, Promotion } from '../models/promotion.dto';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PromotionService {
  constructor(private http: HttpClient) {}

  create$(promotion: Promotion): Observable<Promotion> {
    return this.http.post<Promotion>(
      `${environment.apiUrl}/promotion/`,
      promotion
    );
  }

  delete$(promotionId: number): Observable<void> {
    return this.http.delete<void>(
      `${environment.apiUrl}/promotion/${promotionId}`
    );
  }

  list$(
    activeOnly: boolean,
    pageSize: number,
    pageCount: number
  ): Observable<PagePromotions> {
    return this.http.get<PagePromotions>(
      `${environment.apiUrl}/promotions?limit=${pageSize}&page=${pageCount}&activeOnly=${activeOnly}`
    );
  }

  modify$(promotion: Promotion): Observable<Promotion> {
    return this.http.patch<Promotion>(
      `${environment.apiUrl}/promotion/${promotion.ID}`,
      promotion
    );
  }
}
