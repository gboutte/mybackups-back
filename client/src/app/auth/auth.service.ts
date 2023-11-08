import { Injectable } from '@angular/core';
import { AbstractService } from '../global/abstract.service';
import { map, Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { deserialize } from 'serializr';
import { User } from '../dashboard/users/models/user.model';

@Injectable()
export class AuthService extends AbstractService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  getUserInfo(): Observable<User> {
    return this.httpClient
      .get(this.getUrl() + '/users/me', this.httpOptions)
      .pipe(map((response: any) => deserialize(User, response)));
  }

  login(
    username: string,
    password: string,
  ): Observable<{ access_token: string }> {
    return this.httpClient.post<{ access_token: string }>(
      this.getUrl() + '/auth/login',
      {
        username: username,
        password: password,
      },
      this.httpOptions,
    );
  }
}
