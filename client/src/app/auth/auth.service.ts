import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { deserialize } from 'serializr';
import { User } from '../dashboard/users/models/user.model';
import { AbstractService } from '../global/abstract.service';

export interface LoginTokens {
  access_token: string;
}

@Injectable()
export class AuthService extends AbstractService {
  getUserInfo(): Observable<User> {
    return this.httpClient
      .get(this.getUrl() + '/users/me', this.httpOptions)
      .pipe(map((response: any) => deserialize(User, response)));
  }

  login(username: string, password: string): Observable<LoginTokens> {
    return this.httpClient.post<LoginTokens>(
      this.getUrl() + '/auth/login',
      {
        username: username,
        password: password,
      },
      this.httpOptions,
    );
  }
  install(username: string, password: string): Observable<any> {
    return this.httpClient.post<any>(
      this.getUrl() + '/install/register',
      {
        username: username,
        password: password,
      },
      this.httpOptions,
    );
  }
}
