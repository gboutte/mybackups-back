import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ConfigStore {
  private _isInstalled: BehaviorSubject<boolean | null> = new BehaviorSubject<
    boolean | null
  >(null);

  public get isInstalled(): boolean | null {
    return this._isInstalled.getValue();
  }

  public set isInstalled(val: boolean) {
    this._isInstalled.next(val);
  }

  public get isInstalled$(): Observable<boolean | null> {
    return this._isInstalled.asObservable();
  }
}
