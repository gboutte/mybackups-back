import { BackupParameterTypeEnum } from '../enums/backup-parameter-type.enum';

export interface BackupParameterInterface {
  name: string;
  description: string;
  type: BackupParameterTypeEnum;
  required: boolean;
}
