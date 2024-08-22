import { PartialType } from '@nestjs/mapped-types';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsString } from 'class-validator';
import { CreateBackupConfigDestinationDto } from './create-backup-config-destination.dto';

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
