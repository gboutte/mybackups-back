import { list, object, serializable } from 'serializr';
import { BackupConfigSource } from './backup-config-source.model';
import { BackupConfigDestination } from './backup-config-destination.model';
import { date } from '../../../../global/date-serializable';
import { BackupSave } from '../save/backup-save.model';

export class BackupConfig {
  @serializable
  id: string | null = null;
  @serializable
  name: string = '';
  @serializable
  frequency: string = '';
  @serializable
  enabled: boolean = true;
  @serializable
  to_keep: number = 5;
  @serializable(date)
  date_created: Date | null = null;
  @serializable(list(object(BackupConfigSource)))
  sources: BackupConfigSource[] = [];
  @serializable(list(object(BackupConfigDestination)))
  destinations: BackupConfigDestination[] = [];
  @serializable(list(object(BackupSave)))
  saves: BackupSave[] | null = null;
}
