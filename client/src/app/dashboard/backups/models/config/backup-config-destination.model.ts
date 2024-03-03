import { object, serializable } from 'serializr';
import { date } from '../../../../global/date-serializable';
import { anyType } from '../../../../global/any-type-serializable';

export class BackupConfigDestination {
  @serializable
  id: string = '';
  @serializable
  type: string = '';
  @serializable(anyType)
  parameters: any = '';
  @serializable(date)
  date_created: Date = new Date();
}
