import { NgModule, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstallComponent } from './components/install/install.component';
import { InstallationRoutingModule } from './installation-routing.module';
import { Subscription } from 'rxjs';
import { ConfigStore } from '../config/config.store';
import { Router } from '@angular/router';

@NgModule({
  declarations: [InstallComponent],
  imports: [CommonModule, InstallationRoutingModule],
})
export class InstallationModule implements OnDestroy {
  private installSubscription!: Subscription;

  constructor(configStore: ConfigStore, router: Router) {
    this.installSubscription = configStore.isInstalled$.subscribe(
      (isInstalled) => {
        console.log('InstallationModule: isInstalled = ' + isInstalled);
        if (isInstalled) {
          router.navigate(['/login']);
        }
      },
    );
  }

  ngOnDestroy() {
    this.installSubscription.unsubscribe();
  }
}
