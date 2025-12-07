import { serializable } from 'serializr';
import { BackupParameterTypeEnum } from '../../../../../../../src/backups/backups-types/enums/backup-parameter-type.enum';

export class BackupTypeParameter {
  @serializable
  public code: string = '';
  @serializable
  public type: BackupParameterTypeEnum = BackupParameterTypeEnum.STRING;
  @serializable
  public required: boolean = false;
}
