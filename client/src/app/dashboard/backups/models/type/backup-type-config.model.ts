import {serializable} from "serializr";


export class BackupTypeConfig{
  @serializable
  name: string = '';
  @serializable
  code: string = '';
  @serializable
  description: string = '';
}
