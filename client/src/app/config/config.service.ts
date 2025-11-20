import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { AbstractService } from '../global/abstract.service';
import { ConfigStore } from './config.store';

@Injectable()
export class ConfigService extends AbstractService {
  private configStore: ConfigStore = inject(ConfigStore);

  getConfig(): Observable<{ isInstalled: boolean }> {
    return this.httpClient.get<{ isInstalled: boolean }>(
      this.getUrl() + '/status',
      this.httpOptions,
    );
  }
  refreshConfigStore() {
    const observable = new BehaviorSubject(null);
    observable.pipe(take(1));
    this.getConfig().subscribe((config) => {
      this.configStore.isInstalled = config.isInstalled;
      observable.next(null);
    });

    return observable;
  }
}
