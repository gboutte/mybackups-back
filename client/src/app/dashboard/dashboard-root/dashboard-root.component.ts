import { Component } from '@angular/core';
import { SessionService } from '../../auth/session.service';
import { Router } from '@angular/router';
import { MenuModel } from '@gboutte/glassui/lib/navigation/sidebar/menu.model';

@Component({
  selector: 'mb-dashboard-root',
  templateUrl: './dashboard-root.component.html',
  styleUrls: ['./dashboard-root.component.scss'],
})
export class DashboardRootComponent {
  loading: boolean = true;
  menu: MenuModel[] = [
    {
      label: 'Home',
      link: '/dashboard',
    },
    {
      label: 'Users',
      link: '/dashboard/users',
    },
    {
      label: 'Backups',
      link: '/dashboard/backups',
    },
  ];
  private sessionService: SessionService;
  private router: Router;

  constructor(sessionService: SessionService, router: Router) {
    this.sessionService = sessionService;
    this.router = router;
  }

  ngOnInit() {
    if (this.sessionService.isSessionValid()) {
      this.sessionService
        .loadInfos()
        .then(() => {
          this.loading = false;
        })
        .catch(() => {
          if (window.location.pathname !== '/login') {
            console.log('Session expired');
          }
        });
    } else {
      this.loading = false;
    }
  }
}
