import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Install } from '../global/decorators/install.decorator';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { UsersService } from '../users/users.service';

@Controller('install')
@ApiTags('install')
export class InstallController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @Install()
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }
}
