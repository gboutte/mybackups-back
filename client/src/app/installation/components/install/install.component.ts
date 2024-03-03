import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../../../auth/auth.service';
import { SessionService } from '../../../auth/session.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ToastService } from '@gboutte/glassui';
import { ConfigService } from '../../../config/config.service';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'mb-install',
  templateUrl: './install.component.html',
  styleUrls: ['./install.component.scss'],
})
export class InstallComponent {
  registerForm = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', Validators.required),
  });

  private authService: AuthService;
  private sessionService: SessionService;
  private router: Router;
  private route: ActivatedRoute;
  private toastService: ToastService;
  private configService: ConfigService;
  private translate: TranslateService;

  constructor(
    authService: AuthService,
    router: Router,
    sessionService: SessionService,
    route: ActivatedRoute,
    toastService: ToastService,
    configService: ConfigService,
    translate: TranslateService,
  ) {
    this.authService = authService;
    this.router = router;
    this.sessionService = sessionService;
    this.route = route;
    this.toastService = toastService;
    this.configService = configService;
    this.translate = translate;
  }

  get username(): FormControl {
    return this.registerForm.get('username') as FormControl;
  }

  get password(): FormControl {
    return this.registerForm.get('password') as FormControl;
  }

  register() {
    if (this.registerForm.valid && !this.registerForm.disabled) {
      this.registerForm.disable();
      this.authService
        .install(this.username.value, this.password.value)
        .subscribe({
          next: () => {
            this.toastService.alert({
              description: this.translate.instant(
                'installation.toast.success.description',
              ),
              icon: 'success',
              title: this.translate.instant('installation.toast.success.title'),
              color: 'white',
            });
            this.configService.refreshConfigStore().subscribe(() => {
              this.router.navigate(['/login']);
            });
          },
          error: () => {
            this.toastService.alert({
              description: this.translate.instant(
                'installation.toast.error.description',
              ),
              icon: 'error',
              title: this.translate.instant('installation.toast.error.title'),
              color: 'white',
            });
            console.error('Invalid credentials');
            this.registerForm.enable();
          },
        });
    }
  }
}
