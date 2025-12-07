import { inject, Injectable } from '@angular/core';
import { jwtDecode } from 'jwt-decode';
import moment, { Moment } from 'moment';
import { SsrCookieService } from 'ngx-cookie-service-ssr';
import { User } from '../dashboard/users/models/user.model';
import { AuthService } from './auth.service';
import { SessionStore } from './session.store';

interface JWTPayload {
  //Id utilisateur
  sub: string;
  //Application
  aud: string;
  //date de creation du token
  iat: number;
  //Not valid before
  nbf: number;
  //identifiant du token
  jti: string;
  //Date d'expiration
  exp: number;
  //Scopes
  scopes: string[];
}

@Injectable()
export class SessionService {
  private cookieService: SsrCookieService = inject(SsrCookieService);
  private authService: AuthService = inject(AuthService);
  private sessionStore: SessionStore = inject(SessionStore);

  public get access_expires_at(): moment.Moment | null {
    const access_expires_at: string | null =
      this.cookieService.get('access_expires_at');
    let result: moment.Moment | null;
    if (access_expires_at !== null) {
      result = moment(parseInt(access_expires_at));
    } else {
      result = null;
    }
    return result;
  }

  public isExpired(): boolean {
    return moment().isAfter(this.access_expires_at);
  }

  public get access_token(): string {
    return this.cookieService.get('access_token') ?? '';
  }

  public setTokens(access_token: string): void {
    this.cookieService.set('access_token', access_token);

    const payload: JWTPayload = jwtDecode(access_token);
    const expiresAt: Moment = moment.unix(payload.exp);
    this.cookieService.set(
      'access_expires_at',
      JSON.stringify(expiresAt.valueOf()),
    );
  }

  public loadInfos(): Promise<boolean> {
    return new Promise(
      (resolve: (value: boolean) => void, reject: () => void) => {
        if (this.isSessionValid()) {
          this.authService.getUserInfo().subscribe({
            next: (user: User) => {
              this.sessionStore.user = user;
              resolve(true);
            },
            error: () => {
              reject();
            },
          });
        } else {
          reject();
        }
      },
    );
  }

  public isLoggedIn(): boolean {
    return (
      this.access_token.length > 0 &&
      this.access_expires_at !== null &&
      !this.isExpired()
    );
  }

  public isSessionValid(): boolean {
    return (
      this.access_token.length > 0 &&
      this.access_expires_at !== null &&
      moment().isBefore(this.access_expires_at)
    );
  }

  public logout(): void {
    this.cookieService.delete('access_token');
    this.cookieService.delete('access_expires_at');
  }

  public getUsername(): string {
    return this.access_token;
  }
}
