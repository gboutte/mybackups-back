import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../auth/auth.service';
import { ActivatedRoute, Router } from '@angular/router';
import { SessionService } from '../../../auth/session.service';
import { ToastService } from '@gboutte/glassui';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'mb-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit {
  loginForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', Validators.required),
  });
  private authService: AuthService;
  private sessionService: SessionService;
  private router: Router;
  private route: ActivatedRoute;
  private toastService: ToastService;
  private translate: TranslateService;

  constructor(
    authService: AuthService,
    router: Router,
    sessionService: SessionService,
    route: ActivatedRoute,
    toastService: ToastService,
    translate: TranslateService,
  ) {
    this.authService = authService;
    this.router = router;
    this.sessionService = sessionService;
    this.route = route;
    this.toastService = toastService;
    this.translate = translate;
  }

  get username(): FormControl {
    return this.loginForm.get('username') as FormControl;
  }

  get password(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }

  ngOnInit(): void {
    //If has logout query param, logout
    if (this.route.snapshot.queryParamMap.get('logout') !== null) {
      this.sessionService.logout();
      //remove logout query param
      this.router.navigate([], {
        queryParams: {
          logout: null,
        },
      });
    }

    if (
      this.sessionService.isLoggedIn() &&
      this.sessionService.isSessionValid()
    ) {
      this.router.navigate(['/dashboard']);
    }
  }

  login() {
    if (this.loginForm.valid && !this.loginForm.disabled) {
      this.loginForm.disable();
      this.authService
        .login(this.username.value, this.password.value)
        .subscribe({
          next: (response) => {
            this.sessionService.setTokens(response.access_token);
            this.router.navigate(['/dashboard']);
          },
          error: () => {
            this.toastService.alert({
              description: this.translate.instant(
                'login.toast.error.description',
              ),
              icon: 'error',
              title: this.translate.instant('login.toast.error.title'),
              color: 'white',
            });
            console.error('Invalid credentials');
            this.loginForm.enable();
          },
        });
    }
  }
}
