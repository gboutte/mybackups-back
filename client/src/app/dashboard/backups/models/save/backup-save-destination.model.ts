import { serializable } from 'serializr';
import { date } from '../../../../global/date-serializable';

export class BackupSaveDestination {
  @serializable
  id: string = '';
  @serializable
  parameters: any = {};
  @serializable(date)
  date_created: Date = new Date();
}
