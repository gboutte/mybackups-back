import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

const routes: Routes = [
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'dashboard',
    loadChildren: () =>
      import('./dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'installation',
    loadChildren: () =>
      import('./installation/installation.module').then(
        (m) => m.InstallationModule,
      ),
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      // Restore the last scroll position
      scrollPositionRestoration: 'enabled',
      scrollOffset: [0, 0],
      // Enable scrolling to anchors
      anchorScrolling: 'enabled',
      initialNavigation: 'enabledBlocking',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
