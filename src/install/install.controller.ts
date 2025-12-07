import { Body, Controller, Post } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { Install } from '../global/decorators/install.decorator';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';

@Controller('install')
@ApiTags('install')
export class InstallController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register')
  @Install()
  public async register(@Body() createUserDto: CreateUserDto): Promise<User> {
    return await this.usersService.create(createUserDto);
  }
}
