import { Injectable } from '@angular/core';
import { AbstractService } from '../global/abstract.service';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable()
export class ConfigService extends AbstractService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  getConfig(): Observable<{ isInstalled: boolean }> {
    return this.httpClient.get<{ isInstalled: boolean }>(
      this.getUrl() + '/status',
      this.httpOptions,
    );
  }
}
