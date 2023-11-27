import { Injectable } from '@angular/core';
import { Configuration } from '../models/configuration.dto';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ConfigurationService {
  constructor(private http: HttpClient) {}

  get$(): Observable<Configuration> {
    return this.http.get<Configuration>(`${environment.apiUrl}/configuration/`);
  }

  update$(configuration: Configuration): Observable<Configuration> {
    return this.http.patch<Configuration>(
      `${environment.apiUrl}/configuration/`,
      configuration
    );
  }
}
