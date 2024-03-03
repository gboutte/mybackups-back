import { serializable } from 'serializr';
import { BackupParameterTypeEnum } from '../../../../../../../src/backups/backups-types/enums/backup-parameter-type.enum';

export class BackupTypeParameter {
  @serializable
  code: string = '';
  @serializable
  name: string = '';
  @serializable
  description: string = '';
  @serializable
  type: BackupParameterTypeEnum = BackupParameterTypeEnum.STRING;
  @serializable
  required: boolean = false;
}
