import { CommonModule } from '@angular/common';
import {
  provideHttpClient,
  withInterceptorsFromDi,
} from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ConfigService } from './config.service';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [ConfigService, provideHttpClient(withInterceptorsFromDi())],
})
export class ConfigModule {}
