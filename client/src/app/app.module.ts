import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { AppRootComponent } from './app-root/app-root.component';
import { RouterOutlet } from '@angular/router';
import { AppRoutingModule } from './app-routing.module';
import { ConfigModule } from './config/config.module';
import { ConfigService } from './config/config.service';
import { ConfigStore } from './config/config.store';

@NgModule({
  declarations: [AppRootComponent],
  imports: [BrowserModule, RouterOutlet, AppRoutingModule, ConfigModule],
  providers: [],
  bootstrap: [AppRootComponent],
})
export class AppModule {
  constructor(configService: ConfigService, configStore: ConfigStore) {
    configService.getConfig().subscribe((config) => {
      configStore.isInstalled = config.isInstalled;
    });
  }
}
