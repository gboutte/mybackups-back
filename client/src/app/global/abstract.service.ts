import { HttpClient, HttpHeaders } from '@angular/common/http';

export abstract class AbstractService {
  protected httpClient: HttpClient;
  protected readonly httpOptions = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }),
  };
  private api = '/api';

  constructor(httpClient: HttpClient) {
    this.httpClient = httpClient;
  }

  getUrl() {
    return this.api;
  }
}
