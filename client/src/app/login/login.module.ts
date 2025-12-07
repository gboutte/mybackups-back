import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  ButtonsModule,
  ContentModule,
  InputsModule,
  ToastModule,
} from '@gboutte/glassui';
import { TranslateModule } from '@ngx-translate/core';
import { AuthModule } from '../auth/auth.module';
import { ConfigStore } from '../config/config.store';
import { LoginComponent } from './components/login/login.component';
import { LoginRoutingModule } from './login-routing.module';

@NgModule({
  imports: [
    CommonModule,
    LoginRoutingModule,
    ContentModule,
    InputsModule,
    ButtonsModule,
    ReactiveFormsModule,
    AuthModule,
    ToastModule,
    TranslateModule,
    LoginComponent,
  ],
})
export class LoginModule {
  constructor(configStore: ConfigStore, router: Router) {
    configStore.isInstalled$.subscribe((isInstalled: boolean | null) => {
      if (isInstalled !== null && !isInstalled) {
        router.navigate(['/installation']);
      }
    });
  }
}
