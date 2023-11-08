import { Injectable } from '@angular/core';
import { AuthService } from './auth.service';
import { SessionStore } from './session.store';
import * as moment from 'moment';
import { jwtDecode } from 'jwt-decode';
import { User } from '../dashboard/users/models/user.model';

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
  scopes: any;
}

@Injectable()
export class SessionService {
  private authService: AuthService;
  private sessionStore: SessionStore;

  constructor(authService: AuthService, sessionStore: SessionStore) {
    this.authService = authService;
    this.sessionStore = sessionStore;
  }

  get access_expires_at() {
    const access_expires_at = localStorage.getItem('access_expires_at');
    let result;
    if (access_expires_at !== null) {
      const expiresAt = JSON.parse(access_expires_at);
      result = moment(expiresAt);
    } else {
      result = null;
    }
    return result;
  }

  get access_token(): string {
    return localStorage.getItem('access_token') ?? '';
  }

  public setTokens(access_token: string) {
    localStorage.setItem('access_token', access_token);

    const payload = <JWTPayload>jwtDecode(access_token);
    const expiresAt = moment.unix(payload.exp);
    localStorage.setItem(
      'access_expires_at',
      JSON.stringify(expiresAt.valueOf()),
    );
  }

  public loadInfos() {
    return new Promise((resolve, reject) => {
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
    });
  }

  isLoggedIn() {
    return this.access_token.length > 0 && this.access_expires_at !== null;
  }

  isSessionValid() {
    return (
      this.access_token.length > 0 &&
      this.access_expires_at !== null &&
      moment().isBefore(this.access_expires_at)
    );
  }

  public logout() {
    localStorage.removeItem('access_token');
    localStorage.removeItem('access_expires_at');
  }

  getUsername() {
    return this.access_token;
  }
}
