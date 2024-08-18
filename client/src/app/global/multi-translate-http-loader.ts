import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { forkJoin, map, Observable } from 'rxjs';

export class MultiTranslateHttpLoader implements TranslateLoader {
  constructor(private http: HttpClient) {}

  /**
   * Gets the translations from the server
   */
  public getTranslation(lang: string): Observable<Object> {
    // We load two files, one for the common translations and one for the specific translations
    const observables: Observable<any>[] = [];
    observables.push(this.http.get(`/assets/i18n/${lang}.json`));
    observables.push(this.http.get(`/api/backups/i18n/${lang}`));

    return forkJoin(observables).pipe(
      map((results) => {
        //We merge all the translations into one object
        const i18n: any = {};
        results.forEach((result) => {
          for (const key in result) {
            if (result.hasOwnProperty(key)) {
              i18n[key] = result[key];
            }
          }
        });
        return i18n;
      }),
    );
  }
}
