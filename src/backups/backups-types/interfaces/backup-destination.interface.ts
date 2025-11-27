import { ReadStream } from 'fs';
import { BackupSaveDestination } from '../../entities/backup-save-destination.entity';
import { BackupDestinationResultInterface } from './backup-destination-result.interface';
import { BackupParameterErrorInterface } from './backup-parameter-error.interface';
import { BackupParameterInterface } from './backup-parameter.interface';

export interface BackupDestinationInterface {
  getDestinationParameters(): BackupParameterInterface[];

  doDestination(
    absolutePathToTemporaryBackup: string,
  ): Promise<BackupDestinationResultInterface>;

  validateDestinationParameters(): true | BackupParameterErrorInterface[];

  deleteBackup(backupSave: BackupSaveDestination): Promise<boolean>;

  getBackup(backupSave: BackupSaveDestination): Promise<ReadStream>;
}

export function instanceOfBackupDestination(
  object: object,
): object is BackupDestinationInterface {
  return (
    'deleteBackup' in object &&
    'getBackup' in object &&
    'getDestinationParameters' in object &&
    'doDestination' in object &&
    'validateDestinationParameters' in object
  );
}
