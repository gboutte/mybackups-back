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
  public getUserInfo(): Observable<User> {
    return this.httpClient
      .get<
        InstanceType<typeof User>
      >(this.getUrl() + '/users/me', this.httpOptions)
      .pipe(
        map(
          (response: InstanceType<typeof User>): User =>
            deserialize(User, response),
        ),
      );
  }

  public login(username: string, password: string): Observable<LoginTokens> {
    return this.httpClient.post<LoginTokens>(
      this.getUrl() + '/auth/login',
      {
        username: username,
        password: password,
      },
      this.httpOptions,
    );
  }
  public install(username: string, password: string): Observable<void> {
    return this.httpClient.post<void>(
      this.getUrl() + '/install/register',
      {
        username: username,
        password: password,
      },
      this.httpOptions,
    );
  }
}
