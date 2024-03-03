import { CommonModule } from '@angular/common';
import { NgModule, OnDestroy } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  ButtonsModule,
  ContentModule,
  InputsModule,
  ToastModule,
} from '@gboutte/glassui';
import { TranslateModule } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ConfigStore } from '../config/config.store';
import { InstallComponent } from './components/install/install.component';
import { InstallationRoutingModule } from './installation-routing.module';

@NgModule({
  declarations: [InstallComponent],
  imports: [
    CommonModule,
    InstallationRoutingModule,
    ButtonsModule,
    ContentModule,
    InputsModule,
    ReactiveFormsModule,
    ToastModule,
    TranslateModule,
  ],
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
