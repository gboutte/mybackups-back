import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { deserialize } from 'serializr';
import { AbstractService } from '../../../global/abstract.service';
import { User } from '../models/user.model';

@Injectable()
export class UsersService extends AbstractService {
  constructor(httpClient: HttpClient) {
    super(httpClient);
  }

  getAll(): Observable<User[]> {
    return this.httpClient
      .get<User[]>(this.getUrl() + '/users', this.httpOptions)
      .pipe(
        map((users: User[]) => {
          return users.map((user: User) => {
            return deserialize(User, user);
          });
        }),
      );
  }

  create(username: string, password: string): Observable<any> {
    return this.httpClient.post<any>(
      this.getUrl() + '/users',
      {
        username: username,
        password: password,
      },
      this.httpOptions,
    );
  }

  update(id: string, password: string): Observable<any> {
    return this.httpClient.patch<any>(
      this.getUrl() + '/users/' + id,
      {
        password: password,
      },
      this.httpOptions,
    );
  }
}
