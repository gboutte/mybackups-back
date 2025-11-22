import { Component, inject, OnInit } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import {
  ButtonsModule,
  ContentModule,
  InputsModule,
  ToastService,
} from '@gboutte/glassui';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService, LoginTokens } from '../../../auth/auth.service';
import { SessionService } from '../../../auth/session.service';

@Component({
  selector: 'mb-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [
    ContentModule,
    ReactiveFormsModule,
    InputsModule,
    ButtonsModule,
    TranslateModule,
  ],
})
export class LoginComponent implements OnInit {
  protected loginForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', Validators.required),
  });
  private authService: AuthService = inject(AuthService);
  private sessionService: SessionService = inject(SessionService);
  private router: Router = inject(Router);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private toastService: ToastService = inject(ToastService);
  private translate: TranslateService = inject(TranslateService);

  protected get username(): FormControl {
    return this.loginForm.get('username') as FormControl;
  }

  protected get password(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }

  public ngOnInit(): void {
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

  protected login(): void {
    if (this.loginForm.valid && !this.loginForm.disabled) {
      this.loginForm.disable();
      this.authService
        .login(this.username.value, this.password.value)
        .subscribe({
          next: (response: LoginTokens) => {
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
