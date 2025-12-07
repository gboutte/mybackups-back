import { BackupParameterTypeEnum } from '../enums/backup-parameter-type.enum';

export interface BackupParameterInterface {
  code: string;
  type: BackupParameterTypeEnum;
  required: boolean;
}
