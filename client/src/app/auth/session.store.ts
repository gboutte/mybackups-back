import { Injectable } from '@angular/core';
import { User } from '../dashboard/users/models/user.model';

@Injectable({ providedIn: 'root' })
export class SessionStore {
  loaded: boolean = false;

  private _user: User = new User();

  get user() {
    return this._user;
  }

  set user(user: User) {
    this._user = user;
    this.loaded = true;
  }
}
