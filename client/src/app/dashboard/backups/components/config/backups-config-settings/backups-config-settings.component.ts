import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from '@gboutte/glassui';
import { TranslateService } from '@ngx-translate/core';
import { BackupConfigSource } from '../../../models/config/backup-config-source.model';
import { BackupConfig } from '../../../models/config/backup-config.model';
import { BackupsService } from '../../../services/backups.service';
import { EndpointFormComponent } from './endpoint-form/endpoint-form.component';
import {BackupConfigDestination} from "../../../models/config/backup-config-destination.model";

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
      .open(EndpointFormComponent, {
        data: {
          backupConfig: this.backupConfig,
          type: 'source',
        },
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
      .open(EndpointFormComponent, {
        data: {
          backupConfig: this.backupConfig,
          source,
          type: 'source',
        },
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
      .open(EndpointFormComponent, {
        title: this.translate.instant(
          'dashboard.backups-settings.modal.destination.add.title',
        ),
        data: {
          backupConfig: this.backupConfig,
          type: 'destination',
        },
      })
      .subscribe({
        next: (res) => {
          if (res) {
            this.refreshConfig();
          }
        },
      });
  }
  editDestination(destination: BackupConfigDestination) {
    this.modalService
      .open(EndpointFormComponent, {
        title: this.translate.instant(
          'dashboard.backups-settings.modal.destination.edit.title',
        ),
        data: {
          backupConfig: this.backupConfig,
          type: 'destination',
          destination,
        },
      })
      .subscribe({
        next: (res) => {
          if (res) {
            this.refreshConfig();
          }
        },
      });
  }
}
