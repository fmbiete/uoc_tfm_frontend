import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LocalStorageService } from './local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class HttpInterceptorService implements HttpInterceptor {
  constructor(private localStorage: LocalStorageService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    if (!req.url.endsWith('login')) {
      // json request
      const headers = req.headers
        .append('Content-Type', 'application/json; charset=UTF-8')
        .append('Accept', 'application/json');
      req = req.clone({ headers });
    }

    if (this.localStorage.isLoggedIn()) {
      // Add token key
      const headers = req.headers.append(
        'Authorization',
        `Bearer ${this.localStorage.getUserToken()}`
      );
      req = req.clone({ headers });
    }

    return next.handle(req);
  }
}
