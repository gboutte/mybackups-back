import { list, object, serializable } from 'serializr';
import { BackupTypeParameter } from './backup-type-parameter.model';

export class BackupTypeConfigDestination {
  @serializable
  public isDestination: boolean = false;
  @serializable(list(object(BackupTypeParameter)))
  public parameters: BackupTypeParameter[] = [];
}
