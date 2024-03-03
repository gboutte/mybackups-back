import { list, object, serializable } from 'serializr';
import { BackupSaveDestination } from './backup-save-destination.model';
import { date } from '../../../../global/date-serializable';

export class BackupSave {
  @serializable
  id: string = '';
  @serializable(date)
  date_created: Date = new Date();
  @serializable(list(object(BackupSaveDestination)))
  destinations: BackupSaveDestination[] = [];
}
