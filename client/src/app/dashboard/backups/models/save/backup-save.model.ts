import { list, object, serializable } from 'serializr';
import { date } from '../../../../global/date-serializable';
import { BackupSaveDestination } from './backup-save-destination.model';

export class BackupSave {
  @serializable
  id: string = '';
  @serializable(date)
  date_created: Date = new Date();
  @serializable(list(object(BackupSaveDestination)))
  destinations: BackupSaveDestination[] = [];
}
