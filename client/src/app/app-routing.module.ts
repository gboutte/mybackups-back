import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './auth/auth.guard';
import { DashboardRootComponent } from './dashboard/dashboard-root/dashboard-root.component';

const routes: Routes = [
  {
    // Redirect to login page
    path: '',
    pathMatch: 'full',
    redirectTo: 'login',
  },
  {
    path: 'logout',
    redirectTo: '/login?logout',
  },
  {
    path: 'login',
    loadChildren: () =>
      import('./login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'dashboard',
    component: DashboardRootComponent,
    canActivate: [AuthGuard],
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
