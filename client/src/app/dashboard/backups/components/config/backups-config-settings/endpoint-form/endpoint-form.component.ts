import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { ModalConfig, ModalRef, ToastService } from '@gboutte/glassui';
import { SelectOptionInterface } from '@gboutte/glassui/lib/forms/selects/select-option.interface';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { BackupConfigDestination } from '../../../../models/config/backup-config-destination.model';
import { BackupConfigSource } from '../../../../models/config/backup-config-source.model';
import { BackupConfig } from '../../../../models/config/backup-config.model';
import { BackupType } from '../../../../models/type/backup-type.model';
import { BackupConfigTypeValidation } from '../../../../models/validation/backup-config-type-validation.model';
import { BackupTranslateService } from '../../../../services/backup-translate.service';
import { BackupsService } from '../../../../services/backups.service';
import { BackupsStore } from '../../../../store/backups.store';

@Component({
  selector: 'mb-endpoint-form',
  templateUrl: './endpoint-form.component.html',
  styleUrls: ['./endpoint-form.component.scss'],
})
export class EndpointFormComponent implements OnInit {
  backupsService: BackupsService;
  toastService: ToastService;
  translateService: TranslateService;
  private backuptranslateService: BackupTranslateService;
  private backupsStore: BackupsStore;
  validating: boolean = false;
  types!: BackupType[];
  selectTypeOptions: SelectOptionInterface[] = [];

  endpointType!: string;

  endpointForm: FormGroup = new FormGroup({
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
    backuptranslateService: BackupTranslateService,
    backupsStore: BackupsStore,
  ) {
    this.backupsService = backupsService;
    this.toastService = toastService;
    this.translateService = translateService;
    this.modalRef = modalRef;
    this.modalConfig = modalConfig;
    this.backuptranslateService = backuptranslateService;
    this.backupsStore = backupsStore;
  }

  /**
   * Load the types of backups and format them for the select component
   */
  refreshTypes() {
    const types = this.backupsStore.types();
    this.types = types.filter((type) => {
      if (this.endpointType === 'source') {
        return type.source.isSource;
      } else {
        return type.destination.isDestination;
      }
    });
    this.selectTypeOptions = this.types.map((type) => {
      return {
        value: type.config.code,
        label: this.backuptranslateService.getTranslation(type, 'name'),
      };
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
    const parameters =
      this.endpointType === 'source'
        ? type.source.parameters
        : type.destination.parameters;
    parameters.forEach((parameter) => {
      this.parameters.addControl(
        parameter.code,
        new FormControl(null, parameter.required ? [Validators.required] : []),
      );
    });
  }

  ngOnInit(): void {
    this.endpointType = this.modalConfig.data.type;

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
   * We also load the source or destination if we are editing one
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
            this.endpointForm.patchValue(source);
          }
        }
        if (this.modalConfig.data.destination) {
          const destination = this.backupConfig.destinations.find(
            (destination) =>
              destination.id === this.modalConfig.data.destination.id,
          );
          if (destination) {
            this.endpointForm.patchValue(destination);
          }
        }
      });
  }

  /**
   * Convert the form control to a backup source
   */
  formControlToBackupEndpoint() {
    const endpoint =
      this.endpointType === 'source'
        ? new BackupConfigSource()
        : new BackupConfigDestination();

    endpoint.type = this.type.value;
    endpoint.parameters = {};

    Object.keys(this.parameters.controls).forEach((key) => {
      const parameter = this.parameters.controls[key];
      endpoint.parameters[key] = parameter.value;
    });
    return endpoint;
  }

  submit() {
    if (!this.endpointForm.disabled) {
      if (this.endpointForm.valid) {
        const endpoint = this.formControlToBackupEndpoint();

        this.endpointForm.disable();

        this.validating = true;
        // We call the backend to validate the parameters.
        this.validate(endpoint).subscribe((res: BackupConfigTypeValidation) => {
          if (res.valid) {
            const backupConfig = this.backupConfig;

            if (this.endpointType === 'source') {
              // Handling the source
              if (this.modalConfig.data.source) {
                const index = backupConfig.sources.findIndex(
                  (source) => source.id === this.modalConfig.data.source.id,
                );
                backupConfig.sources[index] = endpoint;
              } else {
                backupConfig.sources.push(endpoint);
              }
            }
            if (this.endpointType === 'destination') {
              // Handling the destination
              if (this.modalConfig.data.destination) {
                const index = backupConfig.destinations.findIndex(
                  (destination) =>
                    destination.id === this.modalConfig.data.destination.id,
                );
                backupConfig.destinations[index] = endpoint;
              } else {
                backupConfig.destinations.push(endpoint);
              }
            }
            //@tood change type
            this.updateBackupConfig(backupConfig);
          } else {
            this.endpointForm.enable();
            this.validating = false;
            this.handleValidationResult(res);
          }
        });
      } else {
        this.toastService.alert({
          description: this.translateService.instant(
            'dashboard.backups-settings.modal.endpoint.form.error.description',
          ),
          title: this.translateService.instant(
            'dashboard.backups-settings.modal.endpoint.form.error.title',
          ),
          icon: 'error',
        });
        this.endpointForm.updateAllValueAndValidity(this.endpointForm);
      }
    }
  }

  updateBackupConfig(backupConfig: BackupConfig) {
    this.backupsService.updateBackupConfig(backupConfig).subscribe(() => {
      this.toastService.alert({
        description: this.translateService.instant(
          'dashboard.backups-settings.modal.endpoint.form.success.description',
        ),
        title: this.translateService.instant(
          'dashboard.backups-settings.modal.endpoint.form.success.title',
        ),
        icon: 'success',
      });
      this.modalRef.close(true);
    });
  }

  validate(
    source: BackupConfigSource | BackupConfigDestination,
  ): Observable<BackupConfigTypeValidation> {
    return this.backupsService.validateConfigEndpoint(source);
  }

  handleValidationResult(result: BackupConfigTypeValidation) {
    for (let error of result.errors) {
      this.getParameterControl(error.parameter).setErrors({
        message: error.message,
      });
    }
  }

  get type(): FormControl {
    return this.endpointForm.get('type') as FormControl;
  }

  get parameters(): FormGroup {
    return this.endpointForm.get('parameters') as FormGroup;
  }

  getParameterControl(key: string): FormControl {
    return this.parameters.get(key) as FormControl;
  }
}
