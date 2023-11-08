import { serializable } from 'serializr';
import { date } from '../../../global/date-serializable';

export class User {
  @serializable
  id: string = '';
  @serializable
  username: string = '';
  @serializable(date)
  date_created: Date = new Date();
}
