import { inject, Injectable } from '@angular/core';
import { BehaviorSubject, Observable, take } from 'rxjs';
import { AbstractService } from '../global/abstract.service';
import { ConfigStore } from './config.store';

@Injectable()
export class ConfigService extends AbstractService {
  private configStore: ConfigStore = inject(ConfigStore);

  public getConfig(): Observable<{ isInstalled: boolean }> {
    return this.httpClient.get<{ isInstalled: boolean }>(
      this.getUrl() + '/status',
      this.httpOptions,
    );
  }
  public refreshConfigStore(): Observable<null> {
    const observable: BehaviorSubject<null> = new BehaviorSubject<null>(null);
    observable.pipe(take(1));
    this.getConfig().subscribe((config: { isInstalled: boolean }) => {
      this.configStore.isInstalled = config.isInstalled;
      observable.next(null);
    });

    return observable;
  }
}
