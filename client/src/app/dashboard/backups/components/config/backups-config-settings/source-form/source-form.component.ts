import {Component, OnInit} from '@angular/core';
import {BackupsService} from "../../../../services/backups.service";
import {BackupType} from "../../../../models/type/backup-type.model";
import {SelectOptionInterface} from "@gboutte/glassui/lib/forms/selects/select-option.interface";
import {FormControl, FormGroup, Validators} from "@angular/forms";

@Component({
  selector: 'mb-source-form',
  templateUrl: './source-form.component.html',
  styleUrls: ['./source-form.component.scss']
})
export class SourceFormComponent implements OnInit{
  backupsService: BackupsService;

  types!: BackupType[];
  selectTypeOptions: SelectOptionInterface[] = [];

  sourceForm : FormGroup = new FormGroup({
    'type': new FormControl(null, [Validators.required]),
  });

  selectedType!: BackupType;


  constructor(
    backupsService: BackupsService,
  ) {
    this.backupsService = backupsService;
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

  ngOnInit(): void {
    this.refreshTypes();

    this.type.valueChanges.subscribe((value) => {
      this.selectedType = this.types.find((type) => type.config.code === value)!;
    });
  }

  get type() : FormControl {
    return this.sourceForm.get('type') as FormControl;
  }

}
