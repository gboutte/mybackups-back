import { Module } from '@nestjs/common';
import { BackupsController } from './backups.controller';
import { BackupsService } from './backups.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BackupConfig } from './entities/backup-config.entity';
import { BackupConfigSource } from './entities/backup-config-source.entity';
import { BackupConfigDestination } from './entities/backup-config-destination.entity';
import { BackupSave } from './entities/backup-save.entity';
import { BackupSaveDestination } from './entities/backup-save-destination.entity';

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
