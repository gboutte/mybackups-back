import {
  HttpEvent,
  HttpHandler,
  HttpInterceptor,
  HttpRequest,
} from '@angular/common/http';
import { Observable } from 'rxjs';
import { SessionService } from '../session.service';
import { Injectable } from '@angular/core';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  private sessionService: SessionService;

  constructor(sessionService: SessionService) {
    this.sessionService = sessionService;
  }

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler,
  ): Observable<HttpEvent<any>> {
    console.log(
      'AuthInterceptor',
      req.url,
      this.sessionService.isSessionValid(),
    );
    if (this.sessionService.isSessionValid()) {
      const request = this.addAuthHeader(req);
      return next.handle(request);
    } else {
      return next.handle(req);
    }
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
