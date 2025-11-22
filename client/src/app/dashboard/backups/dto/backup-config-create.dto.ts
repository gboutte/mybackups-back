import { serializable } from 'serializr';

export class BackupConfigCreateDto {
  @serializable
  public name: string = '';
  @serializable
  public frequency: string = '';
  @serializable
  public enabled: boolean = true;
  @serializable
  public to_keep: number = 5;
}
