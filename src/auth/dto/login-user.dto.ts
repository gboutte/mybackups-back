import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';

export class LoginUserDto {
  @ApiProperty({
    description: 'The username of your account',
    example: 'admin',
  })
  @IsString()
  readonly username: string;
  @ApiProperty({
    description: 'The password of your account.',
    example: 'P@$$w0rd',
  })
  @IsString()
  readonly password: string;
}
