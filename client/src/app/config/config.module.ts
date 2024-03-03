import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { ConfigService } from './config.service';

@NgModule({
  declarations: [],
  imports: [CommonModule, HttpClientModule],
  providers: [ConfigService],
})
export class ConfigModule {}
