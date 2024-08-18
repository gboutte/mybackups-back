import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalConfig, ModalRef } from '@gboutte/glassui';
import { BackupConfig } from '../../../models/config/backup-config.model';
import { BackupsService } from '../../../services/backups.service';

@Component({
  selector: 'mb-backup-config-form',
  templateUrl: './backup-config-form.component.html',
  styleUrls: ['./backup-config-form.component.scss'],
})
export class BackupConfigFormComponent {
  backupsService: BackupsService;
  modalRef!: ModalRef;
  modalConfig!: ModalConfig;

  configForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    frequency: new FormControl('* * * * *', [Validators.required]),
    enabled: new FormControl(true, [Validators.required]),
    to_keep: new FormControl(5, [Validators.required]),
  });

  constructor(
    backupsService: BackupsService,
    modalRef: ModalRef,
    modalConfig: ModalConfig,
  ) {
    this.backupsService = backupsService;
    this.modalRef = modalRef;
    this.modalConfig = modalConfig;
    if (this.modalConfig.data?.config) {
      this.configForm.patchValue(this.modalConfig.data.config);
    }
  }

  save() {
    if (this.configForm.valid) {
      if (this.modalConfig.data?.config) {
        this.backupsService
          .updateBackupConfig(this.getBackupConfig())
          .subscribe((config: BackupConfig) => {
            this.modalRef.close(true);
          });
      } else {
        this.backupsService
          .createBackupConfig(this.getBackupConfig())
          .subscribe((config: BackupConfig) => {
            this.modalRef.close(true);
          });
      }
    } else {
      console.log('form invalid');
    }
  }

  getBackupConfig() {
    const backupConfig =
      (this.modalConfig.data?.config as BackupConfig) || new BackupConfig();
    backupConfig.name = this.name.value;
    backupConfig.frequency = this.frequency.value;
    backupConfig.enabled = this.enabled.value;
    backupConfig.to_keep = this.to_keep.value;
    return backupConfig;
  }

  get name(): FormControl {
    return this.configForm.get('name') as FormControl;
  }

  get frequency(): FormControl {
    return this.configForm.get('frequency') as FormControl;
  }

  get enabled(): FormControl {
    return this.configForm.get('enabled') as FormControl;
  }

  get to_keep(): FormControl {
    return this.configForm.get('to_keep') as FormControl;
  }
}
