import { PartialType } from '@nestjs/mapped-types';
import { CreateBackupConfigSourceDto } from './create-backup-config-source.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsString } from 'class-validator';

export class UpdateBackupConfigSourceDto extends PartialType(
  CreateBackupConfigSourceDto,
) {
  @ApiProperty({
    description: 'the id.',
  })
  @IsString()
  readonly id: string;
}
