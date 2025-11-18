import { serializable } from 'serializr';
import {anyType} from "../../../global/any-type-serializable";
export class BackupConfigSourceDto {
  @serializable
  id!: string;
  @serializable
  type: string = '';
  @serializable(anyType)
  parameters: any = '';
}
