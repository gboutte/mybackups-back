import { list, object, serializable } from 'serializr';
import { BackupConfigTypeValidationError } from './backup-config-type-validation.error.model';

export class BackupConfigTypeValidation {
  @serializable
  public valid!: boolean;
  @serializable(list(object(BackupConfigTypeValidationError)))
  public errors!: BackupConfigTypeValidationError[];
}
