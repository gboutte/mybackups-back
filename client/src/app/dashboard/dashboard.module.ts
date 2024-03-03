import { CommonModule } from '@angular/common';
import { NgModule, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { ContentModule, NavigationModule } from '@gboutte/glassui';
import { Subscription } from 'rxjs';
import { ConfigStore } from '../config/config.store';
import { DashboardRootComponent } from './dashboard-root/dashboard-root.component';
import { DashboardRoutingModule } from './dashboard-routing.module';

@NgModule({
  declarations: [DashboardRootComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    NavigationModule,
    ContentModule,
  ],
})
export class DashboardModule implements OnDestroy {
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
