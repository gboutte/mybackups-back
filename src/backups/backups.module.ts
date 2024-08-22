import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BackupsController } from './backups.controller';
import { BackupsService } from './backups.service';
import { BackupConfigDestination } from './entities/backup-config-destination.entity';
import { BackupConfigSource } from './entities/backup-config-source.entity';
import { BackupConfig } from './entities/backup-config.entity';
import { BackupSaveDestination } from './entities/backup-save-destination.entity';
import { BackupSave } from './entities/backup-save.entity';

@Module({
  controllers: [BackupsController],
  providers: [BackupsService],
  imports: [
    TypeOrmModule.forFeature([
      BackupConfig,
      BackupConfigSource,
      BackupConfigDestination,
      BackupSave,
      BackupSaveDestination,
    ]),
  ],
})
export class BackupsModule {}
