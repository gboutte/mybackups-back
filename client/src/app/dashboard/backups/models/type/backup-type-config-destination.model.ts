import {list, object, serializable} from "serializr";
import {BackupTypeParameter} from "./backup-type-parameter.model";


export class BackupTypeConfigDestination{
  @serializable
  isDestination: boolean = false;
  @serializable(list(object(BackupTypeParameter)))
  parameters: BackupTypeParameter[] = [];
}
