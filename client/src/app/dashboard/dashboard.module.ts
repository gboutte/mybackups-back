import { NgModule, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardRoutingModule } from './dashboard-routing.module';
import { Subscription } from 'rxjs';
import { ConfigStore } from '../config/config.store';
import { Router } from '@angular/router';
import { DashboardRootComponent } from './dashboard-root/dashboard-root.component';
import { NavigationModule } from '@gboutte/glassui';

@NgModule({
  declarations: [DashboardRootComponent],
  imports: [CommonModule, DashboardRoutingModule, NavigationModule],
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
