import { inject, Pipe, PipeTransform } from '@angular/core';
import { BackupType } from '../models/type/backup-type.model';
import { BackupTranslateService } from '../services/backup-translate.service';

@Pipe({
  name: 'backupTranslate',
  standalone: true,
})
export class BackupTranslatePipe implements PipeTransform {
  private backuptranslateService: BackupTranslateService = inject(
    BackupTranslateService,
  );

  public transform(key: string, backuptype: string | BackupType): string {
    return this.backuptranslateService.getTranslation(backuptype, key);
  }
}
