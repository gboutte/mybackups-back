import { ApiProperty } from '@nestjs/swagger';
import { IsObject, IsString } from 'class-validator';

export class CreateBackupConfigSourceDto {
  @ApiProperty({
    description: 'The type of the backup source',
    example: 'local',
  })
  @IsString()
  readonly type: string;

  @ApiProperty({
    description: 'The data of the backup source',
    example: [
      {
        path: 'myFolderSource',
        label: 'Path',
        type: 'string',
      },
    ],
  })
  @IsObject()
  readonly data: any;
}
