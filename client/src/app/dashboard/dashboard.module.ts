import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { Router } from '@angular/router';
import { ContentModule, NavigationModule } from '@gboutte/glassui';
import { ConfigStore } from '../config/config.store';
import { DashboardRootComponent } from './dashboard-root/dashboard-root.component';
import { DashboardRoutingModule } from './dashboard-routing.module';

@NgModule({
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NavigationModule,
    ContentModule,
    DashboardRootComponent,
  ],
})
export class DashboardModule {
  constructor(configStore: ConfigStore, router: Router) {
    configStore.isInstalled$.subscribe((isInstalled: boolean | null) => {
      if (isInstalled !== null && !isInstalled) {
        router.navigate(['/installation']);
      }
    });
  }
}
