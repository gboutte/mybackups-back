import { DOCUMENT } from '@angular/common';
import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router';
import { ContentModule, NavigationModule } from '@gboutte/glassui';
import { MenuModel } from '@gboutte/glassui/lib/navigation/sidebar/menu.model';
import { TranslateService } from '@ngx-translate/core';
import { SessionService } from '../../auth/session.service';

@Component({
  selector: 'mb-dashboard-root',
  templateUrl: './dashboard-root.component.html',
  styleUrls: ['./dashboard-root.component.scss'],
  imports: [ContentModule, NavigationModule, RouterOutlet],
})
export class DashboardRootComponent implements OnInit {
  protected loading: boolean = true;
  protected menu: MenuModel[] = [];
  private sessionService: SessionService = inject(SessionService);
  private router: Router = inject(Router);
  private translate: TranslateService = inject(TranslateService);
  private window: Window | null = inject(DOCUMENT)?.defaultView;

  public ngOnInit(): void {
    this.translate.get('menu.links.home').subscribe((res: string): void => {
      this.menu.push({
        label: res,
        link: '/dashboard/home',
      });
    });

    this.translate.get('menu.links.users').subscribe((res: string): void => {
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
          if (this.window?.location.pathname !== '/login') {
            this.router.navigate(['/logout']);
          }
        });
    } else {
      this.loading = false;
      this.router.navigate(['/logout']);
    }
  }
}
