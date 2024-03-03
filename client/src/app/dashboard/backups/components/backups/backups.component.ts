import { Component, OnInit } from '@angular/core';
import { ModalService } from '@gboutte/glassui';
import { TranslateService } from '@ngx-translate/core';
import { BackupConfig } from '../../models/config/backup-config.model';
import { BackupsService } from '../../services/backups.service';
import { BackupConfigFormComponent } from '../config/backup-config-form/backup-config-form.component';

@Component({
  selector: 'mb-backups',
  templateUrl: './backups.component.html',
  styleUrls: ['./backups.component.scss'],
})
export class BackupsComponent implements OnInit {
  private backupsService: BackupsService;
  private modalService: ModalService;
  private translate: TranslateService;

  backupConfigs: BackupConfig[] = [];
  constructor(
    backupsService: BackupsService,
    modalService: ModalService,
    translate: TranslateService,
  ) {
    this.backupsService = backupsService;
    this.modalService = modalService;
    this.translate = translate;
  }

  ngOnInit(): void {
    this.refresh();
  }

  refresh() {
    this.backupsService
      .getBackupConfigs()
      .subscribe((configs: BackupConfig[]) => {
        this.backupConfigs = configs;
      });
  }
  add() {
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
  edit(config: BackupConfig) {
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
}
