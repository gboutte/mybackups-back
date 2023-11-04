import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import {
  concatMap,
  delay,
  finalize,
  Observable,
  of,
  retryWhen,
  tap,
  throwError,
} from 'rxjs';
import { Injectable } from '@angular/core';

@Injectable()
export class RetryInterceptor implements HttpInterceptor {
  private retryCount = 5;
  private retryWaitMilliSeconds = 2000;

  intercept(
    request: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    let numberOfTry: number = 0;
    return next.handle(request).pipe(
      retryWhen((error) =>
        error.pipe(
          concatMap((error, count) => {
            numberOfTry = count;
            if (count <= this.retryCount && error.status === 504) {
              return of(error);
            }
            return throwError(error);
          }),
          delay(this.retryWaitMilliSeconds),
          tap((err) =>
            console.log(
              `${request.url}: Retrying request (${numberOfTry + 1})...`,
            ),
          ),
        ),
      ),
      finalize(() => {}),
    );
  }
}
