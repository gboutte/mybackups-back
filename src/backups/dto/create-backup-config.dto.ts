import { ApiProperty } from '@nestjs/swagger';
import { IsBoolean, IsInt, IsString } from 'class-validator';

export class CreateBackupConfigDto {
  @ApiProperty({
    description: 'The name of the backup config',
    example: 'Backup test',
  })
  @IsString()
  public readonly name: string;
  @ApiProperty({
    description: 'The number of backups to keep.',
    example: 3,
  })
  @IsInt()
  public readonly to_keep: number;

  @ApiProperty({
    description: 'The frequency as a cron string.',
    example: '0 0 * * *',
  })
  @IsString()
  public readonly frequency: string;

  @ApiProperty({
    description: 'Whether the backup config is enabled.',
    example: true,
  })
  @IsBoolean()
  public readonly enabled: boolean;
}
