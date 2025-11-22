import { serializable } from 'serializr';
import { anyType } from '../../../global/any-type-serializable';
export class BackupConfigSourceDto {
  @serializable
  public id!: string;
  @serializable
  public type: string = '';
  @serializable(anyType)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  public parameters: any = '';
}
