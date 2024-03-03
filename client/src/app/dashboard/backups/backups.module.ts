import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BackupsComponent } from './components/backups/backups.component';
import { BackupsRoutingModule } from './backups-routing.module';
import { BackupsService } from './services/backups.service';
import { BackupConfigFormComponent } from './components/config/backup-config-form/backup-config-form.component';
import {
  ButtonsModule,
  ContentModule,
  FormsModule,
  ModalModule,
  ToastModule,
  ToastService,
} from '@gboutte/glassui';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { BackupsConfigSettingsComponent } from './components/config/backups-config-settings/backups-config-settings.component';
import { SourceFormComponent } from './components/config/backups-config-settings/source-form/source-form.component';
import { DestinationFormComponent } from './components/config/backups-config-settings/destination-form/destination-form.component';

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
