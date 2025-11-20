import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject } from '@angular/core';

export abstract class AbstractService {
  protected httpClient: HttpClient = inject(HttpClient);
  protected readonly httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }),
  };
  private api: string = '/api';

  protected getUrl(): string {
    return this.api;
  }
}
