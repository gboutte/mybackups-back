import {Routes} from "@angular/router";

import {AuthGuard} from "./app/auth/auth.guard";



const backupRoutes: Routes = [
  {
    path: '',
    loadComponent: () =>
      import('./app/dashboard/backups/components/backups/backups.component').then(
        (m) => m.BackupsComponent,
      ),
  },
  {
    path: ':id/settings',
    loadComponent: () =>
      import(
        './app/dashboard/backups/components/config/backups-config-settings/backups-config-settings.component'
        ).then((m) => m.BackupsConfigSettingsComponent),
  },
];

const dashboardRoutes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: 'home',
  },
  {
    path: 'home',
    loadComponent: () =>
      import('./app/dashboard/home/components/home/home.component').then((m) => m.HomeComponent),
  },
  {
    path: 'users',
    loadComponent: () =>
      import('./app/dashboard/users/components/users/users.component').then(
        (m) => m.UsersComponent,
      ),
  },
  {
    path: 'backups',
    children: backupRoutes,
  },
];

export const routes: Routes = [
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
    loadComponent: () =>
      import('./app/login/components/login/login.component').then(
        (m) => m.LoginComponent,
      ),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./app/dashboard/dashboard-root/dashboard-root.component').then(m => m.DashboardRootComponent),
    canActivate: [AuthGuard],
    children: dashboardRoutes,
  },
  {
    path: 'installation',

    loadComponent: () =>
      import('./app/installation/components/install/install.component').then(
        (m) => m.InstallComponent,
      ),
  },
];
