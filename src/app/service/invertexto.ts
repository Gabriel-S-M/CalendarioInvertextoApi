import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Invertexto {
  private apiKey = '21236|TRErfR4RNhrPIWnzbawPOkQPUu9ri47I';
  private baseUrl = 'https://api.invertexto.com/v1/holidays';

  constructor(private http: HttpClient) {}

  getFeriados(ano: number, estado?: string): Observable<any> {
    let url = `${this.baseUrl}/${ano}?token=${this.apiKey}`;
    if (estado) {
      url += `&state=${estado}`;
    }
    return this.http.get(url);
  }
}
