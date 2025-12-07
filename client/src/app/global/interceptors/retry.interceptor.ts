/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  Observable,
  concatMap,
  delay,
  of,
  retryWhen,
  tap,
  throwError,
} from 'rxjs';

@Injectable()
export class RetryInterceptor implements HttpInterceptor {
  private retryCount: number = 5;
  private retryWaitMilliSeconds: number = 2000;

  public intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    let numberOfTry: number = 0;
    return next.handle(request).pipe(
      retryWhen((error: Observable<any>) =>
        error.pipe(
          concatMap((error: any, count: number) => {
            numberOfTry = count;
            if (count <= this.retryCount && error.status === 504) {
              return of(error);
            }
            return throwError(error);
          }),
          delay(this.retryWaitMilliSeconds),
          tap(() =>
            console.log(
              `${request.url}: Retrying request (${numberOfTry + 1})...`,
            ),
          ),
        ),
      ),
    );
  }
}
