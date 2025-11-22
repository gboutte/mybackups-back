import { Component, inject } from '@angular/core';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ButtonsModule,
  CheckboxModule,
  InputsModule,
  ModalConfig,
  ModalRef,
} from '@gboutte/glassui';
import { TranslateModule } from '@ngx-translate/core';
import { BackupConfigCreateDto } from '../../../dto/backup-config-create.dto';
import { BackupConfigUpdateDto } from '../../../dto/backup-config-update.dto';
import { BackupsService } from '../../../services/backups.service';

@Component({
  selector: 'mb-backup-config-form',
  templateUrl: './backup-config-form.component.html',
  styleUrls: ['./backup-config-form.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    InputsModule,
    CheckboxModule,
    ButtonsModule,
    TranslateModule,
  ],
})
export class BackupConfigFormComponent {
  private backupsService: BackupsService = inject(BackupsService);
  private modalRef: ModalRef = inject(ModalRef);
  protected modalConfig: ModalConfig = inject(ModalConfig);

  protected configForm: FormGroup = new FormGroup({
    name: new FormControl('', [Validators.required]),
    frequency: new FormControl('* * * * *', [Validators.required]),
    enabled: new FormControl(true, [Validators.required]),
    to_keep: new FormControl(5, [Validators.required]),
  });

  constructor() {
    if (this.modalConfig.data?.config) {
      this.configForm.patchValue(this.modalConfig.data.config);
    }
  }

  protected save(): void {
    if (this.configForm.valid) {
      if (this.modalConfig.data?.config) {
        this.backupsService
          .updateBackupConfig(this.getBackupConfigUpdateDto())
          .subscribe(() => {
            this.modalRef.close(true);
          });
      } else {
        this.backupsService
          .createBackupConfig(this.getBackupConfigCreateDto())
          .subscribe(() => {
            this.modalRef.close(true);
          });
      }
    } else {
      console.log('form invalid');
    }
  }

  protected getBackupConfigCreateDto(): BackupConfigCreateDto {
    const backupConfigDto: BackupConfigCreateDto = new BackupConfigCreateDto();
    backupConfigDto.name = this.name.value;
    backupConfigDto.frequency = this.frequency.value;
    backupConfigDto.enabled = this.enabled.value;
    backupConfigDto.to_keep = this.to_keep.value;

    return backupConfigDto;
  }
  protected getBackupConfigUpdateDto(): BackupConfigUpdateDto {
    const backupConfigDto: BackupConfigUpdateDto = new BackupConfigUpdateDto();
    backupConfigDto.id = this.modalConfig.data.config.id;
    backupConfigDto.name = this.name.value;
    backupConfigDto.frequency = this.frequency.value;
    backupConfigDto.enabled = this.enabled.value;
    backupConfigDto.to_keep = this.to_keep.value;
    return backupConfigDto;
  }

  protected get name(): FormControl {
    return this.configForm.get('name') as FormControl;
  }

  protected get frequency(): FormControl {
    return this.configForm.get('frequency') as FormControl;
  }

  protected get enabled(): FormControl {
    return this.configForm.get('enabled') as FormControl;
  }

  protected get to_keep(): FormControl {
    return this.configForm.get('to_keep') as FormControl;
  }
}
