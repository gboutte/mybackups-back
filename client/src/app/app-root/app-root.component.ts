import {Component} from '@angular/core';
import {TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'mb-app-root',
  templateUrl: './app-root.component.html',
  styleUrls: ['./app-root.component.scss'],
})
export class AppRootComponent {
  constructor(public translate: TranslateService) {
    // Register translation languages
    translate.addLangs(['en', 'fr']);
    // Set default language
    translate.setDefaultLang('en');
    const browserLang = translate.getBrowserLang();
    if (browserLang !== undefined) {
      translate.use(browserLang.match(/en|fr/) ? browserLang : 'fr');
    }
  }
}
