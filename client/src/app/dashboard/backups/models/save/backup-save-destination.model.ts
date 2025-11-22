import { serializable } from 'serializr';
import { anyType } from '../../../../global/any-type-serializable';
import { date } from '../../../../global/date-serializable';

export class BackupSaveDestination {
  @serializable
  public id: string = '';
  @serializable(anyType)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public parameters: any = {};
  @serializable(date)
  public date_created: Date = new Date();
}
