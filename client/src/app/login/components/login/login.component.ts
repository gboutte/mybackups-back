import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../auth/auth.service';
import { Router } from '@angular/router';
import { SessionService } from '../../../auth/session.service';

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

  constructor(
    authService: AuthService,
    router: Router,
    sessionService: SessionService,
  ) {
    this.authService = authService;
    this.router = router;
    this.sessionService = sessionService;
  }

  get username(): FormControl {
    return this.loginForm.get('username') as FormControl;
  }

  get password(): FormControl {
    return this.loginForm.get('password') as FormControl;
  }

  ngOnInit(): void {
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
            //@todo add toast
            this.sessionService.setTokens(response.access_token);
            this.router.navigate(['/dashboard']);
          },
          error: () => {
            //@todo add toast
            console.error('Invalid credentials');
            this.loginForm.enable();
          },
        });
    } else {
      //@todo add toast
    }
  }
}
