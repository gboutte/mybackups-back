import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBearerAuth, ApiTags } from '@nestjs/swagger';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @ApiBearerAuth()
  getAll() {
    return this.usersService.findAll();
  }
}
