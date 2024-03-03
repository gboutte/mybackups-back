import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfigStore {
  private _isInstalled: BehaviorSubject<boolean | null> = new BehaviorSubject<
    boolean | null
  >(null);

  get isInstalled(): boolean | null {
    return this._isInstalled.getValue();
  }

  set isInstalled(val: boolean) {
    this._isInstalled.next(val);
  }

  get isInstalled$() {
    return this._isInstalled.asObservable();
  }
}
