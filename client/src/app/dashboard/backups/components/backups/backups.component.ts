import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ButtonsModule, ContentModule, ModalService } from '@gboutte/glassui';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { BackupConfig } from '../../models/config/backup-config.model';
import { BackupsService } from '../../services/backups.service';
import { BackupConfigFormComponent } from '../config/backup-config-form/backup-config-form.component';
import { BackupsConfigSavesComponent } from '../config/backups-config-saves/backups-config-saves.component';

@Component({
  selector: 'mb-backups',
  templateUrl: './backups.component.html',
  styleUrls: ['./backups.component.scss'],
  standalone: true,
  imports: [ButtonsModule, ContentModule, RouterLink, TranslateModule],
})
export class BackupsComponent implements OnInit {
  private backupsService: BackupsService = inject(BackupsService);
  private modalService: ModalService = inject(ModalService);
  private translate: TranslateService = inject(TranslateService);
  protected backupConfigs: BackupConfig[] = [];

  public ngOnInit(): void {
    this.refresh();
  }

  private refresh(): void {
    this.backupsService
      .getBackupConfigs()
      .subscribe((configs: BackupConfig[]) => {
        this.backupConfigs = configs;
      });
  }
  protected add(): void {
    this.modalService
      .open(BackupConfigFormComponent, {
        title: this.translate.instant('dashboard.backups.modal.add.title'),
      })
      .subscribe({
        next: () => {
          this.refresh();
        },
      });
  }
  protected edit(config: BackupConfig): void {
    this.modalService
      .open(BackupConfigFormComponent, {
        title: this.translate.instant('dashboard.backups.modal.edit.title'),
        data: {
          config,
        },
      })
      .subscribe({
        next: () => {
          this.refresh();
        },
      });
  }

  protected saves(config: BackupConfig): void {
    this.modalService
      .open(BackupsConfigSavesComponent, {
        title: this.translate.instant('dashboard.backups.modal.saves.title'),
        data: {
          config,
        },
      })
      .subscribe({
        next: () => {
          this.refresh();
        },
      });
  }

  protected delete(config: BackupConfig): void {
    this.modalService
      .confirm(
        this.translate.instant('dashboard.backups.modal.delete.title'),
        this.translate.instant('dashboard.backups.modal.delete.description', {
          name: config.name,
        }),
        {
          yesLabel: this.translate.instant(
            'dashboard.backups.modal.delete.yes',
          ),
          noLabel: this.translate.instant('dashboard.backups.modal.delete.no'),
        },
      )
      .subscribe((result: boolean) => {
        if (result && config.id) {
          this.backupsService.deleteBackupConfig(config.id).subscribe(() => {
            this.refresh();
          });
        }
      });
  }

  protected runBackup(config: BackupConfig): void {
    this.modalService
      .confirm(
        this.translate.instant('dashboard.backups.modal.run.title'),
        this.translate.instant('dashboard.backups.modal.run.description', {
          name: config.name,
        }),
        {
          yesLabel: this.translate.instant('dashboard.backups.modal.run.yes'),
          noLabel: this.translate.instant('dashboard.backups.modal.run.no'),
        },
      )
      .subscribe((result: boolean) => {
        if (result && config.id) {
          this.backupsService.runBackup(config.id).subscribe(() => {
            this.refresh();
          });
        }
      });
  }
}
