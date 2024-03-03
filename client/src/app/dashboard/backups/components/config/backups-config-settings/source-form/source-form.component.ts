import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalConfig, ModalRef, ToastService } from '@gboutte/glassui';
import { SelectOptionInterface } from '@gboutte/glassui/lib/forms/selects/select-option.interface';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { BackupConfigSource } from '../../../../models/config/backup-config-source.model';
import { BackupConfig } from '../../../../models/config/backup-config.model';
import { BackupType } from '../../../../models/type/backup-type.model';
import { BackupConfigTypeValidation } from '../../../../models/validation/backup-config-type-validation.model';
import { BackupsService } from '../../../../services/backups.service';

@Component({
  selector: 'mb-source-form',
  templateUrl: './source-form.component.html',
  styleUrls: ['./source-form.component.scss'],
})
export class SourceFormComponent implements OnInit {
  backupsService: BackupsService;
  toastService: ToastService;
  translateService: TranslateService;
  validating: boolean = false;
  types!: BackupType[];
  selectTypeOptions: SelectOptionInterface[] = [];

  sourceForm: FormGroup = new FormGroup({
    type: new FormControl(null, [Validators.required]),
    parameters: new FormGroup({}),
  });

  selectedType!: BackupType;
  backupConfig!: BackupConfig;
  modalRef!: ModalRef;
  modalConfig!: ModalConfig;

  constructor(
    backupsService: BackupsService,
    toastService: ToastService,
    translateService: TranslateService,
    modalConfig: ModalConfig,
    modalRef: ModalRef,
  ) {
    this.backupsService = backupsService;
    this.toastService = toastService;
    this.translateService = translateService;
    this.modalRef = modalRef;
    this.modalConfig = modalConfig;
  }

  /**
   * Load the types of backups and format them for the select component
   */
  refreshTypes() {
    this.backupsService.getTypes().subscribe((types) => {
      this.types = types.filter((type) => type.source.isSource);
      this.selectTypeOptions = this.types.map((type) => {
        return {
          value: type.config.code,
          label: type.config.name,
        };
      });
    });
  }

  /**
   * When a type is selected, we load the parameters of the type
   * The parameters are added to the form group
   */
  loadType(type: BackupType) {
    // We remove the previous parameters
    const controlsList = Object.keys(this.parameters.controls);
    controlsList.forEach((control) => {
      this.parameters.removeControl(control);
    });

    // We add the new parameters
    const parameters = type.source.parameters;
    parameters.forEach((parameter) => {
      this.parameters.addControl(
        parameter.code,
        new FormControl(null, parameter.required ? [Validators.required] : []),
      );
    });
  }

  ngOnInit(): void {
    this.refreshTypes();

    this.loadBackupConfig();

    this.type.valueChanges.subscribe((value) => {
      // If the type is the same, we don't do anything
      if (
        this.selectedType !== undefined &&
        this.selectedType.config.code === value
      )
        return;

      // We load the parameters of the new type
      this.selectedType = this.types.find(
        (type) => type.config.code === value,
      )!;
      this.loadType(this.selectedType);
    });
  }

  /**
   * Load the backup config from the backend
   * Allow us to refresh the data in case it was updated by another user
   * We also load the source if we are editing one
   */
  loadBackupConfig() {
    const id = this.modalConfig.data.backupConfig.id;
    this.backupsService
      .getBackupConfig(id)
      .subscribe((config: BackupConfig) => {
        this.backupConfig = config;
        if (this.modalConfig.data.source) {
          const source = this.backupConfig.sources.find(
            (source) => source.id === this.modalConfig.data.source.id,
          );
          if (source) {
            this.sourceForm.patchValue(source);
          }
        }
      });
  }

  /**
   * Convert the form control to a backup source
   */
  formControlToBackupSource() {
    const source = new BackupConfigSource();
    source.type = this.type.value;
    source.parameters = {};

    Object.keys(this.parameters.controls).forEach((key) => {
      const parameter = this.parameters.controls[key];
      source.parameters[key] = parameter.value;
    });
    return source;
  }

  submit() {
    if (!this.sourceForm.disabled) {
      if (this.sourceForm.valid) {
        const source = this.formControlToBackupSource();

        this.sourceForm.disable();

        this.validating = true;
        // We call the backend to validate the parameters.
        this.validate(source).subscribe((res: BackupConfigTypeValidation) => {
          if (res.valid) {
            const backupConfig = this.backupConfig;
            if (this.modalConfig.data.source) {
              const index = backupConfig.sources.findIndex(
                (source) => source.id === this.modalConfig.data.source.id,
              );
              backupConfig.sources[index] = source;
            } else {
              backupConfig.sources.push(source);
            }
            this.updateBackupConfig(backupConfig);
          } else {
            this.sourceForm.enable();
            this.validating = false;
            this.handleValidationResult(res);
          }
        });
      } else {
        this.toastService.alert({
          description: this.translateService.instant(
            'dashboard.backups-settings.modal.source.form.error.description',
          ),
          title: this.translateService.instant(
            'dashboard.backups-settings.modal.source.form.error.title',
          ),
          icon: 'error',
        });
        this.sourceForm.updateAllValueAndValidity(this.sourceForm);
      }
    }
  }

  updateBackupConfig(backupConfig: BackupConfig) {
    this.backupsService.updateBackupConfig(backupConfig).subscribe(() => {
      this.toastService.alert({
        description: this.translateService.instant(
          'dashboard.backups-settings.modal.source.form.success.description',
        ),
        title: this.translateService.instant(
          'dashboard.backups-settings.modal.source.form.success.title',
        ),
        icon: 'success',
      });
      this.modalRef.close(true);
    });
  }

  validate(source: BackupConfigSource): Observable<BackupConfigTypeValidation> {
    return this.backupsService.validateConfigSource(source);
  }

  handleValidationResult(result: BackupConfigTypeValidation) {
    for (let error of result.errors) {
      this.getParameterControl(error.parameter).setErrors({
        message: error.message,
      });
    }
  }

  get type(): FormControl {
    return this.sourceForm.get('type') as FormControl;
  }

  get parameters(): FormGroup {
    return this.sourceForm.get('parameters') as FormGroup;
  }

  getParameterControl(key: string): FormControl {
    return this.parameters.get(key) as FormControl;
  }
}
