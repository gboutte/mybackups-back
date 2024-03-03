import { serializable } from 'serializr';

export class BackupConfigTypeValidationError {
  @serializable
  parameter!: string;
  @serializable
  message!: string;
}
