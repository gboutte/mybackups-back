import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class CreateUserDto {
  @ApiProperty({
    description: 'The username of the new user',
    example: 'admin',
  })
  @IsString()
  readonly username: string;
  @ApiProperty({
    description: 'The password of the new user.',
    example: 'P@$$w0rd',
  })
  @IsString()
  readonly password: string;
}
