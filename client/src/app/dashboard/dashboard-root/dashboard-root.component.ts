import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuModel } from '@gboutte/glassui/lib/navigation/sidebar/menu.model';
import { TranslateService } from '@ngx-translate/core';
import { SessionService } from '../../auth/session.service';

@Component({
  selector: 'mb-dashboard-root',
  templateUrl: './dashboard-root.component.html',
  styleUrls: ['./dashboard-root.component.scss'],
})
export class DashboardRootComponent implements OnInit {
  loading: boolean = true;
  menu: MenuModel[] = [];
  private sessionService: SessionService;
  private router: Router;
  private translate: TranslateService;

  constructor(
    sessionService: SessionService,
    router: Router,
    translate: TranslateService,
  ) {
    this.sessionService = sessionService;
    this.router = router;
    this.translate = translate;
  }

  ngOnInit() {
    this.translate.get('menu.links.home').subscribe((res: string) => {
      this.menu.push({
        label: res,
        link: '/dashboard/home',
      });
    });

    this.translate.get('menu.links.users').subscribe((res: string) => {
      this.menu.push({
        label: res,
        link: '/dashboard/users',
      });
    });

    this.translate.get('menu.links.backups').subscribe((res: string) => {
      this.menu.push({
        label: res,
        link: '/dashboard/backups',
      });
    });

    if (this.sessionService.isSessionValid()) {
      this.sessionService
        .loadInfos()
        .then(() => {
          this.loading = false;
        })
        .catch(() => {
          if (window.location.pathname !== '/login') {
            this.router.navigate(['/logout']);
          }
        });
    } else {
      this.loading = false;
      this.router.navigate(['/logout']);
    }
  }
}
