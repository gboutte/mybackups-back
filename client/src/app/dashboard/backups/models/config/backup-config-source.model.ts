import { serializable } from 'serializr';
import { anyType } from '../../../../global/any-type-serializable';
import { date } from '../../../../global/date-serializable';

export class BackupConfigSource {
  @serializable
  id!: string;
  @serializable
  type: string = '';
  @serializable(anyType)
  parameters: any = '';
  @serializable(date)
  date_created!: Date;
}
