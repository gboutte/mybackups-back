import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import {
  ButtonsModule,
  ContentModule,
  InputsModule,
  ToastService,
} from '@gboutte/glassui';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { AuthService } from '../../../auth/auth.service';
import { ConfigService } from '../../../config/config.service';

@Component({
  selector: 'mb-install',
  templateUrl: './install.component.html',
  styleUrls: ['./install.component.scss'],
  standalone: true,
  imports: [
    ContentModule,
    ReactiveFormsModule,
    InputsModule,
    ButtonsModule,
    TranslateModule,
  ],
})
export class InstallComponent {
  protected registerForm: FormGroup = new FormGroup({
    username: new FormControl('', [Validators.required]),
    password: new FormControl('', Validators.required),
  });

  private authService: AuthService = inject(AuthService);
  private router: Router = inject(Router);
  private toastService: ToastService = inject(ToastService);
  private configService: ConfigService = inject(ConfigService);
  private translate: TranslateService = inject(TranslateService);

  protected get username(): FormControl {
    return this.registerForm.get('username') as FormControl;
  }

  protected get password(): FormControl {
    return this.registerForm.get('password') as FormControl;
  }

  protected register(): void {
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
