import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Subvention } from '../models/subvention.dto';
import { environment } from 'src/environments/environment';
import { Observable } from 'rxjs';
import { Order } from '../models/order.dto';

@Injectable({
  providedIn: 'root',
})
export class OrderService {
  constructor(private http: HttpClient) {}

  create$(order: Order): Observable<Order> {
    return this.http.post<Order>(`${environment.apiUrl}/order/`, order);
  }
  getSubvention$(): Observable<Subvention> {
    return this.http.get<Subvention>(`${environment.apiUrl}/order/subvention`);
  }
}
