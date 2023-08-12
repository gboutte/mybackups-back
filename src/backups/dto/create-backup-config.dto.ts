import { ApiProperty } from '@nestjs/swagger';
import {
  IsBoolean,
  IsInt,
  IsObject,
  IsString,
  ValidateNested,
} from 'class-validator';
import { CreateBackupConfigSourceDto } from './create-backup-config-source.dto';
import { Type } from 'class-transformer';
import { CreateBackupConfigDestinationDto } from './create-backup-config-destination.dto';

export class CreateBackupConfigDto {
  @ApiProperty({
    description: 'The name of the backup config',
    example: 'Backup test',
  })
  @IsString()
  readonly name: string;
  @ApiProperty({
    description: 'The number of backups to keep.',
    example: 3,
  })
  @IsInt()
  readonly to_keep: number;

  @ApiProperty({
    description: 'The frequency as a cron string.',
    example: '0 0 * * *',
  })
  @IsString()
  readonly frequency: string;

  @ApiProperty({
    description: 'Whether the backup config is enabled.',
    example: true,
  })
  @IsBoolean()
  readonly enabled: boolean;

  @ApiProperty({
    description: 'The sources config.',
  })
  @IsObject({ each: true })
  @ValidateNested()
  @Type(() => CreateBackupConfigSourceDto)
  readonly sources: CreateBackupConfigSourceDto[];

  @ApiProperty({
    description: 'The destinations config.',
  })
  @IsObject({ each: true })
  @ValidateNested()
  @Type(() => CreateBackupConfigDestinationDto)
  readonly destinations: CreateBackupConfigDestinationDto[];
}
