import {ApplicationConfig, importProvidersFrom} from "@angular/core";
import {BrowserModule, provideClientHydration, withEventReplay} from "@angular/platform-browser";
import {provideRouter, RouterOutlet} from "@angular/router";
import {ConfigModule} from "./app/config/config.module";
import {AuthModule} from "./app/auth/auth.module";
import {TranslateLoader, TranslateModule} from "@ngx-translate/core";
import {HTTP_INTERCEPTORS, HttpClient} from "@angular/common/http";
import {AuthGuard} from "./app/auth/auth.guard";
import {AuthInterceptor} from "./app/auth/interceptor/auth.interceptor";
import {RetryInterceptor} from "./app/global/interceptors/retry.interceptor";
import {routes} from "./app.routes";
import {MultiTranslateHttpLoader} from "./app/global/multi-translate-http-loader";

export function HttpLoaderFactory(http: HttpClient): MultiTranslateHttpLoader {
  return new MultiTranslateHttpLoader(http);
}

export const appConfig:ApplicationConfig = {
  providers: [
    importProvidersFrom(BrowserModule, RouterOutlet, ConfigModule, AuthModule, TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    })),

    provideRouter(routes),
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
    }, provideClientHydration(withEventReplay()),
  ]
}
