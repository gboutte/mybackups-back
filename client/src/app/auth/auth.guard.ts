import { inject, Injectable } from '@angular/core';
import { CanActivate, Router } from '@angular/router';
import { SessionService } from './session.service';

@Injectable()
export class AuthGuard implements CanActivate {
  public sessionService: SessionService = inject(SessionService);
  public router: Router = inject(Router);

  public canActivate(): boolean {
    if (!this.sessionService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }
}
