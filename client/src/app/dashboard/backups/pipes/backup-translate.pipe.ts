import { Pipe, PipeTransform } from '@angular/core';
import { BackupType } from '../models/type/backup-type.model';
import { BackupTranslateService } from '../services/backup-translate.service';

@Pipe({
  name: 'backupTranslate',
})
export class BackupTranslatePipe implements PipeTransform {
  private backuptranslateService: BackupTranslateService;
  constructor(backuptranslateService: BackupTranslateService) {
    this.backuptranslateService = backuptranslateService;
  }

  transform(key: string, backuptype: string | BackupType): string {
    return this.backuptranslateService.getTranslation(backuptype, key);
  }
}
