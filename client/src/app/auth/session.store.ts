import { Injectable } from '@angular/core';
import { User } from '../dashboard/users/models/user.model';

@Injectable({ providedIn: 'root' })
export class SessionStore {
  protected loaded: boolean = false;

  private _user: User = new User();

  public get user(): User {
    return this._user;
  }

  public set user(user: User) {
    this._user = user;
    this.loaded = true;
  }
}
