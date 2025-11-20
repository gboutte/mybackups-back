import { HttpClient } from '@angular/common/http';
import { TranslateLoader } from '@ngx-translate/core';
import { forkJoin, map, Observable } from 'rxjs';

export type I18nRecords = Record<string, string>;

export class MultiTranslateHttpLoader implements TranslateLoader {
  constructor(private http: HttpClient) {}

  /**
   * Gets the translations from the server
   */
  public getTranslation(lang: string): Observable<I18nRecords> {
    // We load two files, one for the common translations and one for the specific translations
    const observables: Observable<I18nRecords>[] = [];
    observables.push(this.http.get<I18nRecords>(`/assets/i18n/${lang}.json`));
    observables.push(this.http.get<I18nRecords>(`/api/backups/i18n/${lang}`));

    return forkJoin(observables).pipe(
      map((results: I18nRecords[]): I18nRecords => {
        //We merge all the translations into one object
        const i18n: I18nRecords = {};
        results.forEach((result: I18nRecords): void => {
          for (const key in result) {
            i18n[key] = result[key];
          }
        });
        return i18n;
      }),
    );
  }
}
