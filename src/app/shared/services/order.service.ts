import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subvention } from '../models/subvention.dto';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { CountOrder, Order, PageOrders } from '../models/order.dto';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient) {}

  countToday$(): Observable<CountOrder[]> {
    const today = new Date().toISOString().slice(0, 10);
    return this.http.get<CountOrder[]>(
      `${environment.apiUrl}/orders/count?from=${today}&to=${today}`
    );
  }

  countYear$(): Observable<CountOrder[]> {
    const startYear = `${new Date().getFullYear()}-01-01`;
    const endYear = `${new Date().getFullYear()}-12-31`;

    return this.http.get<CountOrder[]>(
      `${environment.apiUrl}/orders/count?from=${startYear}&to=${endYear}`
    );
  }

  create$(order: Order): Observable<Order> {
    return this.http.post<Order>(`${environment.apiUrl}/order/`, order);
  }

  getSubvention$(): Observable<Subvention> {
    return this.http.get<Subvention>(`${environment.apiUrl}/order/subvention`);
  }

  listToday$(): Observable<PageOrders> {
    const today = new Date().toISOString().slice(0, 10);
    return this.http.get<PageOrders>(
      `${environment.apiUrl}/orders?day=${today}&limit=1000&page=1`
    );
  }

  search$(
    filter: string,
    pageSize: number,
    pageCount: number
  ): Observable<PageOrders> {
    return this.http.get<PageOrders>(
      `${environment.apiUrl}/orders?day=${filter}&limit=${pageSize}&page=${pageCount}`
    );
  }
}
