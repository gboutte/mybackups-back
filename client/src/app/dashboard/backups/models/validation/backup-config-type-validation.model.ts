import { list, object, serializable } from 'serializr';
import { BackupConfigTypeValidationError } from './backup-config-type-validation.error.model';

export class BackupConfigTypeValidation {
  @serializable
  valid!: boolean;
  @serializable(list(object(BackupConfigTypeValidationError)))
  errors!: BackupConfigTypeValidationError[];
}
