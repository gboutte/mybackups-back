import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';
import { UpdateBackupConfigDestinationDto } from './update-backup-config-destination.dto';
import { UpdateBackupConfigSourceDto } from './update-backup-config-source.dto';

export class UpdateBackupConfigDto {
  @ApiProperty({
    description: 'The name of the backup config',
    example: 'Backup test',
  })
  @IsString()
  @IsOptional()
  readonly name: string;
  @ApiProperty({
    description: 'The number of backups to keep.',
    example: 3,
  })
  @IsInt()
  @IsOptional()
  readonly to_keep: number;

  @ApiProperty({
    description: 'The frequency as a cron string.',
    example: '0 0 * * *',
  })
  @IsString()
  @IsOptional()
  readonly frequency: string;

  @ApiProperty({
    description: 'Whether the backup config is enabled.',
    example: true,
  })
  @IsBoolean()
  @IsOptional()
  readonly enabled: boolean;

  @ApiProperty({
    description: 'The sources config.',
  })
  @IsObject({ each: true })
  @ValidateNested()
  @Type(() => UpdateBackupConfigSourceDto)
  @IsOptional()
  readonly sources: UpdateBackupConfigSourceDto[];

  @ApiProperty({
    description: 'The destinations config.',
  })
  @IsObject({ each: true })
  @ValidateNested()
  @Type(() => UpdateBackupConfigDestinationDto)
  @IsOptional()
  readonly destinations: UpdateBackupConfigDestinationDto[];
}
