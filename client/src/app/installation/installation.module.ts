import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import {
  ButtonsModule,
  ContentModule,
  InputsModule,
  ToastModule,
} from '@gboutte/glassui';
import { TranslateModule } from '@ngx-translate/core';
import { ConfigStore } from '../config/config.store';
import { InstallComponent } from './components/install/install.component';
import { InstallationRoutingModule } from './installation-routing.module';

@NgModule({
  imports: [
    CommonModule,
    InstallationRoutingModule,
    ButtonsModule,
    ContentModule,
    InputsModule,
    ReactiveFormsModule,
    ToastModule,
    TranslateModule,
    InstallComponent,
  ],
})
export class InstallationModule {
  constructor(configStore: ConfigStore, router: Router) {
    configStore.isInstalled$.subscribe((isInstalled: boolean | null) => {
      console.log('InstallationModule: isInstalled = ' + isInstalled);
      if (isInstalled) {
        router.navigate(['/login']);
      }
    });
  }
}
