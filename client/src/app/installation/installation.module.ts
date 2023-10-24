import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { InstallComponent } from './components/install/install.component';
import { InstallationRoutingModule } from './installation-routing.module';

@NgModule({
  declarations: [InstallComponent],
  imports: [CommonModule, InstallationRoutingModule],
})
export class InstallationModule {}
