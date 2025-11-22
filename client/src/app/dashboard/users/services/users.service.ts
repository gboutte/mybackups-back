import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { deserialize } from 'serializr';
import { AbstractService } from '../../../global/abstract.service';
import { User } from '../models/user.model';

@Injectable()
export class UsersService extends AbstractService {
  public getAll(): Observable<User[]> {
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

  public create(username: string, password: string): Observable<User> {
    return this.httpClient
      .post<InstanceType<typeof User>>(
        this.getUrl() + '/users',
        {
          username: username,
          password: password,
        },
        this.httpOptions,
      )
      .pipe(
        map((user: InstanceType<typeof User>): User => {
          return deserialize(User, user);
        }),
      );
  }

  public update(id: string, password: string): Observable<User> {
    return this.httpClient
      .patch<InstanceType<typeof User>>(
        this.getUrl() + '/users/' + id,
        {
          password: password,
        },
        this.httpOptions,
      )
      .pipe(
        map((user: InstanceType<typeof User>): User => {
          return deserialize(User, user);
        }),
      );
  }
}
