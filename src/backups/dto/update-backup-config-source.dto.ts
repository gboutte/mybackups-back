import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateBackupConfigSourceDto } from './create-backup-config-source.dto';

export class UpdateBackupConfigSourceDto extends PartialType(
  CreateBackupConfigSourceDto,
) {
  @ApiProperty({
    description: 'the id.',
  })
  @IsString()
  @IsOptional()
  readonly id: string;
}
