import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRootComponent } from './app-root/app-root.component';
import { RouterOutlet } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { ConfigStore } from './config/config.store';
import { AuthModule } from './auth/auth.module';
import { AuthInterceptor } from './auth/interceptor/auth.interceptor';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { RetryInterceptor } from './global/interceptors/retry.interceptor';

@NgModule({
  declarations: [AppRootComponent],
  imports: [
    BrowserModule,
    RouterOutlet,
    AppRoutingModule,
    ConfigModule,
    AuthModule,
  ],
  providers: [
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
  ],
  bootstrap: [AppRootComponent],
})
export class AppModule {
  constructor(configService: ConfigService, configStore: ConfigStore) {
    configService.getConfig().subscribe((config) => {
      configStore.isInstalled = config.isInstalled;
    });
  }
}
