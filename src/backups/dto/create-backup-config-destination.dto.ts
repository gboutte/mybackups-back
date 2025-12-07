import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString } from 'class-validator';

export class CreateBackupConfigDestinationDto {
  @ApiProperty({
    description: 'The type of the backup destination',
    example: 'local',
  })
  @IsString()
  public readonly type: string;

  @ApiProperty({
    description: 'The parameters of the backup destination',
    example: {
      path: 'myFolderDestination',
    },
  })
  @IsObject()
  public readonly parameters: Record<string, unknown>;
}
