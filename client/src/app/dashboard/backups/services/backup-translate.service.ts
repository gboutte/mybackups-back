import { inject, Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BackupType } from '../models/type/backup-type.model';
@Injectable()
export class BackupTranslateService {
  private translateService: TranslateService = inject(TranslateService);

  public getTranslation(backupType: BackupType | string, key: string): string {
    if (typeof backupType === 'string') {
      return this.translateService.instant(`${backupType}.${key}`);
    } else {
      return this.translateService.instant(`${backupType.config.code}.${key}`);
    }
  }
}
