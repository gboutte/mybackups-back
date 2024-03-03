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
import { BackupsConfigSettingsComponent } from './components/config/backups-config-settings/backups-config-settings.component';
import { DestinationFormComponent } from './components/config/backups-config-settings/destination-form/destination-form.component';
import { SourceFormComponent } from './components/config/backups-config-settings/source-form/source-form.component';
import { BackupsService } from './services/backups.service';

@NgModule({
  declarations: [
    BackupsComponent,
    BackupConfigFormComponent,
    BackupsConfigSettingsComponent,
    SourceFormComponent,
    DestinationFormComponent,
  ],
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
  ],
  providers: [BackupsService],
})
export class BackupsModule {}
