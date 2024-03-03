import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { BackupsComponent } from './components/backups/backups.component';
import { BackupsConfigSettingsComponent } from './components/config/backups-config-settings/backups-config-settings.component';
const routes: Routes = [
  {
    path: '',
    component: BackupsComponent,
  },
  {
    path: ':id/settings',
    component: BackupsConfigSettingsComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BackupsRoutingModule {}
