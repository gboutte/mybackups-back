import { Injectable } from '@angular/core';
import { AbstractService } from '../../../global/abstract.service';
import { HttpClient } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { deserialize } from 'serializr';

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

  update(id:number, password: string): Observable<any> {
    return this.httpClient.patch<any>(
      this.getUrl() + '/users/' + id,
      {
        password: password,
      },
      this.httpOptions,
    );
  }
}
