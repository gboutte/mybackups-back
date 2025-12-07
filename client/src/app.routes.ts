import {Routes} from "@angular/router";
import {DashboardRootComponent} from "./app/dashboard/dashboard-root/dashboard-root.component";
import {AuthGuard} from "./app/auth/auth.guard";

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
    loadChildren: () =>
      import('./app/login/login.module').then((m) => m.LoginModule),
  },
  {
    path: 'dashboard',
    component: DashboardRootComponent,
    canActivate: [AuthGuard],
    loadChildren: () =>
      import('./app/dashboard/dashboard.module').then((m) => m.DashboardModule),
  },
  {
    path: 'installation',
    loadChildren: () =>
      import('./app/installation/installation.module').then(
        (m) => m.InstallationModule,
      ),
  },
];
