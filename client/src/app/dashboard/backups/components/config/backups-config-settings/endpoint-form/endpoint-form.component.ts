import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ButtonsModule,
  CheckboxModule,
  ContentModule,
  InputsModule,
  ModalConfig,
  ModalRef,
  SelectsModule,
  ToastService,
} from '@gboutte/glassui';
import { SelectOptionInterface } from '@gboutte/glassui/lib/forms/selects/select-option.interface';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { BackupConfigDestinationDto } from '../../../../dto/backup-config-destination.dto';
import { BackupConfigSourceDto } from '../../../../dto/backup-config-source.dto';
import { BackupConfigDestination } from '../../../../models/config/backup-config-destination.model';
import { BackupConfigSource } from '../../../../models/config/backup-config-source.model';
import { BackupConfig } from '../../../../models/config/backup-config.model';
import { BackupTypeParameter } from '../../../../models/type/backup-type-parameter.model';
import { BackupType } from '../../../../models/type/backup-type.model';
import { BackupConfigTypeValidation } from '../../../../models/validation/backup-config-type-validation.model';
import { BackupTranslatePipe } from '../../../../pipes/backup-translate.pipe';
import { BackupTranslateService } from '../../../../services/backup-translate.service';
import { BackupsService } from '../../../../services/backups.service';
import { BackupsStore } from '../../../../store/backups.store';

@Component({
  selector: 'mb-endpoint-form',
  templateUrl: './endpoint-form.component.html',
  styleUrls: ['./endpoint-form.component.scss'],
  standalone: true,
  imports: [
    ReactiveFormsModule,
    SelectsModule,
    ContentModule,
    InputsModule,
    CheckboxModule,
    ButtonsModule,
    TranslateModule,
    BackupTranslatePipe,
  ],
})
export class EndpointFormComponent implements OnInit {
  private backupsService: BackupsService = inject(BackupsService);
  private toastService: ToastService = inject(ToastService);
  private translateService: TranslateService = inject(TranslateService);
  private backuptranslateService: BackupTranslateService = inject(
    BackupTranslateService,
  );
  private backupsStore: BackupsStore = inject(BackupsStore);
  private destroyRef: DestroyRef = inject(DestroyRef);

  protected modalConfig: ModalConfig = inject(ModalConfig);
  private modalRef: ModalRef = inject(ModalRef);

  protected validating: boolean = false;
  protected selectTypeOptions: SelectOptionInterface[] = [];
  private types!: BackupType[];

  private endpointType!: string;

  protected endpointForm: FormGroup = new FormGroup({
    type: new FormControl(null, [Validators.required]),
    parameters: new FormGroup({}),
  });

  protected selectedType!: BackupType;
  private backupConfig!: BackupConfig;

  /**
   * Load the types of backups and format them for the select component
   */
  private refreshTypes(): void {
    const types: BackupType[] = this.backupsStore.types();
    this.types = types.filter((type: BackupType): boolean => {
      if (this.endpointType === 'source') {
        return type.source.isSource;
      } else {
        return type.destination.isDestination;
      }
    });
    this.selectTypeOptions = this.types.map(
      (type: BackupType): { value: string; label: string } => {
        return {
          value: type.config.code,
          label: this.backuptranslateService.getTranslation(type, 'name'),
        };
      },
    );
  }

  /**
   * When a type is selected, we load the parameters of the type
   * The parameters are added to the form group
   */
  private loadType(type: BackupType): void {
    // We remove the previous parameters
    const controlsList: string[] = Object.keys(this.parameters.controls);
    controlsList.forEach((control: string) => {
      this.parameters.removeControl(control);
    });

    // We add the new parameters
    const parameters: BackupTypeParameter[] =
      this.endpointType === 'source'
        ? type.source.parameters
        : type.destination.parameters;
    parameters.forEach((parameter: BackupTypeParameter) => {
      this.parameters.addControl(
        parameter.code,
        new FormControl(null, parameter.required ? [Validators.required] : []),
      );
    });
  }

