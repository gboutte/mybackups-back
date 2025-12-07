import { isPlatformBrowser } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, PLATFORM_ID } from '@angular/core';
import { environment } from '../../environments/environment';

export abstract class AbstractService {
  protected httpClient: HttpClient = inject(HttpClient);
  protected readonly httpOptions: { headers: HttpHeaders } = {
    headers: new HttpHeaders({
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
    }),
  };
  private api: string = '/api';
  private platformId: object = inject(PLATFORM_ID);
  private isBrowser: boolean = isPlatformBrowser(this.platformId);

  protected getUrl(): string {
    if (this.isBrowser) {
      return this.api;
    } else {
      return environment.api + this.api;
    }
  }
}
