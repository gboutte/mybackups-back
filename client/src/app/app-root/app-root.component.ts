import { Component, inject } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { RouterOutlet } from '@angular/router';
import {ConfigService} from "../config/config.service";

@Component({
    selector: 'mb-app-root',
    templateUrl: './app-root.component.html',
    styleUrls: ['./app-root.component.scss'],
    standalone: true,
    imports: [RouterOutlet],
})
export class AppRootComponent {
  public translate: TranslateService = inject(TranslateService);
  public configService: ConfigService = inject(ConfigService)
  constructor() {

    this.configService.refreshConfigStore();
    // Register translation languages
    this.translate.addLangs(['en', 'fr']);
    // Set default language
    this.translate.setDefaultLang('en');
    const browserLang: string | undefined = this.translate.getBrowserLang();
    if (browserLang !== undefined) {
      this.translate.use(browserLang.match(/en|fr/) ? browserLang : 'fr');
    }
  }
}
