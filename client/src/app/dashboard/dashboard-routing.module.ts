import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    loadChildren: (): any =>
      import('./home/home.module').then((m): any => m.HomeModule),
  },
  {
    path: 'users',
    loadChildren: (): any =>
      import('./users/users.module').then((m): any => m.UsersModule),
  },
  {
    path: 'backups',
    loadChildren: (): any =>
      import('./backups/backups.module').then((m): any => m.BackupsModule),
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
