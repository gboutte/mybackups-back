import { serializable } from 'serializr';

export class BackupConfigUpdateDto {
  @serializable
  id: string | null = null;
  @serializable
  name: string = '';
  @serializable
  frequency: string = '';
  @serializable
  enabled: boolean = true;
  @serializable
  to_keep: number = 5;
}
