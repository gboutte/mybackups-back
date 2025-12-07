import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./components/backups/backups.component').then(
        (m) => m.BackupsComponent,
      ),
  },
  {
    path: ':id/settings',
    loadComponent: () =>
      import(
        './components/config/backups-config-settings/backups-config-settings.component'
      ).then((m) => m.BackupsConfigSettingsComponent),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class BackupsRoutingModule {}