  public ngOnInit(): void {
    this.endpointType = this.modalConfig.data.type;

    this.refreshTypes();
    this.loadBackupConfig();
    this.listenToTypeChange();
  }
  private listenToTypeChange(): void {
    this.type.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value: string): void => {
        // If the type is the same, we don't do anything
        if (
          this.selectedType !== undefined &&
          this.selectedType.config.code === value
        )
          return;

        // We load the parameters of the new type
        this.selectedType = this.types.find(
          (type: BackupType) => type.config.code === value,
        )!;
        this.loadType(this.selectedType);
      });
  }

  /**
   * Load the backup config from the backend
   * Allow us to refresh the data in case it was updated by another user
   * We also load the source or destination if we are editing one
   */
  private loadBackupConfig(): void {
    const id: string = this.modalConfig.data.backupConfig.id;
    this.backupsService
      .getBackupConfig(id)
      .subscribe((config: BackupConfig) => {
        this.backupConfig = config;
        if (this.modalConfig.data.source) {
          const source: BackupConfigSource | undefined =
            this.backupConfig.sources.find(
              (source: BackupConfigSource): boolean =>
                source.id === this.modalConfig.data.source.id,
            );
          if (source) {
            this.endpointForm.patchValue(source);
          }
        }
        if (this.modalConfig.data.destination) {
          const destination: BackupConfigDestination | undefined =
            this.backupConfig.destinations.find(
              (destination: BackupConfigDestination): boolean =>
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
  private formControlToBackupEndpoint():
    | BackupConfigDestinationDto
    | BackupConfigSourceDto {
    const endpoint: BackupConfigDestinationDto | BackupConfigSourceDto =
      this.endpointType === 'source'
        ? new BackupConfigSourceDto()
        : new BackupConfigDestinationDto();

    endpoint.type = this.type.value;
    endpoint.parameters = {};

    Object.keys(this.parameters.controls).forEach((key: string): void => {
      const parameter: AbstractControl = this.parameters.controls[key];
      endpoint.parameters[key] = parameter.value;
    });
    return endpoint;
  }

  //@todo split into smaller methods
  protected submit(): void {
    if (!this.endpointForm.disabled) {
      if (this.endpointForm.valid) {
        const endpoint: BackupConfigDestinationDto | BackupConfigSourceDto =
          this.formControlToBackupEndpoint();

        this.endpointForm.disable();

        this.validating = true;
        // We call the backend to validate the parameters.
        this.validate(endpoint).subscribe((res: BackupConfigTypeValidation) => {
          if (res.valid && this.backupConfig.id) {
            if (this.endpointType === 'source') {
              // Handling the source
              if (this.modalConfig.data.source) {
                this.backupsService
                  .updateSource(this.modalConfig.data.source.id, endpoint)
                  .subscribe({
                    next: () => {
                      this.successAlert();
                      this.modalRef.close(true);
                    },
                  });
              } else {
                this.backupsService
                  .createSource(this.backupConfig.id, endpoint)
                  .subscribe({
                    next: () => {
                      this.successAlert();
                      this.modalRef.close(true);
                    },
                  });
              }
            }
            if (this.endpointType === 'destination') {
              // Handling the source
              if (this.modalConfig.data.destination) {
                this.backupsService
                  .updateDestination(
                    this.modalConfig.data.destination.id,
                    endpoint,
                  )
                  .subscribe({
                    next: () => {
                      this.successAlert();
                      this.modalRef.close(true);
                    },
                  });
              } else {
                this.backupsService
                  .createDestination(this.backupConfig.id, endpoint)
                  .subscribe({
                    next: () => {
                      this.successAlert();
                      this.modalRef.close(true);
                    },
                  });
              }
            }
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

  private validate(
    source: BackupConfigDestinationDto | BackupConfigSourceDto,
  ): Observable<BackupConfigTypeValidation> {
    return this.backupsService.validateConfigEndpoint(source);
  }

  private handleValidationResult(result: BackupConfigTypeValidation): void {
    for (const error of result.errors) {
      this.getParameterControl(error.parameter).setErrors({
        message: error.message,
      });
    }
  }

  protected get type(): FormControl {
    return this.endpointForm.get('type') as FormControl;
  }

  protected get parameters(): FormGroup {
    return this.endpointForm.get('parameters') as FormGroup;
  }

  protected getParameterControl(key: string): FormControl {
    return this.parameters.get(key) as FormControl;
  }

  private successAlert(): void {
    this.toastService.alert({
      description: this.translateService.instant(
        'dashboard.backups-settings.modal.endpoint.form.success.description',
      ),
      title: this.translateService.instant(
        'dashboard.backups-settings.modal.endpoint.form.success.title',
      ),
      icon: 'success',
    });
  }
}
