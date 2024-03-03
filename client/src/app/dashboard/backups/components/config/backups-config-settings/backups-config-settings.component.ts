import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from '@gboutte/glassui';
import { TranslateService } from '@ngx-translate/core';
import { BackupConfigSource } from '../../../models/config/backup-config-source.model';
import { BackupConfig } from '../../../models/config/backup-config.model';
import { BackupsService } from '../../../services/backups.service';
import { DestinationFormComponent } from './destination-form/destination-form.component';
import { SourceFormComponent } from './source-form/source-form.component';

@Component({
  selector: 'mb-backups-config-settings',
  templateUrl: './backups-config-settings.component.html',
  styleUrls: ['./backups-config-settings.component.scss'],
})
export class BackupsConfigSettingsComponent implements OnInit {
  private backupsService: BackupsService;
  private modalService: ModalService;
  private translate: TranslateService;
  private route: ActivatedRoute;
  private router: Router;

  backupConfig!: BackupConfig;
  constructor(
    route: ActivatedRoute,
    backupsService: BackupsService,
    modalService: ModalService,
    translate: TranslateService,
    router: Router,
  ) {
    this.backupsService = backupsService;
    this.modalService = modalService;
    this.translate = translate;
    this.route = route;
    this.router = router;
  }

  ngOnInit(): void {
    if (this.route.snapshot.params['id'] !== undefined) {
      this.refreshConfig();
    } else {
      this.router.navigate(['dashboard', 'backups']);
    }
  }

  refreshConfig() {
    this.backupsService
      .getBackupConfig(this.route.snapshot.params['id'])
      .subscribe((config: BackupConfig) => {
        this.backupConfig = config;
      });
  }

  addSource() {
    this.modalService
      .open(SourceFormComponent, {
        data: { backupConfig: this.backupConfig },
        title: this.translate.instant(
          'dashboard.backups-settings.modal.source.add.title',
        ),
      })
      .subscribe({
        next: (res) => {
          if (res) {
            this.refreshConfig();
          }
        },
      });
  }
  editSource(source: BackupConfigSource) {
    this.modalService
      .open(SourceFormComponent, {
        data: { backupConfig: this.backupConfig, source },
        title: this.translate.instant(
          'dashboard.backups-settings.modal.source.edit.title',
        ),
      })
      .subscribe({
        next: (res) => {
          if (res) {
            this.refreshConfig();
          }
        },
      });
  }
  addDestination() {
    this.modalService
      .open(DestinationFormComponent, {
        title: this.translate.instant(
          'dashboard.backups-settings.modal.destination.add.title',
        ),
      })
      .subscribe({});
  }
}
