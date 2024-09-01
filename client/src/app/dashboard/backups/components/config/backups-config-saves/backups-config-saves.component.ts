import { Component } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalConfig, ModalRef, ModalService } from '@gboutte/glassui';
import { TranslateService } from '@ngx-translate/core';
import moment from 'moment';
import { BackupConfig } from '../../../models/config/backup-config.model';
import { BackupType } from '../../../models/type/backup-type.model';
import { BackupsService } from '../../../services/backups.service';
import { BackupsStore } from '../../../store/backups.store';

@Component({
  selector: 'mb-backups-config-saves',
  templateUrl: './backups-config-saves.component.html',
  styleUrls: ['./backups-config-saves.component.scss'],
})
export class BackupsConfigSavesComponent {
  private backupsService: BackupsService;
  private modalService: ModalService;
  private translate: TranslateService;
  private route: ActivatedRoute;
  private router: Router;
  private backupsStore: BackupsStore;
  modalRef!: ModalRef;
  modalConfig!: ModalConfig;

  types?: BackupType[];
  backupConfig!: BackupConfig;
  constructor(
    route: ActivatedRoute,
    backupsService: BackupsService,
    modalService: ModalService,
    translate: TranslateService,
    router: Router,
    backupsStore: BackupsStore,
    modalRef: ModalRef,
    modalConfig: ModalConfig,
  ) {
    this.backupsService = backupsService;
    this.modalService = modalService;
    this.translate = translate;
    this.route = route;
    this.router = router;
    this.backupsStore = backupsStore;
    this.modalRef = modalRef;
    this.modalConfig = modalConfig;

    if (this.modalConfig.data?.config) {
      this.refreshConfig();
    } else {
      this.modalRef.close();
    }

    this.types = this.backupsStore.types();
  }

  refreshConfig() {
    this.backupsService
      .getBackupConfig(this.modalConfig.data?.config.id)
      .subscribe((config: BackupConfig) => {
        this.backupConfig = config;
        console.log('config', config);
      });
  }

  downloadBackup(id: string) {
    this.backupsService.downloadBackup(id);
  }
  protected readonly moment = moment;
}
