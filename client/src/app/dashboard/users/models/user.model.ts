import { serializable } from 'serializr';
import { date } from '../../../global/date-serializable';

export class User {
  @serializable
  public id: string = '';
  @serializable
  public username: string = '';
  @serializable(date)
  public date_created: Date = new Date();
}
