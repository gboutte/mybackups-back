import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString } from 'class-validator';

export class CreateBackupConfigDestinationDto {
  @ApiProperty({
    description: 'The type of the backup destination',
    example: 'local',
  })
  @IsString()
  readonly type: string;

  @ApiProperty({
    description: 'The data of the backup destination',
    example: [
      {
        path: 'myFolderDestination',
        label: 'Path',
        type: 'string',
      },
    ],
  })
  @IsObject()
  readonly data: any;
}
