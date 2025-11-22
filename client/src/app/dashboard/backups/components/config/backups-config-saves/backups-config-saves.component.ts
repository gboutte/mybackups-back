import { NgFor, NgIf } from '@angular/common';
import { Component, inject } from '@angular/core';
import {
  ButtonsModule,
  ContentModule,
  ModalConfig,
  ModalRef,
  ModalService,
} from '@gboutte/glassui';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import { BackupConfig } from '../../../models/config/backup-config.model';
import { BackupSave } from '../../../models/save/backup-save.model';
import { BackupType } from '../../../models/type/backup-type.model';
import { BackupsService } from '../../../services/backups.service';
import { BackupsStore } from '../../../store/backups.store';

@Component({
  selector: 'mb-backups-config-saves',
  templateUrl: './backups-config-saves.component.html',
  styleUrls: ['./backups-config-saves.component.scss'],
  standalone: true,
  imports: [NgIf, ContentModule, NgFor, ButtonsModule, TranslateModule],
})
export class BackupsConfigSavesComponent {
  private backupsService: BackupsService = inject(BackupsService);
  private modalService: ModalService = inject(ModalService);
  private translate: TranslateService = inject(TranslateService);
  private backupsStore: BackupsStore = inject(BackupsStore);
  private modalRef: ModalRef = inject(ModalRef);
  private modalConfig: ModalConfig = inject(ModalConfig);

  private types?: BackupType[];
  protected backupConfig!: BackupConfig;
  constructor() {
    if (this.modalConfig.data?.config) {
      this.refreshConfig();
    } else {
      this.modalRef.close();
    }

    this.types = this.backupsStore.types();
  }

  private refreshConfig(): void {
    this.backupsService
      .getBackupConfig(this.modalConfig.data?.config.id)
      .subscribe((config: BackupConfig) => {
        this.backupConfig = config;
      });
  }

  protected downloadBackup(id: string): void {
    this.backupsService.downloadBackupSave(id);
  }
  protected deleteBackupSave(save: BackupSave): void {
    this.modalService
      .confirm(
        this.translate.instant(
          'dashboard.backups.modal.saves.modal.delete.title',
        ),
        this.translate.instant(
          'dashboard.backups.modal.saves.modal.delete.description',
          {
            date: moment(save.date_created).format('DD/MM/YYYY HH:mm'),
          },
        ),
        {
          yesLabel: this.translate.instant(
            'dashboard.backups.modal.saves.modal.delete.yes',
          ),
          noLabel: this.translate.instant(
            'dashboard.backups.modal.saves.modal.delete.no',
          ),
        },
      )
      .subscribe((result: boolean) => {
        if (result) {
          this.backupsService.deleteBackupSave(save.id).subscribe(() => {
            this.refreshConfig();
          });
        }
      });
  }
  protected readonly moment: typeof moment = moment;
}
