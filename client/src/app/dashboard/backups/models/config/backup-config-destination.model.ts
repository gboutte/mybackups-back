import { serializable } from 'serializr';
import { anyType } from '../../../../global/any-type-serializable';
import { date } from '../../../../global/date-serializable';

export class BackupConfigDestination {
  @serializable
  public id!: string;
  @serializable
  public type: string = '';
  @serializable(anyType)
  public parameters: any = '';
  @serializable(date)
  public date_created: Date | null = null;
}
