import { list, object, serializable } from 'serializr';
import { BackupTypeParameter } from './backup-type-parameter.model';

export class BackupTypeConfigSource {
  @serializable
  isSource: boolean = false;
  @serializable(list(object(BackupTypeParameter)))
  parameters: BackupTypeParameter[] = [];
}
