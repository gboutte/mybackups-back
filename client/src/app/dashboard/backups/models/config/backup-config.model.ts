import { list, object, serializable } from 'serializr';
import { date } from '../../../../global/date-serializable';
import { BackupSave } from '../save/backup-save.model';
import { BackupConfigDestination } from './backup-config-destination.model';
import { BackupConfigSource } from './backup-config-source.model';

export class BackupConfig {
  @serializable
  public id: string | null = null;
  @serializable
  public name: string = '';
  @serializable
  public frequency: string = '';
  @serializable
  public enabled: boolean = true;
  @serializable
  public to_keep: number = 5;
  @serializable(date)
  public date_created: Date | null = null;
  @serializable(list(object(BackupConfigSource)))
  public sources: BackupConfigSource[] = [];
  @serializable(list(object(BackupConfigDestination)))
  public destinations: BackupConfigDestination[] = [];
  @serializable(list(object(BackupSave)))
  public saves: BackupSave[] = [];
}
