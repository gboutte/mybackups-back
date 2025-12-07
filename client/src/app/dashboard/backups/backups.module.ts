import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import {
  ButtonsModule,
  ContentModule,
  FormsModule,
  ModalModule,
  ToastModule,
} from '@gboutte/glassui';
import { TranslateModule } from '@ngx-translate/core';
import { BackupsRoutingModule } from './backups-routing.module';
import { BackupsComponent } from './components/backups/backups.component';
import { BackupConfigFormComponent } from './components/config/backup-config-form/backup-config-form.component';
import { BackupsConfigSavesComponent } from './components/config/backups-config-saves/backups-config-saves.component';
import { BackupsConfigSettingsComponent } from './components/config/backups-config-settings/backups-config-settings.component';
import { EndpointFormComponent } from './components/config/backups-config-settings/endpoint-form/endpoint-form.component';
import { BackupTranslatePipe } from './pipes/backup-translate.pipe';
import { BackupTranslateService } from './services/backup-translate.service';
import { BackupsService } from './services/backups.service';

@NgModule({
  imports: [
    CommonModule,
    BackupsRoutingModule,
    ButtonsModule,
    TranslateModule,
    ModalModule,
    ReactiveFormsModule,
    FormsModule,
    ContentModule,
    ToastModule,
    BackupsComponent,
    BackupConfigFormComponent,
    BackupsConfigSettingsComponent,
    EndpointFormComponent,
    BackupTranslatePipe,
    BackupsConfigSavesComponent,
  ],
  providers: [BackupsService, BackupTranslateService],
})
export class BackupsModule {
  constructor(backupsService: BackupsService) {
    backupsService.loadBackupsStore().subscribe({
      next: () => {
        console.log('types loaded');
      },
      error: () => {
        console.log('error loading types');
      },
    });
  }
}
