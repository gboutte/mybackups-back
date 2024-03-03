import { Component } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalConfig, ModalRef } from '@gboutte/glassui';
import { SelectOptionInterface } from '@gboutte/glassui/lib/forms/selects/select-option.interface';
import { BackupConfig } from '../../../models/config/backup-config.model';
import { BackupType } from '../../../models/type/backup-type.model';
import { BackupsService } from '../../../services/backups.service';

@Component({
  selector: 'mb-backup-config-form',
  templateUrl: './backup-config-form.component.html',
  styleUrls: ['./backup-config-form.component.scss'],
})
export class BackupConfigFormComponent {
  backupsService: BackupsService;
  backupTypes!: BackupType[];
  backupTypesSelectOptions!: SelectOptionInterface[];
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
      console.log(this.modalConfig.data.config);
    }
    this.backupsService.getTypes().subscribe((types: BackupType[]) => {
      this.backupTypes = types;
      this.backupTypesSelectOptions = types.map((type: BackupType) => {
        return { value: type.config.code, label: type.config.name };
      });
    });
  }

  save() {
    if (this.configForm.valid) {
      if (this.modalConfig.data?.config) {
        this.backupsService
          .patchBackupConfig(
            this.modalConfig.data?.config.id,
            this.getBackupConfig(),
          )
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
    const backupConfig = new BackupConfig();
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
