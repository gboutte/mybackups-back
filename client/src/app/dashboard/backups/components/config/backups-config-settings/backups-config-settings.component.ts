import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ModalService } from '@gboutte/glassui';
import { TranslateService } from '@ngx-translate/core';
import { BackupConfigDestination } from '../../../models/config/backup-config-destination.model';
import { BackupConfigSource } from '../../../models/config/backup-config-source.model';
import { BackupConfig } from '../../../models/config/backup-config.model';
import { BackupType } from '../../../models/type/backup-type.model';
import { BackupsService } from '../../../services/backups.service';
import { BackupsStore } from '../../../store/backups.store';
import { EndpointFormComponent } from './endpoint-form/endpoint-form.component';

@Component({
  selector: 'mb-backups-config-settings',
  templateUrl: './backups-config-settings.component.html',
  styleUrls: ['./backups-config-settings.component.scss'],
})
export class BackupsConfigSettingsComponent implements OnInit {
  private backupsService: BackupsService = inject(BackupsService);
  private modalService: ModalService = inject(ModalService);
  private translate: TranslateService = inject(TranslateService);
  private route: ActivatedRoute = inject(ActivatedRoute);
  private router: Router = inject(Router);
  private backupsStore: BackupsStore = inject(BackupsStore);
  protected types?: BackupType[];

  protected backupConfig!: BackupConfig;

  public ngOnInit(): void {
    if (this.route.snapshot.params['id'] !== undefined) {
      this.refreshConfig();
    } else {
      this.router.navigate(['dashboard', 'backups']);
    }

    this.types = this.backupsStore.types();
  }

  protected refreshConfig(): void {
    this.backupsService
      .getBackupConfig(this.route.snapshot.params['id'])
      .subscribe((config: BackupConfig): void => {
        this.backupConfig = config;
      });
  }

  protected addSource(): void {
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
        next: (res: boolean) => {
          if (res) {
            this.refreshConfig();
          }
        },
      });
  }
  protected editSource(source: BackupConfigSource): void {
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
        next: (res: boolean) => {
          if (res) {
            this.refreshConfig();
          }
        },
      });
  }

  protected deleteSource(source: BackupConfigSource): void {
    this.modalService
      .confirm(
        this.translate.instant(
          'dashboard.backups-settings.modal.source.delete.title',
        ),
        this.translate.instant(
          'dashboard.backups-settings.modal.source.delete.message',
        ),
      )
      .subscribe({
        next: (res: void) => {
          if (res) {
            this.backupsService.deleteSource(source.id).subscribe(() => {
              this.refreshConfig();
            });
          }
        },
      });
  }

  protected deleteDestination(destination: BackupConfigDestination): void {
    this.modalService
      .confirm(
        this.translate.instant(
          'dashboard.backups-settings.modal.destination.delete.title',
        ),
        this.translate.instant(
          'dashboard.backups-settings.modal.destination.delete.message',
        ),
      )
      .subscribe({
        next: (res: boolean) => {
          if (res) {
            this.backupsService
              .deleteDestination(destination.id)
              .subscribe(() => {
                this.refreshConfig();
              });
          }
        },
      });
  }

  protected addDestination(): void {
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
        next: (res: boolean) => {
          if (res) {
            this.refreshConfig();
          }
        },
      });
  }
  protected editDestination(destination: BackupConfigDestination): void {
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
        next: (res: boolean) => {
          if (res) {
            this.refreshConfig();
          }
        },
      });
  }
}
