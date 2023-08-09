import { Body, Controller, Post } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { Install } from '../global/decorators/install.decorator';

@Controller('install')
export class InstallController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @Install()
  async register(@Body() createUserDto: CreateUserDto) {
    return await this.usersService.create(createUserDto);
  }
}
