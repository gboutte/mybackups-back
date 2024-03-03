import { BackupParameterInterface } from './backup-parameter.interface';
import { BackupParameterErrorInterface } from './backup-parameter-error.interface';
import { BackupSourceResultInterface } from './backup-source-result.interface';

export interface BackupSourceInterface {
  getSourceParameters(): BackupParameterInterface[];

  doSource(): Promise<BackupSourceResultInterface>;

  validateSourceParameters(): true | BackupParameterErrorInterface[];
}

export function instanceOfBackupSource(
  object: any,
): object is BackupSourceInterface {
  return (
    'getSourceParameters' in object &&
    'doSource' in object &&
    'validateSourceParameters' in object
  );
}
