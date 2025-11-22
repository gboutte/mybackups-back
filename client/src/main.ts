import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { FormControl, FormGroup } from '@angular/forms';
import { AppModule, HttpLoaderFactory } from './app/app.module';
import { AuthGuard } from './app/auth/auth.guard';
import { HTTP_INTERCEPTORS, HttpClient } from '@angular/common/http';
import { AuthInterceptor } from './app/auth/interceptor/auth.interceptor';
import { RetryInterceptor } from './app/global/interceptors/retry.interceptor';
import { BrowserModule, bootstrapApplication } from '@angular/platform-browser';
import { RouterOutlet } from '@angular/router';
import { AppRoutingModule } from './app/app-routing.module';
import { ConfigModule } from './app/config/config.module';
import { AuthModule } from './app/auth/auth.module';
import { TranslateModule, TranslateLoader } from '@ngx-translate/core';
import { MultiTranslateHttpLoader } from './app/global/multi-translate-http-loader';
import { AppRootComponent } from './app/app-root/app-root.component';
import { importProvidersFrom } from '@angular/core';

declare module '@angular/forms' {
  interface FormGroup {
    updateAllValueAndValidity: (formGroup: FormGroup) => void;
  }
}

FormGroup.prototype.updateAllValueAndValidity = (
  formGroup: FormGroup,
): void => {
  function updateFormGroup(formGroup: FormGroup) {
    Object.keys(formGroup.controls).forEach((controlKey) => {
      const control = formGroup.controls[controlKey];
      if (control instanceof FormControl) {
        control.updateValueAndValidity();
      } else if (control instanceof FormGroup) {
        updateFormGroup(control);
      }
    });
  }

  updateFormGroup(formGroup);
};
bootstrapApplication(AppRootComponent, {
    providers: [
        importProvidersFrom(BrowserModule, RouterOutlet, AppRoutingModule, ConfigModule, AuthModule, TranslateModule.forRoot({
            defaultLanguage: 'en',
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient],
            },
        })),
        AuthGuard,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AuthInterceptor,
            multi: true,
        },
        {
            provide: HTTP_INTERCEPTORS,
            useClass: RetryInterceptor,
            multi: true,
        },
    ]
})
  .catch((err) => console.error(err));
