import { Component, OnInit } from '@angular/core';
import { BackupsService } from '../../../../services/backups.service';
import { BackupType } from '../../../../models/type/backup-type.model';
import { SelectOptionInterface } from '@gboutte/glassui/lib/forms/selects/select-option.interface';
import { FormControl, FormGroup, Validators } from '@angular/forms';
import { BackupConfigSource } from '../../../../models/config/backup-config-source.model';
import { ToastService } from '@gboutte/glassui';
import { TranslateService } from '@ngx-translate/core';

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

  constructor(
    backupsService: BackupsService,
    toastService: ToastService,
    translateService: TranslateService,
  ) {
    this.backupsService = backupsService;
    this.toastService = toastService;
    this.translateService = translateService;
  }

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
        parameter.name,
        new FormControl(null, parameter.required ? [Validators.required] : []),
      );
    });
  }
  ngOnInit(): void {
    this.refreshTypes();

    this.type.valueChanges.subscribe((value) => {
      this.selectedType = this.types.find(
        (type) => type.config.code === value,
      )!;
      this.loadType(this.selectedType);
    });
  }

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
        this.sourceForm.disable();
        this.validating = true;
        // We call the backend to validate the parameters.
        const valid = true;

        if (valid) {
          //We add the source to the config
        }
      } else {
        this.toastService.alert({
          description: this.translateService.instant(
            'dashboard.backups-settings.modal.source.form.error',
          ),
          title: 'Error',
          icon: 'error',
        });
        this.sourceForm.updateAllValueAndValidity(this.sourceForm);
      }
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
