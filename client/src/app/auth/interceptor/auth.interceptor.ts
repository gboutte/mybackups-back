/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, catchError, throwError } from 'rxjs';
import { SessionService } from '../session.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private sessionService: SessionService = inject(SessionService);
  private router: Router = inject(Router);

  public intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    if (this.sessionService.isSessionValid()) {
      const request: HttpRequest<any> = this.addAuthHeader(req);
      return next.handle(request).pipe(
        catchError((error: unknown): Observable<never> => {
          return this.handleResponseError(error);
        }),
      );
    } else {
      return next.handle(req).pipe(
        catchError((error: unknown): Observable<never> => {
          return this.handleResponseError(error);
        }),
      );
    }
  }
  private handleResponseError(error: any): Observable<never> {
    if (error.status === 401 && !this.sessionService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }

    return throwError(() => error);
  }
  private addAuthHeader(req: HttpRequest<any>): HttpRequest<any> {
    return req.clone({
      headers: req.headers.set(
        'Authorization',
        'Bearer '.concat(this.sessionService.access_token),
      ),
    });
  }
}
