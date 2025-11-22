import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ConfigService } from './config/config.service';
import { MultiTranslateHttpLoader } from './global/multi-translate-http-loader';
export function HttpLoaderFactory(http: HttpClient): MultiTranslateHttpLoader {
  return new MultiTranslateHttpLoader(http);
}
@NgModule(/* TODO(standalone-migration): clean up removed NgModule class manually. 
{
  declarations: [AppRootComponent],
  imports: [
    BrowserModule,
    RouterOutlet,
    AppRoutingModule,
    ConfigModule,
    AuthModule,
    TranslateModule.forRoot({
      defaultLanguage: 'en',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient],
      },
    }),
  ],
  providers: [
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
  ],
  bootstrap: [AppRootComponent],
} */)
export class AppModule {
  constructor(configService: ConfigService) {
    configService.refreshConfigStore();
  }
}
