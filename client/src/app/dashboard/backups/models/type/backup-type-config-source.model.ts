import { list, object, serializable } from 'serializr';
import { BackupTypeParameter } from './backup-type-parameter.model';

export class BackupTypeConfigSource {
  @serializable
  public isSource: boolean = false;
  @serializable(list(object(BackupTypeParameter)))
  public parameters: BackupTypeParameter[] = [];
}
