import { object, serializable } from 'serializr';
import { BackupTypeConfigDestination } from './backup-type-config-destination.model';
import { BackupTypeConfigSource } from './backup-type-config-source.model';
import { BackupTypeConfig } from './backup-type-config.model';

export class BackupType {
  @serializable(object(BackupTypeConfig))
  public config!: BackupTypeConfig;
  @serializable(object(BackupTypeConfigSource))
  public source!: BackupTypeConfigSource;
  @serializable(object(BackupTypeConfigDestination))
  public destination!: BackupTypeConfigDestination;
}
