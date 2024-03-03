import { NgModule, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './components/login/login.component';
import { LoginRoutingModule } from './login-routing.module';
import { Subscription } from 'rxjs';
import { ConfigStore } from '../config/config.store';
import { Router } from '@angular/router';
import {
  ButtonsModule,
  ContentModule,
  InputsModule,
  ToastModule,
} from '@gboutte/glassui';
import { ReactiveFormsModule } from '@angular/forms';
import { AuthModule } from '../auth/auth.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [LoginComponent],
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
  ],
})
export class LoginModule implements OnDestroy {
  private installSubscription!: Subscription;

  constructor(configStore: ConfigStore, router: Router) {
    this.installSubscription = configStore.isInstalled$.subscribe(
      (isInstalled) => {
        if (isInstalled !== null && !isInstalled) {
          router.navigate(['/installation']);
        }
      },
    );
  }

  ngOnDestroy() {
    this.installSubscription.unsubscribe();
  }
}
