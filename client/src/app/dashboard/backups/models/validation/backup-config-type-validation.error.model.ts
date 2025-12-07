import { serializable } from 'serializr';

export class BackupConfigTypeValidationError {
  @serializable
  public parameter!: string;
  @serializable
  public message!: string;
}
