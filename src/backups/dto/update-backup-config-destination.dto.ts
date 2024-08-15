import { PartialType } from '@nestjs/mapped-types';
import { CreateBackupConfigDestinationDto } from './create-backup-config-destination.dto';
import { ApiProperty } from '@nestjs/swagger';
import { IsInt, IsOptional, IsString } from 'class-validator';

export class UpdateBackupConfigDestinationDto extends PartialType(
  CreateBackupConfigDestinationDto,
) {
  @ApiProperty({
    description: 'the id.',
  })
  @IsString()
  @IsOptional()
  readonly id: string;
}
