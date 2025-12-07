import { serializable } from 'serializr';

export class BackupConfigUpdateDto {
  @serializable
  public id: string | null = null;
  @serializable
  public name: string = '';
  @serializable
  public frequency: string = '';
  @serializable
  public enabled: boolean = true;
  @serializable
  public to_keep: number = 5;
}
