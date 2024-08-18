import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { BackupType } from '../models/type/backup-type.model';
@Injectable()
export class BackupTranslateService {
  translateService: TranslateService;

  constructor(translateService: TranslateService) {
    this.translateService = translateService;
  }

  getTranslation(backupType: BackupType | string, key: string): any {
    if (typeof backupType === 'string') {
      return this.translateService.instant(`${backupType}.${key}`);
    } else {
      return this.translateService.instant(`${backupType.config.code}.${key}`);
    }
  }
}
