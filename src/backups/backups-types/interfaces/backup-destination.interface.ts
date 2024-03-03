import { BackupParameterErrorInterface } from './backup-parameter-error.interface';
import { BackupParameterInterface } from './backup-parameter.interface';
import { BackupDestinationResultInterface } from './backup-destination-result.interface';

export interface BackupDestinationInterface {
  getDestinationParameters(): BackupParameterInterface[];

  doDestination(
    pathToTemporaryBackup: string,
  ): Promise<BackupDestinationResultInterface>;

  validateDestinationParameters(): true | BackupParameterErrorInterface[];
}

export function instanceOfBackupDestination(
  object: any,
): object is BackupDestinationInterface {
  return (
    'getDestinationParameters' in object &&
    'doDestination' in object &&
    'validateDestinationParameters' in object
  );
}
