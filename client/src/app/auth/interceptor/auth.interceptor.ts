import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { catchError, Observable, throwError } from 'rxjs';
import { SessionService } from '../session.service';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private sessionService: SessionService;
  private router: Router;

  constructor(sessionService: SessionService, router: Router) {
    this.sessionService = sessionService;
    this.router = router;
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    if (this.sessionService.isSessionValid()) {
      const request = this.addAuthHeader(req);
      return next.handle(request).pipe(
        catchError((error) => {
          return this.handleResponseError(error, req, next);
        }),
      );
    } else {
      return next.handle(req).pipe(
        catchError((error) => {
          return this.handleResponseError(error, req, next);
        }),
      );
    }
  }
  handleResponseError(
    error: any,
    request: HttpRequest<any>,
    next: HttpHandler,
  ) {
    if (error.status === 401 && !this.sessionService.isLoggedIn()) {
      this.router.navigate(['/login']);
    }

    return throwError(() => error);
  }
  addAuthHeader(req: HttpRequest<any>) {
    return req.clone({
      headers: req.headers.set(
        'Authorization',
        'Bearer '.concat(this.sessionService.access_token),
      ),
    });
  }
}
