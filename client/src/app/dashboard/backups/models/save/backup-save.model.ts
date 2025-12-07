import { list, object, serializable } from 'serializr';
import { date } from '../../../../global/date-serializable';
import { BackupSaveDestination } from './backup-save-destination.model';

export class BackupSave {
  @serializable
  public id: string = '';
  @serializable(date)
  public date_created: Date = new Date();
  @serializable(list(object(BackupSaveDestination)))
  public destinations: BackupSaveDestination[] = [];
  @serializable
  public mimetype: string = '';
  @serializable
  public filename: string = '';
}
